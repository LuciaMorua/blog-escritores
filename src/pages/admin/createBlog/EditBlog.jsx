import React, { useState, useEffect } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, ContentState, convertToRaw, convertFromHTML } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Layout from '../../../components/layout/Layout';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { fireDb, storage, auth } from "../../../firebase/FirebaseConfig";
import { toast } from "sonner";

function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState({
    title: '',
    category: '',
    thumbnail: '',
  });
  
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [loading, setLoading] = useState(false);
  const [fetchingBlog, setFetchingBlog] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // Cargar el blog existente
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const currentUser = auth.currentUser;
        
        if (!currentUser) {
          toast.error('Debes iniciar sesión');
          navigate('/adminlogin');
          return;
        }

        const blogRef = doc(fireDb, "blogPost", id);
        const blogSnap = await getDoc(blogRef);

        if (!blogSnap.exists()) {
          toast.error('Blog no encontrado');
          navigate('/dashboard');
          return;
        }

        const blogData = blogSnap.data();
        
        // Verificar permisos: debe ser el autor O admin
        const userRef = doc(fireDb, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.exists() ? userSnap.data() : {};
        const isAdmin = userData.isAdmin === true || userData.role === "admin" || userData.role === "Admin";
        
        if (blogData.userId !== currentUser.uid && !isAdmin) {
          toast.error('No tienes permiso para editar este blog');
          navigate('/dashboard');
          return;
        }

        // Establecer los datos del blog
        setBlog({
          title: blogData.title || '',
          category: blogData.category || '',
          thumbnail: blogData.thumbnail || '',
        });

        // Cargar el contenido HTML en el editor
        if (blogData.content) {
          const blocksFromHTML = convertFromHTML(blogData.content);
          const contentState = ContentState.createFromBlockArray(
            blocksFromHTML.contentBlocks,
            blocksFromHTML.entityMap
          );
          setEditorState(EditorState.createWithContent(contentState));
        }

        setImagePreview(blogData.thumbnail || '');
        
      } catch (error) {
        console.error('Error al cargar el blog:', error);
        toast.error('Error al cargar el blog');
        navigate('/dashboard');
      } finally {
        setFetchingBlog(false);
      }
    };

    fetchBlog();
  }, [id, navigate]);

  // Función para manejar la selección de archivo
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor selecciona solo imágenes');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('La imagen no debe superar los 5MB');
        return;
      }

      setImageFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Función para subir imagen a Firebase Storage
  const uploadImage = async () => {
    if (!imageFile) return blog.thumbnail;

    setUploadingImage(true);

    try {
      const timestamp = Date.now();
      const fileName = `blog-images/${timestamp}-${imageFile.name}`;
      const storageRef = ref(storage, fileName);

      await uploadBytes(storageRef, imageFile);
      const downloadURL = await getDownloadURL(storageRef);
      
      toast.success('Imagen subida correctamente');
      return downloadURL;

    } catch (error) {
      console.error('Error al subir imagen:', error);
      toast.error('Error al subir la imagen');
      throw error;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const content = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    
    if (!blog.title || !blog.category || !content) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    setLoading(true);

    try {
      // Subir nueva imagen si hay un archivo seleccionado
      let thumbnailURL = blog.thumbnail || '';
      if (imageFile) {
        thumbnailURL = await uploadImage();
      }

      const currentUser = auth.currentUser;

      if (!currentUser) {
        toast.error('Debes estar autenticado para editar un blog');
        setLoading(false);
        return;
      }

      // Actualizar el documento en Firestore
      const blogRef = doc(fireDb, "blogPost", id);
      
      await updateDoc(blogRef, {
        title: blog.title,
        category: blog.category,
        content: content,
        thumbnail: thumbnailURL,
        updatedAt: Timestamp.now(),
        lastModified: new Date().toLocaleString("es-AR", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
      });
      
      toast.success('¡Blog actualizado exitosamente!');
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Error al actualizar el blog:', error);
      toast.error('Error al actualizar el blog. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingBlog) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-green-50 via-amber-50 to-green-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
            <p className="text-green-900 font-semibold">Cargando blog...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-green-50 via-amber-50 to-green-100 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-green-900">
              ✏️ Editar Blog
            </h1>
            <p className="text-green-700">
              Modifica los campos que desees actualizar
            </p>
          </div>

          <form 
            onSubmit={handleSubmit} 
            className="space-y-6 p-6 rounded-lg bg-white border border-green-200 shadow-lg"
          >
            {/* Título */}
            <div>
              <label className="block mb-2 font-semibold text-green-900">
                Título del artículo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Ej: Introducción a la poesía moderna"
                value={blog.title}
                onChange={(e) => setBlog({ ...blog, title: e.target.value })}
                disabled={loading}
                className="w-full px-4 py-3 rounded-lg transition-all bg-green-50 text-green-900 border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
              />
            </div>

            {/* Categoría */}
            <div>
              <label className="block mb-2 font-semibold text-green-900">
                Categoría <span className="text-red-500">*</span>
              </label>
              <select
                value={blog.category}
                onChange={(e) => setBlog({ ...blog, category: e.target.value })}
                disabled={loading}
                className="w-full px-4 py-3 rounded-lg transition-all bg-green-50 text-green-900 border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
              >
                <option value="">Selecciona una categoría</option>
                <option value="Poesía">Poesía</option>
                <option value="Narrativa">Narrativa</option>
                <option value="Cultura">Cultura</option>
                <option value="Literatura">Literatura</option>
                <option value="Talleres">Talleres</option>
                <option value="Inspiración">Inspiración</option>
                <option value="Opinion">Opinión</option>
              </select>
            </div>

            {/* Imagen */}
            <div>
              <label className="block mb-2 font-semibold text-green-900">
                Imagen del artículo <span className="text-green-600 text-sm font-normal">(opcional)</span>
              </label>

              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(blog.thumbnail);
                  }}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    !imageFile 
                      ? 'bg-green-600 text-white' 
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  URL de imagen
                </button>
                <button
                  type="button"
                  onClick={() => {
                    document.getElementById('file-input').click();
                  }}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    imageFile 
                      ? 'bg-amber-600 text-white' 
                      : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                  }`}
                >
                  Cambiar archivo
                </button>
              </div>

              <input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={loading || uploadingImage}
                className="hidden"
              />

              {!imageFile && (
                <input
                  type="url"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  value={blog.thumbnail}
                  onChange={(e) => {
                    setBlog({ ...blog, thumbnail: e.target.value });
                    setImagePreview(e.target.value);
                  }}
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-lg transition-all bg-green-50 text-green-900 border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                />
              )}

              {imageFile && (
                <div className="px-4 py-3 rounded-lg border border-green-200 bg-green-50 flex items-center justify-between">
                  <span className="text-green-900 truncate">
                    📎 {imageFile.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(blog.thumbnail);
                    }}
                    className="ml-2 text-red-500 hover:text-red-700 font-bold"
                  >
                    ✕
                  </button>
                </div>
              )}

              {imagePreview && (
                <div className="mt-3">
                  <p className="text-sm mb-2 text-green-700">Vista previa:</p>
                  <img 
                    src={imagePreview}
                    alt="Preview" 
                    className="w-full max-w-md h-48 object-cover rounded-lg border-2 border-green-200 shadow-md"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Editor de contenido */}
            <div>
              <label className="block mb-2 font-semibold text-green-900">
                Contenido del artículo <span className="text-red-500">*</span>
              </label>
              <div className="rounded-lg overflow-hidden border-2 border-green-200 bg-white shadow-md">
                <Editor
                  editorState={editorState}
                  onEditorStateChange={setEditorState}
                  readOnly={loading}
                  toolbar={{
                    options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'link', 'embedded', 'emoji', 'image', 'remove', 'history'],
                    inline: { options: ['bold', 'italic', 'underline', 'strikethrough'] },
                    blockType: { inDropdown: true },
                    fontSize: { inDropdown: true },
                    list: { inDropdown: false, options: ['unordered', 'ordered'] },
                    textAlign: { inDropdown: false },
                    link: { inDropdown: false },
                  }}
                  editorStyle={{
                    height: '400px',
                    padding: '15px',
                    color: '#14532d',
                    background: 'white',
                    minHeight: '400px'
                  }}
                  toolbarStyle={{
                    background: '#f0fdf4',
                    border: 'none',
                    borderBottom: '2px solid #bbf7d0',
                  }}
                  placeholder="Escribe tu artículo aquí..."
                />
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading || uploadingImage}
                className="px-8 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700 text-white"
              >
                {loading ? '💾 Guardando...' : uploadingImage ? '⬆️ Subiendo imagen...' : '✅ Guardar Cambios'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                disabled={loading || uploadingImage}
                className="px-8 py-3 rounded-lg font-semibold transition-all hover:opacity-90 disabled:opacity-50 bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                ← Cancelar
              </button>
            </div>
          </form>

          <div className="mt-6 p-4 rounded-lg bg-amber-50 border border-amber-200">
            <p className="text-sm text-amber-900">
              <strong>⚠️ Nota:</strong>
              <br />
              • Los cambios se guardarán permanentemente
              <br />
              • Podés cambiar la imagen o mantener la actual
              <br />
              • Revisá bien antes de guardar
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default EditBlog;
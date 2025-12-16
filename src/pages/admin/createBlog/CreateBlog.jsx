import React, { useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Layout from '../../../components/layout/Layout';
import { useNavigate } from 'react-router-dom';
import { Timestamp, collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { fireDb, storage, auth } from "../../../firebase/FirebaseConfig";
import { toast } from "sonner";

function CreateBlog() {
  
  
  const navigate = useNavigate();

  const [blog, setBlog] = useState({
    title: '',
    category: '',
    thumbnail: '',
  });
  
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // Función para manejar la selección de archivo
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor selecciona solo imágenes');
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('La imagen no debe superar los 5MB');
        return;
      }

      setImageFile(file);
      
      // Crear preview local
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
      // Crear referencia única para la imagen
      const timestamp = Date.now();
      const fileName = `blog-images/${timestamp}-${imageFile.name}`;
      const storageRef = ref(storage, fileName);

      // Subir archivo
      await uploadBytes(storageRef, imageFile);

      // Obtener URL de descarga
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
    
    // Convertir el contenido del editor a HTML
    const content = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    
    // Validación básica
    if (!blog.title || !blog.category || !content) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    setLoading(true);

    try {
      // Subir imagen si hay un archivo seleccionado
      let thumbnailURL = blog.thumbnail || '';
      if (imageFile) {
        thumbnailURL = await uploadImage();
      }

      // Obtener usuario autenticado
      const currentUser = auth.currentUser;

      if (!currentUser) {
        toast.error('Debes estar autenticado para crear un blog');
        setLoading(false);
        return;
      }

      // Crear el objeto completo del blog
      const blogData = {
        title: blog.title,
        category: blog.category,
        content: content,
        thumbnail: thumbnailURL,
        time: Timestamp.now(),
        date: new Date().toLocaleString("es-AR", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
        userId: currentUser.uid,
        authorEmail: currentUser.email || "Sin autor",
        authorName: currentUser.displayName || "Usuario anónimo",
      };

      // Guardar en Firestore
      const docRef = await addDoc(collection(fireDb, "blogPost"), blogData);
      
      console.log('Blog guardado con ID:', docRef.id);
      toast.success('¡Blog publicado exitosamente!');
      
      // Limpiar el formulario
      setBlog({
        title: '',
        category: '',
        thumbnail: '',
      });
      setEditorState(EditorState.createEmpty());
      setImageFile(null);
      setImagePreview('');
      
      // Redirigir al dashboard
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Error al guardar el blog:', error);
      toast.error('Error al publicar el blog. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-green-50 via-amber-50 to-green-100 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-green-900">
              ✍️ Crear Nuevo Blog
            </h1>
            <p className="text-green-700">
              Completa el formulario para crear un nuevo artículo
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

            {/* Imagen - Subir archivo O URL (OPCIONAL) */}
            <div>
              <label className="block mb-2 font-semibold text-green-900">
                Imagen del artículo <span className="text-green-600 text-sm font-normal">(opcional)</span>
              </label>

              {/* Tabs para elegir método */}
              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview('');
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
                    setBlog({ ...blog, thumbnail: '' });
                    document.getElementById('file-input').click();
                  }}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    imageFile 
                      ? 'bg-amber-600 text-white' 
                      : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                  }`}
                >
                  Subir archivo
                </button>
              </div>

              {/* Input de archivo (oculto) */}
              <input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={loading || uploadingImage}
                className="hidden"
              />

              {/* Input de URL */}
              {!imageFile && (
                <input
                  type="url"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  value={blog.thumbnail}
                  onChange={(e) => setBlog({ ...blog, thumbnail: e.target.value })}
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-lg transition-all bg-green-50 text-green-900 border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                />
              )}

              {/* Información del archivo seleccionado */}
              {imageFile && (
                <div className="px-4 py-3 rounded-lg border border-green-200 bg-green-50 flex items-center justify-between">
                  <span className="text-green-900 truncate">
                    📎 {imageFile.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview('');
                    }}
                    className="ml-2 text-red-500 hover:text-red-700 font-bold"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Vista previa */}
              {(blog.thumbnail || imagePreview) && (
                <div className="mt-3">
                  <p className="text-sm mb-2 text-green-700">
                    Vista previa:
                  </p>
                  <img 
                    src={imagePreview || blog.thumbnail}
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
                {loading ? '📤 Publicando...' : uploadingImage ? '⬆️ Subiendo imagen...' : '✅ Publicar Blog'}
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

          {/* Información adicional */}
          <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
            <p className="text-sm text-blue-900">
              <strong>💡 Consejos:</strong>
              <br />
              • El título y la categoría son obligatorios
              <br />
              • La imagen es opcional pero hace tu artículo más atractivo
              <br />
              • Podés usar el editor para dar formato a tu texto
              <br />
              • Guardá tu trabajo frecuentemente
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default CreateBlog;
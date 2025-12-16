import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { doc, getDoc } from 'firebase/firestore';
import { fireDb } from '../../firebase/FirebaseConfig';
import { toast } from 'sonner';

function BlogInfo() {
  
  const { id } = useParams();

  const [blog, setBlog] = useState(null);
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogAndAuthor = async () => {
      try {
        // Obtener el blog
        const docRef = doc(fireDb, 'blogPost', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const blogData = {
            id: docSnap.id,
            ...docSnap.data()
          };
          setBlog(blogData);

          // Obtener datos del autor
          if (blogData.userId) {
            const authorRef = doc(fireDb, 'users', blogData.userId);
            const authorSnap = await getDoc(authorRef);
            
            if (authorSnap.exists()) {
              setAuthor(authorSnap.data());
            }
          }
        } else {
          toast.error('Blog no encontrado');
        }
      } catch (error) {
        console.error('Error al obtener el blog:', error);
        toast.error('Error al cargar el blog');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogAndAuthor();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen bg-gradient-to-b from-green-50 via-amber-50 to-green-100">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </Layout>
    );
  }

  if (!blog) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-green-50 via-amber-50 to-green-100 py-10 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4 text-green-900">
              Blog no encontrado
            </h1>
            <Link
              to="/allBlogs"
              className="inline-block px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90 shadow-lg bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700 text-white"
            >
              Volver a todos los blogs
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  // Nombre del autor con fallbacks
  const authorName = author?.name || author?.displayName || blog.authorName || 'Escritor Anónimo';
  const authorPhoto = author?.photoURL || null;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-green-50 via-amber-50 to-green-100 py-10 px-4">
        <article className="max-w-4xl mx-auto">
          {/* Imagen principal - Solo se muestra si existe */}
          {blog.thumbnail && (
            <img
              src={blog.thumbnail}
              alt={blog.title}
              className="w-full h-96 object-cover rounded-xl mb-8 shadow-lg border-4 border-green-200"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}

          {/* Container del contenido */}
          <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-green-200">
            {/* Metadata */}
            <div className="mb-8">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <span className="px-4 py-2 rounded-full text-sm font-semibold bg-amber-500 text-white shadow-md">
                  {blog.category}
                </span>
                <span className="text-sm text-green-700">
                  📅 {blog.date}
                </span>
              </div>

              {/* Información del autor */}
              <div className="flex items-center gap-4 mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                {/* Foto del autor - Solo se muestra si existe */}
                {authorPhoto ? (
                  <img
                    src={authorPhoto}
                    alt={authorName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-green-500"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-600 to-amber-600 flex items-center justify-center border-2 border-green-500">
                    <span className="text-white font-bold text-lg">
                      {authorName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                
                <div>
                  <p className="text-sm text-green-700">Escrito por</p>
                  <Link 
                    to={blog.userId ? `/writer/${blog.userId}` : '#'}
                    className="font-semibold text-green-900 hover:text-green-700 transition-colors"
                  >
                    {authorName}
                  </Link>
                </div>
              </div>

              {/* Título */}
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-green-900">
                {blog.title}
              </h1>

              {/* Divisor */}
              <hr className="my-6 border-green-200" />
            </div>

            {/* Contenido */}
            <div
              className="prose prose-lg max-w-none text-green-800"
              style={{
                color: '#166534',
              }}
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Pie de página */}
            <div className="mt-12 pt-8 border-t border-green-200">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Mini foto del autor en el footer */}
                  {authorPhoto ? (
                    <img
                      src={authorPhoto}
                      alt={authorName}
                      className="w-10 h-10 rounded-full object-cover border-2 border-green-500"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-amber-600 flex items-center justify-center border-2 border-green-500">
                      <span className="text-white font-bold text-sm">
                        {authorName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm text-green-700">
                      📅 Publicado el {blog.date}
                    </p>
                    <p className="text-sm text-green-700">
                      ✍️ Por <span className="font-semibold text-green-900">{authorName}</span>
                    </p>
                  </div>
                </div>
                
                {blog.userId ? (
                  <Link
                    to={`/writer/${blog.userId}`}
                    className="px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90 shadow-lg bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700 text-white hover:shadow-xl"
                  >
                    Más artículos de {authorName.split(' ')[0]} →
                  </Link>
                ) : (
                  <Link
                    to="/allBlogs"
                    className="px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90 shadow-lg bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700 text-white hover:shadow-xl"
                  >
                    Ver más artículos →
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Botón volver adicional */}
          <div className="mt-8 text-center">
            <Link
              to="/allBlogs"
              className="inline-block px-6 py-2 rounded-lg font-semibold transition-all hover:opacity-90 bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              ← Volver a todos los blogs
            </Link>
          </div>
        </article>
      </div>
    </Layout>
  );
}

export default BlogInfo;
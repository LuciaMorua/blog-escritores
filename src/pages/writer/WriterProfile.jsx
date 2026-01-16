import React, { useState, useEffect} from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { fireDb } from '../../firebase/FirebaseConfig';
import { toast } from 'sonner';

function WriterProfile() {
  
  const { id } = useParams();

  const [writer, setWriter] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWriterAndBlogs = async () => {
      try {
        const writerDoc = await getDoc(doc(fireDb, 'users', id));
        
        if (writerDoc.exists()) {
          setWriter({ id: writerDoc.id, ...writerDoc.data() });
          
          const blogsQuery = query(
            collection(fireDb, 'blogPost'),
            where('userId', '==', id),
            orderBy('title', 'asc')
          );
          
          const blogsSnapshot = await getDocs(blogsQuery);
          const blogsArray = [];
          
          blogsSnapshot.forEach((doc) => {
            blogsArray.push({
              id: doc.id,
              ...doc.data()
            });
          });
          
          setBlogs(blogsArray);
        } else {
          toast.error('Escritor no encontrado');
        }
      } catch (error) {
        console.error('Error al obtener datos:', error);
        toast.error('Error al cargar el perfil del escritor');
      } finally {
        setLoading(false);
      }
    };

    fetchWriterAndBlogs();
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

  if (!writer) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen bg-gradient-to-b from-green-50 via-amber-50 to-green-100">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-green-900">
              Escritor no encontrado
            </h1>
            <Link to="/allBlogs">
              <button className="px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90 shadow-lg bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700 text-white">
                Volver a Escritores
              </button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-green-50 via-amber-50 to-green-100 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header del perfil */}
          <div className="rounded-xl p-8 mb-8 bg-white border-2 border-green-200 shadow-lg">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Foto de perfil */}
              <div className="flex-shrink-0">
                {writer.photoURL ? (
                  <img 
                    className="w-40 h-40 rounded-full object-cover border-4 shadow-lg border-green-500" 
                    src={writer.photoURL}
                    alt={writer.name}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : (
                  <div className="w-40 h-40 rounded-full flex items-center justify-center border-4 shadow-lg bg-gradient-to-br from-green-600 to-amber-600 border-green-500">
                    <span className="text-7xl font-bold text-white">
                      {writer.name ? writer.name.charAt(0).toUpperCase() : '?'}
                    </span>
                  </div>
                )}
              </div>

              {/* Información del escritor */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-bold mb-3 text-green-900">
                  {writer.name || writer.displayName || 'Escritor'}
                </h1>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4 text-green-700">
                  {writer.email && (
                    <span className="flex items-center gap-2">
                      📧 {writer.email}
                    </span>
                  )}
                  
                  {writer.provincia && (
                    <span className="flex items-center gap-2">
                      📍 {writer.provincia}{writer.pais ? `, ${writer.pais}` : ''}
                    </span>
                  )}
                </div>

                <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4 bg-gradient-to-r from-green-600 to-amber-600 text-white shadow-md">
                  ✍️ Escritor
                </span>

                {writer.bio && (
                  <p className="mt-4 text-lg leading-relaxed text-green-800">
                    {writer.bio}
                  </p>
                )}

                <div className="mt-4 text-lg font-semibold text-green-900">
                  📝 {blogs.length} {blogs.length === 1 ? 'artículo publicado' : 'artículos publicados'}
                </div>
              </div>
            </div>
          </div>

          {/* Sección de artículos */}
          <div>
            <h2 className="text-3xl font-bold mb-6 text-green-900">
              Artículos de {writer.name?.split(' ')[0] || 'este escritor'}
            </h2>

            {blogs.length === 0 ? (
              <div className="text-center py-12 rounded-lg bg-white border-2 border-green-200 text-green-700">
                <p className="text-lg">Este escritor aún no ha publicado artículos</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((blog) => (
                  <Link 
                    key={blog.id} 
                    to={`/blogInfo/${blog.id}`}
                    className="group"
                  >
                    <div className="h-full shadow-lg hover:-translate-y-2 cursor-pointer hover:shadow-2xl rounded-xl overflow-hidden transition-all duration-300 bg-white border-2 border-green-200 hover:border-green-400">
                      {/* Imagen del blog */}
                      <div className="relative overflow-hidden h-48">
                        <img 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                          src={blog.thumbnail}
                          alt={blog.title}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x300?text=Imagen+no+disponible';
                          }}
                        />
                      </div>

                      {/* Contenido */}
                      <div className="p-5">
                        <span className="text-xs font-semibold px-3 py-1 rounded-full inline-block mb-2 bg-amber-500 text-white">
                          {blog.category}
                        </span>

                        <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-green-600 transition-colors text-green-900">
                          {blog.title}
                        </h3>

                        <p className="text-sm leading-relaxed mb-3 line-clamp-3 text-green-700">
                          {blog.content ? blog.content.replace(/<[^>]*>/g, '') : 'Sin contenido disponible'}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-green-600">
                            📅 {blog.date}
                          </span>
                          
                          <span className="text-sm font-semibold text-green-700 group-hover:text-green-900">
                            Leer más →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Botón volver */}
          <div className="mt-10 text-center">
            <Link to="/allBlogs">
              <button className="px-8 py-3 rounded-lg font-semibold transition-all hover:opacity-90 bg-gray-200 text-gray-800 hover:bg-gray-300 shadow-md">
                ← Volver a todos los escritores
              </button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default WriterProfile;
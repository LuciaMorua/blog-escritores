import React, { useState, useEffect } from 'react';

import Layout from '../../components/layout/Layout';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { fireDb } from '../../firebase/FirebaseConfig';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

function AllBlogs() {
  
  
  
  const [writers, setWriters] = useState([]);
  const [loading, setLoading] = useState(true);

  // Obtener escritores de Firestore
  useEffect(() => {
    const fetchWriters = async () => {
      try {
        // Obtener solo usuarios que sean escritores
        const q = query(
          collection(fireDb, 'users'),
          where('role', '==', 'writer')
        );
        
        const querySnapshot = await getDocs(q);
        const writersArray = [];

        querySnapshot.forEach((doc) => {
          writersArray.push({
            id: doc.id,
            ...doc.data()
          });
        });

        setWriters(writersArray);
      } catch (error) {
        console.error('Error al obtener escritores:', error);
        toast.error('Error al cargar los escritores');
      } finally {
        setLoading(false);
      }
    };

    fetchWriters();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen bg-gradient-to-b from-green-50 via-amber-50 to-green-100">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className='bg-gradient-to-b from-green-50 via-amber-50 to-green-100 min-h-screen'>
        <div className='container px-5 py-10 mx-auto max-w-7xl'>
          <div className='mb-5'>
            <h1 className='text-center text-3xl font-medium title-font mb-4 text-green-900'>
              Escritores de Tucumán
            </h1>
            <p className='text-center text-base text-green-800'>
              Conoce a los talentosos escritores tucumanos
            </p>
          </div>
          
          <div className='flex flex-wrap justify-center -m-4 mb-5'>
            {writers.length === 0 ? (
              <div className='text-center py-12 w-full text-green-800'>
                <p className='text-lg'>No hay escritores registrados aún</p>
              </div>
            ) : (
              writers.map((writer) => (
                <Link 
                  key={writer.id} 
                  to={`/writer/${writer.id}`} 
                  className='p-4 md:w-1/3 lg:w-1/4'
                >
                  <div 
                    className='h-full bg-white shadow-lg hover:-translate-y-1 cursor-pointer hover:shadow-xl rounded-xl overflow-hidden transition-all border border-green-200'
                  >
                    {/* Foto de perfil */}
                    <div className="w-full h-48 bg-gradient-to-br from-green-400 to-amber-400 flex items-center justify-center">
                      {writer.photoURL ? (
                        <img 
                          className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg" 
                          src={writer.photoURL}
                          alt={writer.name || 'Escritor'}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = `
                              <div class="w-32 h-32 rounded-full bg-white flex items-center justify-center border-4 border-white shadow-lg">
                                <span class="text-5xl font-bold text-green-600">
                                  ${writer.name ? writer.name.charAt(0).toUpperCase() : '?'}
                                </span>
                              </div>
                            `;
                          }}
                        />
                      ) : (
                        <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center border-4 border-white shadow-lg">
                          <span className="text-5xl font-bold text-green-600">
                            {writer.name ? writer.name.charAt(0).toUpperCase() : '?'}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className='p-6 text-center'>
                      <h1 className='title-font text-xl font-bold mb-2 text-green-900'>
                        {writer.name || 'Nombre no disponible'}
                      </h1>
                      
                      {writer.email && (
                        <p className='text-sm mb-3 text-green-700'>
                          📧 {writer.email}
                        </p>
                      )}

                      {writer.bio && (
                        <p className='leading-relaxed mb-3 line-clamp-3 text-sm text-green-800'>
                          {writer.bio}
                        </p>
                      )}

                      <div className='inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-green-600 to-amber-600 text-white'>
                        ✍️ Escritor
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default AllBlogs;
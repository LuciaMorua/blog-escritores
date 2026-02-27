import React, { useState, useEffect } from "react";
import Layout from "../../../components/layout/Layout";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, fireDb } from "../../../firebase/FirebaseConfig";
import { collection, getDocs, deleteDoc, doc, getDoc, updateDoc, query, where } from "firebase/firestore";
import { toast } from "sonner";

function Dashboard() {
  
  const navigate = useNavigate();

  // Estados
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Estados para gestión de usuarios (admin)
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [updating, setUpdating] = useState(null);

  // Obtener usuario autenticado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/adminlogin');
        return;
      }
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, [navigate]);

  // Obtener datos del perfil desde Firestore
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (currentUser) {
          const docRef = doc(fireDb, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setUserProfile(userData);
            setIsAdmin(userData.isAdmin === true || userData.role === "admin" || userData.role === "Admin");
          }
        }
      } catch (error) {
        console.error('Error al obtener perfil:', error);
      }
    };

    fetchUserProfile();
  }, [currentUser]);

  // Obtener SOLO los blogs del usuario actual
  useEffect(() => {
    const fetchBlogs = async () => {
      if (!currentUser) return;
      
      try {
        // FILTRAR solo blogs del usuario actual
        const q = query(
          collection(fireDb, 'blogPost'),
          where('userId', '==', currentUser.uid)
        );
        
        const querySnapshot = await getDocs(q);
        const blogsArray = [];

        querySnapshot.forEach((doc) => {
          blogsArray.push({
            id: doc.id,
            ...doc.data()
          });
        });

        // Ordenar alfabéticamente por título
        blogsArray.sort((a, b) => {
          const titleA = (a.title || '').toLowerCase();
          const titleB = (b.title || '').toLowerCase();
          return titleA.localeCompare(titleB);
        });

        setBlogs(blogsArray);
      } catch (error) {
        console.error('Error al obtener blogs:', error);
        toast.error('Error al cargar los blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [currentUser]);

  // Obtener todos los usuarios (solo si es admin)
  useEffect(() => {
    const fetchUsers = async () => {
      if (!isAdmin) return;
      
      setLoadingUsers(true);
      try {
        const querySnapshot = await getDocs(collection(fireDb, 'users'));
        const usersArray = [];

        querySnapshot.forEach((doc) => {
          usersArray.push({
            id: doc.id,
            ...doc.data()
          });
        });

        setUsers(usersArray);
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
        toast.error('Error al cargar usuarios');
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [isAdmin]);

  // Función para eliminar blog (con validación)
  const handleDelete = async (blogId, blogUserId) => {
    // Verificar que el usuario sea el dueño del blog O sea admin
    if (blogUserId !== currentUser.uid && !isAdmin) {
      toast.error('No tienes permiso para eliminar este blog');
      return;
    }
    
    if (window.confirm('¿Estás seguro de eliminar este artículo?')) {
      try {
        await deleteDoc(doc(fireDb, 'blogPost', blogId));
        setBlogs(blogs.filter(blog => blog.id !== blogId));
        toast.success('Blog eliminado correctamente');
      } catch (error) {
        console.error('Error al eliminar:', error);
        toast.error('Error al eliminar el blog');
      }
    }
  };

  // Función para editar blog (con validación)
  const handleEdit = (blogId, blogUserId) => {
    // Verificar que el usuario sea el dueño del blog O sea admin
    if (blogUserId !== currentUser.uid && !isAdmin) {
      toast.error('No tienes permiso para editar este blog');
      return;
    }
    
    navigate(`/editblog/${blogId}`);
  };

  // Convertir usuario en escritor
  const makeWriter = async (userId, currentRole) => {
    if (updating) return;
    
    setUpdating(userId);
    
    try {
      const userRef = doc(fireDb, 'users', userId);
      
      if (currentRole === 'writer') {
        await updateDoc(userRef, {
          role: 'user'
        });
        toast.success('Rol de escritor removido');
      } else {
        await updateDoc(userRef, {
          role: 'writer'
        });
        toast.success('Usuario convertido en escritor');
      }
      
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, role: currentRole === 'writer' ? 'user' : 'writer' }
          : user
      ));
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      toast.error('Error al actualizar el rol');
    } finally {
      setUpdating(null);
    }
  };

  // Pantalla de carga
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
      <div className="min-h-screen bg-gradient-to-b from-green-50 via-amber-50 to-green-100 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Sección de perfil */}
          <div className="bg-white rounded-2xl shadow-lg border border-green-200 p-8 mb-8">
            <div className="flex flex-wrap justify-start items-center lg:justify-center gap-6 lg:gap-10">
              <div className="left">
                <img 
                  className="w-40 h-40 object-cover rounded-full border-4 border-green-500 p-1 shadow-lg" 
                  src={userProfile?.photoURL || currentUser?.photoURL || "https://cdn.goenhance.ai/user/2024/07/12/0a2640eb-1120-42e1-8478-eb2a5c19367b_0.jpg"}
                  alt="profile"
                />
              </div>
              <div className="right">
                <h1 className="text-center font-bold text-3xl mb-2 text-green-900">
                  {userProfile?.name || currentUser?.displayName || "Usuario"}
                </h1>
                <p className="text-center mb-3 text-green-700">
                  Bienvenido a tu panel de control
                </p>
                
                {isAdmin && (
                  <div className="flex justify-center mb-2">
                    <span className="px-4 py-1 bg-gradient-to-r from-amber-600 to-green-600 text-white rounded-full text-sm font-bold">
                      ⭐ Administrador
                    </span>
                  </div>
                )}
                
                {userProfile?.provincia && userProfile?.pais && (
                  <p className="text-center text-sm text-green-700">
                    📍 {userProfile.provincia}, {userProfile.pais}
                  </p>
                )}
              </div>
            </div>

            <hr className="my-6 border-green-200" />

            {/* Información del usuario */}
            <div className="space-y-3 mb-6">
              <h2 className="font-semibold text-lg text-green-900">
                Información
              </h2>

              <div>
                <p className="text-sm text-green-700">Correo:</p>
                <h2 className="font-semibold text-green-900">
                  <span className="text-blue-600">{currentUser?.email}</span>
                </h2>
              </div>

              {userProfile?.bio && (
                <div>
                  <p className="text-sm text-green-700">Sobre mí:</p>
                  <p className="text-green-900">{userProfile.bio}</p>
                </div>
              )}

              <h2 className="font-semibold pt-2 text-green-900">
                <span>Artículos publicados: </span>
                <span className="text-amber-600">{blogs.length}</span>
              </h2>
            </div>

            {/* Botones de acción */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              {/* Crear Blog */}
              <Link to="/createblog" className="w-full">
                <button className="w-full px-6 py-4 rounded-xl font-semibold bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700 text-white transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 group">
                  <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Crear artículo</span>
                </button>
              </Link>

              {/* Editar Perfil */}
              <Link to="/editProfile" className="w-full">
                <button className="w-full px-6 py-4 rounded-xl font-semibold bg-white hover:bg-gray-50 text-green-700 border-2 border-green-600 hover:border-green-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group">
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Editar Perfil</span>
                </button>
              </Link>

              {/* Crear Escritor (solo admin) */}
              {isAdmin && (
                <Link to="/create-writer" className="w-full">
                  <button className="w-full px-6 py-4 rounded-xl font-semibold bg-white hover:bg-purple-50 text-purple-700 border-2 border-purple-600 hover:border-purple-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group">
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    <span>Nuevo Escritor</span>
                  </button>
                </Link>
              )}
            </div>
          </div>

          {/* Tabla de artículos */}
          <div className="bg-white rounded-2xl shadow-lg border border-green-200 p-8">
            <h2 className="text-2xl font-bold mb-6 text-green-900">
              Mis Artículos (ordenados alfabéticamente)
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-green-100 to-amber-100">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-green-900">#</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-green-900">Imagen</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-green-900">Título</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-green-900">Categoría</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-green-900">Fecha</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-green-900">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-4 py-8 text-center text-green-700">
                        No hay artículos todavía. ¡Crea tu primer blog!
                      </td>
                    </tr>
                  ) : (
                    blogs.map((blog, index) => (
                      <tr 
                        key={blog.id}
                        className="border-t border-green-200 hover:bg-green-50 transition-colors"
                      >
                        <td className="px-4 py-3 text-green-900">{index + 1}</td>
                        <td className="px-4 py-3">
                          <img 
                            src={blog.thumbnail}
                            alt={blog.title}
                            className="w-16 h-16 object-cover rounded-lg border border-green-200"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1488702889906-13ce27e1d930?w=64&h=64&fit=crop';
                            }}
                          />
                        </td>
                        <td className="px-4 py-3 font-medium text-green-900">{blog.title}</td>
                        <td className="px-4 py-3">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-green-600 to-amber-600 text-white">
                            {blog.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-green-700">{blog.date}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(blog.id, blog.userId)}
                              className="px-4 py-2 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300"
                            >
                              ✏️ Editar
                            </button>
                            <button
                              onClick={() => handleDelete(blog.id, blog.userId)}
                              className="px-4 py-2 rounded-lg font-semibold bg-red-600 hover:bg-red-700 text-white transition-all duration-300"
                            >
                              🗑️ Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECCIÓN ADMIN: Gestionar Escritores */}
          {isAdmin && (
            <div className="mt-8 bg-white rounded-2xl shadow-lg border border-green-200 p-8">
              <h2 className="text-2xl font-bold mb-6 text-green-900">
                👥 Gestionar Usuarios y Escritores
              </h2>

              {loadingUsers ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gradient-to-r from-green-100 to-amber-100">
                          <th className="px-4 py-3 text-left text-sm font-semibold text-green-900">Usuario</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-green-900">Email</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-green-900">Rol Actual</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-green-900">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user, index) => (
                          <tr 
                            key={user.id}
                            className={`border-t border-green-200 ${index % 2 === 0 ? 'bg-white' : 'bg-green-50/30'}`}
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="flex-shrink-0 h-10 w-10">
                                  {user.photoURL ? (
                                    <img 
                                      className="h-10 w-10 rounded-full object-cover border-2 border-green-200" 
                                      src={user.photoURL} 
                                      alt={user.name || user.displayName}
                                    />
                                  ) : (
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-600 to-amber-600 flex items-center justify-center">
                                      <span className="text-white font-bold text-sm">
                                        {(user.name || user.displayName || user.email || '?').charAt(0).toUpperCase()}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div className="font-medium text-green-900">
                                  {user.name || user.displayName || 'Sin nombre'}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-green-700">{user.email}</td>
                            <td className="px-4 py-3">
                              <span 
                                className="px-3 py-1 rounded-full text-xs font-semibold inline-block"
                                style={{
                                  background: user.isAdmin 
                                    ? 'linear-gradient(to right, rgb(220,38,38), rgb(239,68,68))' 
                                    : user.role === 'writer' 
                                      ? 'linear-gradient(to right, rgb(22,163,74), rgb(217,119,6))' 
                                      : 'rgb(156,163,175)',
                                  color: 'white'
                                }}
                              >
                                {user.isAdmin ? '👑 Admin' : user.role === 'writer' ? '✍️ Escritor' : '👤 Usuario'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                {!user.isAdmin && (
                                  <button
                                    onClick={() => makeWriter(user.id, user.role)}
                                    disabled={updating === user.id}
                                    className="px-3 py-1 rounded-md text-sm font-semibold transition-all hover:opacity-80 disabled:opacity-50 text-white"
                                    style={{
                                      background: user.role === 'writer' 
                                        ? 'rgb(107,114,128)' 
                                        : 'linear-gradient(to right, rgb(22,163,74), rgb(217,119,6))'
                                    }}
                                  >
                                    {updating === user.id ? '...' : user.role === 'writer' ? 'Quitar' : 'Hacer escritor'}
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <p className="text-sm text-blue-900">
                      <strong>📌 Instrucciones:</strong> Los usuarios convertidos en escritores podrán crear y publicar blogs. Aparecerán en la sección de "Escritores" del sitio.
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
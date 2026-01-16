import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../firebase/FirebaseConfig';
import { toast } from 'sonner';
import logo from "../../assets/logonuevoblog.jpeg";

export default function Navbar() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Detectar si hay usuario logueado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        // Toast de bienvenida que se desvanece automáticamente
        toast.success(`¡Bienvenido, ${user.displayName || user.email?.split('@')[0] || 'Usuario'}!`, {
          duration: 3000, // 3 segundos
        });
      }
    });
    return () => unsubscribe();
  }, []);

  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("admin");
      // Toast de cierre de sesión que se desvanece automáticamente
      toast.success("Sesión cerrada correctamente", {
        duration: 3000, // 3 segundos
      });
      setProfileMenuOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toast.error("Error al cerrar sesión");
    }
  };

  return (
    <nav className="border-b border-green-200/40 bg-gradient-to-r from-green-50 via-white to-amber-50 shadow-sm">
      <style>{`
        .nav-underline { position: relative; padding-bottom: 2px; }
        .nav-underline::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -2px;
          height: 2px;
          width: 100%;
          background: linear-gradient(to right, #16a34a, #d97706);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.25s ease-out;
        }
        .nav-underline:hover::after { transform: scaleX(1); }
      `}</style>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          <Link to="/" className="flex items-center gap-3">
            <img
              src={logo}
              alt="Escritores Tucumanos"
              className="h-9 w-9 rounded-full shadow-md border border-green-200"
            />
            <span className="text-xl font-semibold hidden sm:block text-green-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              Escritores Tucumanos
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="nav-underline text-sm font-medium text-green-900 hover:text-green-700 transition-colors">
              Inicio
            </Link>
            <Link to="/allBlogs" className="nav-underline text-sm font-medium text-green-800 hover:text-green-700 transition-colors">
              Escritores
            </Link>
            <Link to="/contacto" className="nav-underline text-sm font-medium text-green-800 hover:text-green-700 transition-colors">
              Contacto
            </Link>
            <Link to="/nosotros" className="nav-underline text-sm font-medium text-green-800 hover:text-green-700 transition-colors">
              Sobre nosotros
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block relative">
              {/* Si hay usuario logueado */}
              {currentUser ? (
                <>
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center gap-2 rounded-full p-2 pr-3 transition-colors hover:bg-green-100 border border-green-200"
                  >
                    {currentUser.photoURL ? (
                      <img 
                        src={currentUser.photoURL} 
                        alt={currentUser.displayName || 'Usuario'}
                        className="w-8 h-8 rounded-full object-cover border-2 border-green-500"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-600 to-amber-600 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {(currentUser.displayName || currentUser.email || 'U').charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span className="text-sm font-medium text-green-900 max-w-[100px] truncate">
                      {currentUser.displayName || currentUser.email?.split('@')[0]}
                    </span>
                  </button>

                  {/* Menú desplegable para usuario logueado */}
                  <div className={`absolute right-0 z-10 mt-2 w-56 rounded-lg shadow-lg border bg-white border-green-200 transition-all duration-300 origin-top ${profileMenuOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}>
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-green-100">
                        <p className="text-xs text-green-600 font-semibold">Sesión activa</p>
                        <p className="text-sm text-green-900 font-medium truncate">{currentUser.email}</p>
                      </div>
                      
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-green-50 text-green-800"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <LayoutDashboard size={16} />
                        <span>Panel de Control</span>
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-red-50 text-red-600 border-t border-green-100"
                      >
                        <LogOut size={16} />
                        <span>Cerrar Sesión</span>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* Si NO hay usuario logueado - Botón más visible con texto */
                <Link
                  to="/adminlogin"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:bg-green-100 border border-green-200 hover:border-green-400"
                >
                  <User size={18} className="text-green-700" />
                  <span className="text-sm font-medium text-green-900">Iniciar Sesión</span>
                </Link>
              )}
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg transition-colors hover:bg-green-100"
            >
              {mobileMenuOpen ? <X size={20} className="text-green-700" /> : <Menu size={20} className="text-green-700" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 bg-white border-t border-green-200/40 ${mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-4 py-4 space-y-3">
          <Link to="/" className="block py-2 text-sm font-medium text-green-900 hover:text-green-700" onClick={() => setMobileMenuOpen(false)}>
            Inicio
          </Link>
          <Link to="/allBlogs" className="block py-2 text-sm font-medium text-green-800 hover:text-green-700" onClick={() => setMobileMenuOpen(false)}>
            Escritores
          </Link>
          <Link to="/contacto" className="block py-2 text-sm font-medium text-green-800 hover:text-green-700" onClick={() => setMobileMenuOpen(false)}>
            Contacto
          </Link>
          <Link to="/nosotros" className="block py-2 text-sm font-medium text-green-800 hover:text-green-700" onClick={() => setMobileMenuOpen(false)}>
            Sobre nosotros
          </Link>
          
          <div className="pt-3 border-t border-green-200/40">
            {currentUser ? (
              <>
                <div className="mb-3 pb-3 border-b border-green-200/40">
                  <p className="text-xs text-green-600 font-semibold mb-1">Sesión activa</p>
                  <div className="flex items-center gap-2">
                    {currentUser.photoURL ? (
                      <img 
                        src={currentUser.photoURL} 
                        alt="Usuario"
                        className="w-8 h-8 rounded-full object-cover border-2 border-green-500"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-600 to-amber-600 flex items-center justify-center">
                        <span className="text-white font-bold text-xs">
                          {(currentUser.displayName || currentUser.email || 'U').charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span className="text-sm text-green-900 font-medium">{currentUser.email}</span>
                  </div>
                </div>
                
                <Link 
                  to="/dashboard" 
                  className="block py-2 text-sm font-medium text-green-800 hover:text-green-700" 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Panel de Control
                </Link>
                
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 text-sm font-medium text-red-600 hover:text-red-700"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <Link 
                to="/adminlogin" 
                className="flex items-center gap-2 py-2 text-sm font-medium text-green-800 hover:text-green-700" 
                onClick={() => setMobileMenuOpen(false)}
              >
                <User size={18} />
                <span>Iniciar Sesión</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
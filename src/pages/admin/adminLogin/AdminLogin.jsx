import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../firebase/FirebaseConfig";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, Mail, Shield, ArrowLeft } from "lucide-react";
import myContext from "../../../context/data/myContext";

export default function AdminLogin() {
  const { setLoading } = useContext(myContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    
    if(!email || !password){
      return toast.error("Todos los campos son obligatorios")
    }

    setLoading(true);

    try{
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Marcar que acaba de iniciar sesión (se borra al cerrar pestaña)
      sessionStorage.setItem("justLoggedIn", "true");
      
      localStorage.setItem("admin", JSON.stringify(result));
      navigate('/dashboard')
    } catch (error) {
      console.log(error)
      toast.error("Usuario o contraseña incorrectos")
    } finally {
      setLoading(false);
    }
  }

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Por favor ingresa tu email primero");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success(
        `✅ Email enviado a ${email}\n\nRevisa tu bandeja de entrada (y SPAM) para resetear tu contraseña.`,
        { duration: 7000 }
      );
    } catch (error) {
      console.error(error);
      
      if (error.code === 'auth/user-not-found') {
        toast.error('No existe una cuenta con ese email');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Email inválido');
      } else {
        toast.error('Error al enviar el email. Intenta nuevamente.');
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-green-50 via-amber-50 to-green-100 p-4">
      {/* Botón volver al inicio */}
      <button
        onClick={() => navigate('/')}
        className="fixed top-4 left-4 z-10 flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-green-700 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg border border-green-200"
      >
        <ArrowLeft size={20} />
        <span>Volver al Inicio</span>
      </button>

      <div className="w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-xl border border-green-200">
        
        {/* Header con degradado */}
        <div className="bg-gradient-to-r from-green-600 to-amber-600 py-10 px-6 text-center">
          <div className="mb-4 inline-block">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 border-2 border-white/30">
              <div className="bg-white rounded-full p-4">
                <Shield className="text-green-600" size={48} strokeWidth={2} />
              </div>
            </div>
          </div>
          <h4 className="text-3xl font-bold text-white mb-2">
            Iniciar Sesión
          </h4>
          <p className="text-white/90 text-sm">
            Panel de Administración
          </p>
        </div>

        {/* Body del formulario */}
        <div className="p-8">
          <form className="flex flex-col gap-5" onSubmit={login}>
            
            {/* Campo Email */}
            <div>
              <label className="block text-sm font-medium text-green-900 mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600" size={20} />
                <input
                  type="email"
                  placeholder="admin@ejemplo.com"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white text-green-900 placeholder-green-400"
                />
              </div>
            </div>
            
            {/* Campo Contraseña */}
            <div>
              <label className="block text-sm font-medium text-green-900 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white text-green-900 placeholder-green-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 hover:text-green-700 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Botón de submit */}
            <div className="mt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-lg font-semibold bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700 text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Iniciar Sesión
              </button>
            </div>
          </form>

          {/* Link de olvidé contraseña */}
          <div className="mt-6 text-center">
            <button 
              onClick={handleForgotPassword}
              className="text-sm text-green-700 hover:text-green-800 hover:underline transition-colors font-medium"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
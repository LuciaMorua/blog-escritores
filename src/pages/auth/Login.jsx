import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase/FirebaseConfig";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, Mail, LogIn, ArrowLeft } from "lucide-react";
import myContext from "../../context/data/myContext";
import Layout from "../../components/layout/Layout";

export default function Login() {
  const { setLoading } = useContext(myContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      return toast.error("Todos los campos son obligatorios");
    }

    setLoading(true);

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      sessionStorage.setItem("justLoggedIn", "true");
      localStorage.setItem("admin", JSON.stringify(result));
      toast.success("¡Bienvenido de nuevo! 👋");
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      
      if (error.code === "auth/user-not-found") {
        toast.error("No existe una cuenta con este email");
      } else if (error.code === "auth/wrong-password") {
        toast.error("Contraseña incorrecta");
      } else if (error.code === "auth/invalid-credential") {
        toast.error("Email o contraseña incorrectos");
      } else {
        toast.error("Error al iniciar sesión");
      }
    } finally {
      setLoading(false);
    }
  };

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
      
      if (error.code === "auth/user-not-found") {
        toast.error("No existe una cuenta con ese email");
      } else if (error.code === "auth/invalid-email") {
        toast.error("Email inválido");
      } else {
        toast.error("Error al enviar el email. Intenta nuevamente.");
      }
    }
  };

  return (
    <Layout>
      {/* Mismo fondo que la página principal */}
      <div className="bg-gradient-to-b from-green-50 via-amber-50 to-green-100 min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4">
        <button
          onClick={() => navigate("/")}
          className="fixed top-20 left-4 z-10 flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-green-700 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg border border-green-200"
        >
          <ArrowLeft size={20} />
          <span>Volver al Inicio</span>
        </button>

        <div className="w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-xl border border-green-200">
          <div className="bg-gradient-to-r from-green-600 to-amber-600 py-10 px-6 text-center">
            <div className="mb-4 inline-block">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 border-2 border-white/30">
                <div className="bg-white rounded-full p-4">
                  <LogIn className="text-green-600" size={48} strokeWidth={2} />
                </div>
              </div>
            </div>
            <h4 className="text-3xl font-bold text-white mb-2">
              Iniciar Sesión
            </h4>
            <p className="text-white/90 text-sm">
              Accede a tu cuenta
            </p>
          </div>

          <div className="p-8">
            <form className="flex flex-col gap-5" onSubmit={handleLogin}>
              <div>
                <label className="block text-sm font-medium text-green-900 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600" size={20} />
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white text-green-900 placeholder-green-400"
                  />
                </div>
              </div>
              
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

              <div className="mt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-lg font-semibold bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700 text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Iniciar Sesión
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <button 
                onClick={handleForgotPassword}
                className="text-sm text-green-700 hover:text-green-800 hover:underline transition-colors font-medium"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-green-700">
                ¿No tienes cuenta?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-green-800 hover:text-green-900 hover:underline transition-colors"
                >
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
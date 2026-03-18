import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import emailjs from "@emailjs/browser";
import { auth, fireDb } from "../../firebase/FirebaseConfig";
import { toast } from "sonner";
import { Eye, EyeOff, User, Mail, Lock, ArrowLeft, UserPlus } from "lucide-react";
import myContext from "../../context/data/myContext";
import Layout from "../../components/layout/Layout";

export default function Register() {
  const { setLoading } = useContext(myContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    provincia: "",
    pais: "",
    bio: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      return toast.error("Por favor completa todos los campos obligatorios");
    }

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Las contraseñas no coinciden");
    }

    if (formData.password.length < 6) {
      return toast.error("La contraseña debe tener al menos 6 caracteres");
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await updateProfile(userCredential.user, {
        displayName: formData.name
      });

      await setDoc(doc(fireDb, "users", userCredential.user.uid), {
        name: formData.name,
        displayName: formData.name,
        email: formData.email,
        provincia: formData.provincia || "",
        pais: formData.pais || "",
        bio: formData.bio || "",
        role: 'writer',
        isAdmin: false,
        createdAt: new Date().toISOString(),
        photoURL: ""
      });

      try {
        await emailjs.send(
          'service_y2cozxk',      
          'template_hlmp9ih',     
          {
            name: formData.name,
            email: formData.email
          },
          'oxhdHFl8-nH924hR1'        
        );
        console.log("Email de bienvenida enviado");
      } catch (emailError) {
        console.error("Error al enviar email:", emailError);
      }

      sessionStorage.setItem("justLoggedIn", "true");
      localStorage.setItem("admin", JSON.stringify({
        user: {
          email: userCredential.user.email,
          uid: userCredential.user.uid
        }
      }));

      toast.success("¡Cuenta creada exitosamente! Bienvenido a Escritores Tucumanos 🎉");
      navigate("/dashboard");

    } catch (error) {
      console.error("Error en el registro:", error);

      if (error.code === "auth/email-already-in-use") {
        toast.error("Este email ya está registrado. Intenta iniciar sesión.");
      } else if (error.code === "auth/invalid-email") {
        toast.error("Email inválido");
      } else if (error.code === "auth/weak-password") {
        toast.error("La contraseña es muy débil");
      } else {
        toast.error("Error al crear la cuenta. Por favor, intenta nuevamente.");
      }
    } finally {
      setLoading(false);
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

        <div className="w-full max-w-2xl bg-white rounded-2xl overflow-hidden shadow-xl border border-green-200">
          <div className="bg-gradient-to-r from-green-600 to-amber-600 py-8 px-6 text-center">
            <div className="mb-4 inline-block">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 border-2 border-white/30">
                <div className="bg-white rounded-full p-3">
                  <UserPlus className="text-green-600" size={40} strokeWidth={2} />
                </div>
              </div>
            </div>
            <h4 className="text-3xl font-bold text-white mb-2">Crear Cuenta</h4>
            <p className="text-white/90 text-sm">
              Únete a la comunidad de Escritores Tucumanos
            </p>
          </div>

          <div className="p-8">
            <form className="flex flex-col gap-5" onSubmit={handleRegister}>
              <div>
                <label className="block text-sm font-medium text-green-900 mb-2">
                  Nombre completo *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600" size={20} />
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white text-green-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-green-900 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600" size={20} />
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white text-green-900"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-green-900 mb-2">
                    Contraseña *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600" size={20} />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-11 pr-12 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white text-green-900"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 hover:text-green-700"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-green-900 mb-2">
                    Confirmar contraseña *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600" size={20} />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-11 pr-12 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white text-green-900"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 hover:text-green-700"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-green-900 mb-2">
                    Provincia (opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Tucumán"
                    name="provincia"
                    value={formData.provincia}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white text-green-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-green-900 mb-2">
                    País (opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Argentina"
                    name="pais"
                    value={formData.pais}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white text-green-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-green-900 mb-2">
                  Sobre ti (opcional)
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Cuéntanos un poco sobre ti y tu pasión por escribir..."
                  className="w-full px-4 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white text-green-900 resize-none"
                />
              </div>

              <div className="mt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-lg font-semibold bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700 text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Crear Cuenta
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-green-700">
                ¿Ya tienes cuenta?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-green-800 hover:text-green-900 hover:underline transition-colors"
                >
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
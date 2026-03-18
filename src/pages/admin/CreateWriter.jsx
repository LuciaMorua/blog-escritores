import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'sonner';
import Layout from '../../components/layout/Layout';

import { auth, fireDb } from '../../firebase/FirebaseConfig';

// Configuración de Firebase para instancia secundaria usando variables de entorno
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Crear una segunda instancia de Firebase Auth solo para crear usuarios
const secondaryApp = initializeApp(firebaseConfig, "Secondary");
const secondaryAuth = getAuth(secondaryApp);

function CreateWriter() {
  
  const navigate = useNavigate();

  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    provincia: '',
    pais: 'Argentina',
    bio: ''
  });

  // Verificar si el usuario es admin
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(fireDb, "users", user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const userData = docSnap.data();
            const adminStatus = userData.isAdmin === true || userData.role === "admin" || userData.role === "Admin";
            setIsAdmin(adminStatus);
            
            if (!adminStatus) {
              toast.error('No tienes permisos para acceder a esta página');
              navigate('/dashboard');
            }
          } else {
            navigate('/dashboard');
          }
        } catch (error) {
          console.error('Error al verificar permisos:', error);
          navigate('/dashboard');
        }
      } else {
        toast.error('Debes iniciar sesión primero');
        navigate('/login');
      }
      
      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.name || !formData.email) {
      toast.error('Nombre y email son obligatorios');
      return;
    }

    setLoading(true);

    try {
      // Crear usuario con contraseña temporal aleatoria
      const tempPassword = Math.random().toString(36).slice(-12) + 'A1!';
      
      console.log('1. Creando usuario en Authentication...');
      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        formData.email, 
        tempPassword
      );
      
      const newUser = userCredential.user;
      console.log('2. Usuario creado en Auth:', newUser.uid);

      // Preparar datos del escritor
      const writerDocRef = doc(fireDb, 'users', newUser.uid);
      const writerData = {
        name: formData.name,
        displayName: formData.name,
        email: formData.email,
        role: 'writer',
        isAdmin: false,
        provincia: formData.provincia || '',
        pais: formData.pais,
        bio: formData.bio || '',
        photoURL: '',
        firstLogin: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: auth.currentUser.uid  // UID del admin que lo creó
      };

      console.log('3. Guardando en Firestore como admin...');
      console.log('Admin UID:', auth.currentUser.uid);
      console.log('Nuevo escritor UID:', newUser.uid);
      
      // Guardar datos del usuario en Firestore usando las credenciales del admin
      await setDoc(writerDocRef, writerData);
      console.log('4. ✅ Documento creado en Firestore');

      // Cerrar sesión en instancia secundaria
      await secondaryAuth.signOut();
      console.log('5. Sesión secundaria cerrada');

      // Enviar email de restablecimiento usando Firebase
      console.log('6. Enviando email de reset...');
      await sendPasswordResetEmail(auth, formData.email, {
        url: `${window.location.origin}/adminlogin`,
        handleCodeInApp: false
      });
      console.log('7. ✅ Email enviado');

      toast.success(
        `✅ Escritor creado exitosamente!\n\n` +
        `Se ha enviado un email a ${formData.email} con un link para establecer su contraseña.\n\n` +
        `⚠️ Si no lo ve, pídele que revise su carpeta de SPAM.`,
        { duration: 8000 }
      );

      // Limpiar formulario
      setFormData({
        name: '',
        email: '',
        provincia: '',
        pais: 'Argentina',
        bio: ''
      });
      
    } catch (error) {
      console.error('❌ Error completo:', error);
      console.error('Código de error:', error.code);
      console.error('Mensaje:', error.message);
      
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Este email ya está registrado');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Email inválido');
      } else if (error.code === 'permission-denied' || error.message.includes('permission')) {
        toast.error('Error de permisos en Firestore. Verificá las reglas de seguridad.');
      } else {
        toast.error('Error al crear el escritor: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen bg-gradient-to-b from-green-50 via-amber-50 to-green-100">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </Layout>
    );
  }

  if (!isAdmin) return null;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-green-50 via-amber-50 to-green-100 py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-green-900">
              ✍️ Crear Nuevo Escritor
            </h1>
            <p className="text-sm text-green-700">
              Firebase enviará automáticamente un email para que el escritor establezca su contraseña
            </p>
          </div>

          <form 
            onSubmit={handleSubmit}
            className="space-y-6 p-6 rounded-lg bg-white border border-green-200 shadow-lg"
          >
            {/* Nombre completo */}
            <div>
              <label className="block mb-2 font-semibold text-green-900">
                Nombre completo *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Ej: Juan Pérez"
                className="w-full px-4 py-3 rounded-lg transition-all bg-green-50 text-green-900 border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-2 font-semibold text-green-900">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Ej: escritor@ejemplo.com"
                className="w-full px-4 py-3 rounded-lg transition-all bg-green-50 text-green-900 border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Provincia */}
            <div>
              <label className="block mb-2 font-semibold text-green-900">
                Provincia
              </label>
              <input
                type="text"
                name="provincia"
                value={formData.provincia}
                onChange={handleChange}
                disabled={loading}
                placeholder="Ej: Tucumán"
                className="w-full px-4 py-3 rounded-lg transition-all bg-green-50 text-green-900 border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* País */}
            <div>
              <label className="block mb-2 font-semibold text-green-900">
                País
              </label>
              <input
                type="text"
                name="pais"
                value={formData.pais}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 rounded-lg transition-all bg-green-50 text-green-900 border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Biografía */}
            <div>
              <label className="block mb-2 font-semibold text-green-900">
                Biografía breve
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                disabled={loading}
                rows="4"
                placeholder="Breve descripción del escritor..."
                className="w-full px-4 py-3 rounded-lg transition-all resize-none bg-green-50 text-green-900 border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Botón submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold transition-all bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700 text-white shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? 'Creando escritor...' : '✅ Crear Escritor'}
            </button>
          </form>

          {/* Información adicional */}
          <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
            <p className="text-sm text-blue-900">
              <strong>🔐 ¿Qué sucede al crear un escritor?</strong>
              <br />
              1. Se crea una cuenta en Firebase Authentication
              <br />
              2. Se guarda su perfil en Firestore con rol de "escritor"
              <br />
              3. Firebase envía automáticamente un email con un link seguro
              <br />
              4. El escritor hace clic en el link y crea su propia contraseña
              <br />
              5. Ya puede iniciar sesión en /adminlogin
              <br />
              <br />
              <strong>⚠️ IMPORTANTE:</strong> El email puede llegar a la carpeta de SPAM. 
              Pídele al escritor que revise allí si no lo encuentra en la bandeja principal.
              <br />
              <br />
              <strong>📧 Remitente del email:</strong> noreply@blog-escritores.firebaseapp.com
            </p>
          </div>

          {/* Personalizar email de Firebase */}
          <div className="mt-4 p-4 rounded-lg bg-cyan-50 border border-cyan-200">
            <p className="text-sm text-cyan-900">
              <strong>💡 Consejo:</strong> Para personalizar el email de Firebase en español:
              <br />
              1. Ve a la <a 
                href="https://console.firebase.google.com/project/blog-escritores/authentication/emails" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline font-semibold hover:text-cyan-700"
              >
                Consola de Firebase → Authentication → Templates
              </a>
              <br />
              2. Edita "Restablecimiento de contraseña"
              <br />
              3. Cambia el texto a español y personaliza el mensaje
            </p>
          </div>

          {/* Botón para volver */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2 rounded-lg font-semibold transition-all hover:opacity-90 bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              ← Volver al Dashboard
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default CreateWriter;
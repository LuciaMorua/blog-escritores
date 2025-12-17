import React, { useState, useEffect } from 'react';
import { updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, storage, fireDb } from "../../../firebase/FirebaseConfig";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import Layout from "../../../components/layout/Layout";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function EditProfile() {
  
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    provincia: "",
    pais: "",
    bio: "",
  });
  
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Cargar datos del perfil al iniciar
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          toast.error('Debes iniciar sesión');
          navigate('/adminlogin');
          return;
        }

        // Obtener datos de Firestore (fuente principal de verdad)
        const docRef = doc(fireDb, "users", user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log('📄 Datos cargados de Firestore:', data);
          
          setFormData({
            displayName: data.displayName || data.name || user.displayName || "",
            email: user.email || "",
            provincia: data.provincia || "",
            pais: data.pais || "",
            bio: data.bio || "",
          });
          
          // Usar photoURL de Firestore (más confiable)
          setPhotoPreview(data.photoURL || user.photoURL || "");
        } else {
          // Si no existe el documento, usar datos de Auth
          setFormData({
            displayName: user.displayName || "",
            email: user.email || "",
            provincia: "",
            pais: "",
            bio: "",
          });
          setPhotoPreview(user.photoURL || "");
        }
      } catch (error) {
        console.error('❌ Error al cargar perfil:', error);
        toast.error('Error al cargar los datos del perfil');
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [navigate]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor selecciona solo imágenes');
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // Aumentado a 5MB
        toast.error('La foto no debe superar los 5MB');
        return;
      }

      setPhotoFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.displayName.trim()) {
      toast.error('Por favor ingresa un nombre');
      return;
    }

    setSaving(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error('No hay usuario autenticado');
        return;
      }

      let photoURL = photoPreview;

      // ===== PASO 1: Subir foto si hay una nueva =====
      if (photoFile) {
        console.log('📤 Subiendo nueva foto...');
        const timestamp = Date.now();
        const fileName = `profile-photos/${user.uid}/${timestamp}-${photoFile.name}`;
        const storageRef = ref(storage, fileName);

        await uploadBytes(storageRef, photoFile);
        photoURL = await getDownloadURL(storageRef);
        
        console.log('✅ Foto subida. URL:', photoURL);
        toast.success('Foto subida correctamente');
      }

      // ===== PASO 2: Actualizar Firebase Auth =====
      console.log('🔄 Actualizando perfil en Auth...');
      await updateProfile(user, {
        displayName: formData.displayName,
        photoURL: photoURL
      });
      console.log('✅ Auth actualizado');

      // ===== PASO 3: Actualizar Firestore (CRÍTICO) =====
      console.log('💾 Guardando en Firestore...');
      const userDocRef = doc(fireDb, "users", user.uid);
      
      // USAR updateDoc en lugar de setDoc para asegurar la actualización
      await updateDoc(userDocRef, {
        displayName: formData.displayName,
        name: formData.displayName, // También actualizar 'name' para compatibilidad
        provincia: formData.provincia,
        pais: formData.pais,
        bio: formData.bio,
        photoURL: photoURL, // ⭐ CRÍTICO: Guardar la URL de la foto
        updatedAt: new Date()
      });
      
      console.log('✅ Firestore actualizado correctamente');
      console.log('📸 photoURL guardada:', photoURL);

      // ===== PASO 4: Verificar que se guardó correctamente =====
      const verifyDoc = await getDoc(userDocRef);
      if (verifyDoc.exists()) {
        const savedData = verifyDoc.data();
        console.log('✅ Verificación - Datos guardados:', savedData);
        console.log('✅ photoURL verificada:', savedData.photoURL);
      }

      toast.success('✅ Perfil actualizado correctamente');
      setPhotoFile(null);
      
      // Pequeño delay para que se vea el toast antes de navegar
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (error) {
      console.error('❌ Error completo:', error);
      console.error('Código:', error.code);
      console.error('Mensaje:', error.message);
      
      if (error.code === 'permission-denied') {
        toast.error('Error de permisos. Verifica las reglas de Firestore y Storage');
      } else if (error.code === 'storage/unauthorized') {
        toast.error('No tienes permiso para subir archivos. Verifica las reglas de Storage');
      } else {
        toast.error('Error al actualizar perfil: ' + error.message);
      }
    } finally {
      setSaving(false);
    }
  };

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
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-green-900">
              ✏️ Editar Perfil
            </h1>
            <p className="text-green-700">
              Actualiza tu información personal
            </p>
          </div>

          <form 
            onSubmit={handleSubmit} 
            className="space-y-6 p-6 rounded-lg bg-white border border-green-200 shadow-lg"
          >
            {/* Foto de perfil - MOVIDO AL PRINCIPIO */}
            <div>
              <label className="block mb-2 font-semibold text-green-900">
                Foto de perfil
              </label>

              <input
                id="photo-input"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                disabled={saving}
                className="hidden"
              />

              <div className="flex items-center gap-6">
                {/* Preview de la foto */}
                <div className="flex-shrink-0">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-full border-4 border-green-500 shadow-lg"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full flex items-center justify-center border-4 border-green-500 shadow-lg bg-gradient-to-br from-green-600 to-amber-600">
                      <span className="text-5xl font-bold text-white">
                        {formData.displayName ? formData.displayName.charAt(0).toUpperCase() : '?'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Botón y info */}
                <div className="flex-1">
                  <button
                    type="button"
                    onClick={() => document.getElementById('photo-input').click()}
                    disabled={saving}
                    className="w-full px-4 py-3 rounded-lg border-2 border-dashed font-semibold transition-all hover:bg-green-100 disabled:opacity-50 bg-green-50 text-green-900 border-green-300 hover:border-green-500"
                  >
                    📷 Cambiar foto (máx. 5MB)
                  </button>

                  {photoFile && (
                    <div className="mt-3 px-4 py-3 rounded-lg bg-amber-50 border border-amber-300">
                      <p className="text-sm font-semibold text-amber-900">
                        ✓ Nueva foto seleccionada:
                      </p>
                      <p className="text-xs text-amber-700">
                        📎 {photoFile.name} ({(photoFile.size / 1024).toFixed(2)} KB)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Nombre */}
            <div>
              <label className="block mb-2 font-semibold text-green-900">
                Nombre completo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="displayName"
                placeholder="Tu nombre"
                value={formData.displayName}
                onChange={handleInputChange}
                disabled={saving}
                className="w-full px-4 py-3 rounded-lg transition-all bg-green-50 text-green-900 border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
              />
            </div>

            {/* Email (solo lectura) */}
            <div>
              <label className="block mb-2 font-semibold text-green-900">
                Correo electrónico
              </label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-3 rounded-lg transition-all bg-gray-100 text-gray-600 border border-green-200 focus:outline-none disabled:opacity-70 cursor-not-allowed"
              />
              <p className="text-xs text-green-600 mt-1">
                El email no se puede modificar
              </p>
            </div>

            {/* Provincia */}
            <div>
              <label className="block mb-2 font-semibold text-green-900">
                Provincia
              </label>
              <input
                type="text"
                name="provincia"
                placeholder="Ej: Tucumán"
                value={formData.provincia}
                onChange={handleInputChange}
                disabled={saving}
                className="w-full px-4 py-3 rounded-lg transition-all bg-green-50 text-green-900 border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
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
                placeholder="Ej: Argentina"
                value={formData.pais}
                onChange={handleInputChange}
                disabled={saving}
                className="w-full px-4 py-3 rounded-lg transition-all bg-green-50 text-green-900 border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block mb-2 font-semibold text-green-900">
                Sobre mí
              </label>
              <textarea
                name="bio"
                placeholder="Cuéntanos sobre ti..."
                value={formData.bio}
                onChange={handleInputChange}
                disabled={saving}
                rows="4"
                className="w-full px-4 py-3 rounded-lg transition-all resize-none bg-green-50 text-green-900 border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
              />
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700 text-white"
              >
                {saving ? '💾 Guardando...' : '✅ Guardar cambios'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                disabled={saving}
                className="flex-1 px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90 disabled:opacity-50 bg-gray-200 text-gray-800 hover:bg-gray-300"
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
              • Tu nombre aparecerá en todos tus artículos
              <br />
              • La foto de perfil debe ser menor a 5MB
              <br />
              • Tu biografía será visible en tu perfil público
              <br />
              • El email no se puede modificar por seguridad
            </p>
          </div>

          {/* Debug info en desarrollo */}
          {import.meta.env.DEV && (
            <div className="mt-4 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
              <p className="text-xs font-mono text-yellow-900">
                <strong>🔧 Debug Info:</strong>
                <br />
                UID: {auth.currentUser?.uid}
                <br />
                photoURL actual: {photoPreview || 'ninguna'}
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default EditProfile;
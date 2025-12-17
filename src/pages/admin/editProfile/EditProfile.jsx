import React, { useState, useEffect } from 'react';
import { updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, storage, fireDb } from "../../../firebase/FirebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
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
        if (user) {
          setFormData(prev => ({
            ...prev,
            displayName: user.displayName || "",
            email: user.email || "",
          }));
          setPhotoPreview(user.photoURL || "");

          // Obtener datos adicionales de Firestore
          const docRef = doc(fireDb, "users", user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            setFormData(prev => ({
              ...prev,
              provincia: data.provincia || "",
              pais: data.pais || "",
              bio: data.bio || "",
            }));
          }
        }
      } catch (error) {
        console.error('Error al cargar perfil:', error);
        toast.error('Error al cargar los datos del perfil');
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor selecciona solo imágenes');
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        toast.error('La foto no debe superar los 2MB');
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
      let photoURL = photoPreview;

      // Subir foto si hay una nueva
      if (photoFile) {
        const timestamp = Date.now();
        const fileName = `profile-photos/${user.uid}-${timestamp}`;
        const storageRef = ref(storage, fileName);

        await uploadBytes(storageRef, photoFile);
        photoURL = await getDownloadURL(storageRef);
        toast.success('Foto subida correctamente');
      }

      // Actualizar perfil en Firebase Auth
      await updateProfile(user, {
        displayName: formData.displayName,
        photoURL: photoURL
      });

      // Guardar datos adicionales en Firestore
      await setDoc(doc(fireDb, "users", user.uid), {
        displayName: formData.displayName,
        email: formData.email,
        provincia: formData.provincia,
        pais: formData.pais,
        bio: formData.bio,
        photoURL: photoURL,
        updatedAt: new Date()
      }, { merge: true });

      toast.success('Perfil actualizado correctamente');
      setPhotoFile(null);
      navigate('/dashboard');

    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      toast.error('Error al actualizar perfil');
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

            {/* Foto de perfil */}
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

              <button
                type="button"
                onClick={() => document.getElementById('photo-input').click()}
                disabled={saving}
                className="w-full px-4 py-3 rounded-lg border-2 border-dashed font-semibold transition-all hover:bg-green-100 disabled:opacity-50 bg-green-50 text-green-900 border-green-300 hover:border-green-500"
              >
                📁 Seleccionar foto (máx. 2MB)
              </button>

              {photoFile && (
                <div className="mt-3 px-4 py-3 rounded-lg bg-green-50 border border-green-200">
                  <p className="text-sm text-green-900">📎 {photoFile.name}</p>
                  <p className="text-xs text-green-600">
                    {(photoFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              )}

              {photoPreview && (
                <div className="mt-4">
                  <p className="text-sm mb-3 text-green-700">
                    Vista previa:
                  </p>
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-full border-4 border-green-500 shadow-lg"
                  />
                </div>
              )}
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
              • La foto de perfil debe ser menor a 2MB
              <br />
              • Tu biografía será visible en tu perfil público
              <br />
              • El email no se puede modificar por seguridad
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default EditProfile;
import { useSearchParams, useNavigate } from "react-router-dom";
import { confirmPasswordReset } from "firebase/auth";
import { auth } from "../../firebase/FirebaseConfig";
import { useState } from "react";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const oobCode = params.get("oobCode");

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await confirmPasswordReset(auth, oobCode, password);
      alert("✅ Contraseña actualizada correctamente");
      navigate("/adminlogin");
    } catch (err) {
      console.error(err);
      setError("El link es inválido o expiró. Pedí uno nuevo.");
    } finally {
      setLoading(false);
    }
  }

  if (!oobCode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-600 font-semibold">
          Link inválido o incompleto
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-amber-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 border border-green-200">
        
        <h1 className="text-2xl font-bold text-green-900 mb-2">
          Crear nueva contraseña
        </h1>

        <p className="text-sm text-green-700 mb-6">
          Elegí una contraseña segura para acceder a tu cuenta.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-sm font-semibold text-green-900 mb-1">
              Nueva contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Mínimo 6 caracteres"
              className="w-full px-4 py-3 rounded-lg bg-green-50 border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 font-medium">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-semibold bg-gradient-to-r from-green-600 to-amber-600 text-white hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Confirmar contraseña"}
          </button>
        </form>

        <p className="text-xs text-gray-500 mt-6 text-center">
          Si el link expiró, pedile al administrador que te envíe uno nuevo.
        </p>
      </div>
    </div>
  );
}

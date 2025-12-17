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

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await confirmPasswordReset(auth, oobCode, password);
      alert("Contraseña actualizada correctamente");
      navigate("/adminlogin");
    } catch (error) {
      console.error("ERROR RESET:", error.code, error.message);
      alert(error.code);
    } finally {
      setLoading(false);
    }
  }

  if (!oobCode) {
    return <p>Link inválido o incompleto</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Crear nueva contraseña</h1>

      <input
        type="password"
        placeholder="Nueva contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button disabled={loading}>
        {loading ? "Guardando..." : "Confirmar"}
      </button>
    </form>
  );
}


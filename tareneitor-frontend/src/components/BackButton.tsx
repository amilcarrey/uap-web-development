import { useNavigate } from "react-router-dom";

export function BackButton() {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/home"); // fallback por si no hay historial previo
    }
  };

  return (
    <button
      onClick={handleBack}
      className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400"
      aria-label="Volver a la página anterior"
      type="button"
    >
      ← Volver
    </button>
  );
}

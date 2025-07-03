import { useAuthForm } from "../hooks/useAuthForm";
import { useRegister } from "../hooks/useRegister";

export function RegisterForm() {
  const { fields, handleChange, error, setError } = useAuthForm({
    firstName: "",
    lastName: "",
    alias: "",
    password: "",
  });

  const { register, loading, error: apiError, setError: setApiError } = useRegister();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setApiError(null);

    // Validate all fields are filled
    if (!fields.firstName || !fields.lastName || !fields.alias || !fields.password) {
      setError("Completa todos los campos");
      return;
    }

    // Attempt registration
    const ok = await register(fields.firstName, fields.lastName, fields.alias, fields.password);
    if (!ok) {
      // Error is handled by the hook
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 p-4 bg-white rounded-lg shadow-md">
      <input
        name="firstName"
        type="text"
        placeholder="Nombre"
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
        value={fields.firstName}
        onChange={handleChange}
      />
      <input
        name="lastName"
        type="text"
        placeholder="Apellido"
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
        value={fields.lastName}
        onChange={handleChange}
      />
      <input
        name="alias"
        type="text"
        placeholder="Alias"
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
        value={fields.alias}
        onChange={handleChange}
      />
      <input
        name="password"
        type="password"
        placeholder="Contraseña"
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
        value={fields.password}
        onChange={handleChange}
      />

      {(error || apiError) && (
        <div className="text-red-600 text-sm font-medium">{error || apiError}</div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
      >
        {loading ? "Loading..." : "Sign Up"}
      </button>
    </form>
  );
}

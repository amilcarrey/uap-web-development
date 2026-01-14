"use client";
import { useState, useEffect } from "react";
import { useRegister } from "../hooks/useRegister";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [form, setForm] = useState({ mail: "", contraseña: "", role: "usuario" });
  const { register, loading, error, success } = useRegister();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register(form.mail, form.contraseña, form.role);
  };

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    }
  }, [success, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg px-8 py-8 w-full max-w-sm flex flex-col gap-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Registrar usuario</h2>
        {success && (
          <div className="text-green-700 bg-green-100 border border-green-400 px-4 py-2 rounded mb-4 text-center font-semibold">
            {success}
          </div>
        )}
        {error && (
          <div className="text-red-600 text-center font-medium mb-2">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-gray-700 font-semibold">Email</label>
          <input
            name="mail"
            type="email"
            placeholder="Email"
            value={form.mail}
            onChange={handleChange}
            required
            className="px-4 py-2 rounded bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <label className="text-gray-700 font-semibold">Contraseña</label>
          <input
            name="contraseña"
            type="password"
            placeholder="Contraseña"
            value={form.contraseña}
            onChange={handleChange}
            required
            className="px-4 py-2 rounded bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition-colors"
          >
            {loading ? "Registrando..." : "Registrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
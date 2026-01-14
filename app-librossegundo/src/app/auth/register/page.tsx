"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); // se normaliza en el backend
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        setErr(msg || "No se pudo crear la cuenta.");
        return;
      }
      router.push("/auth/login");
    } catch {
      setErr("No se pudo registrar. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-md py-10">
      <div className="card card-pad">
        <h1 className="text-2xl font-extrabold text-rose-800 mb-4">Crear cuenta</h1>
        <form onSubmit={onSubmit} className="space-y-3">
          <input
            className="input w-full"
            placeholder="Tu nombre"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="input w-full"
            placeholder="email@ejemplo.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="input w-full"
            placeholder="mínimo 6 caracteres"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {err && <p className="text-rose-700">{err}</p>}
          <button className="btn btn-rose w-full" disabled={loading}>
            {loading ? "Creando…" : "Registrarme"}
          </button>
        </form>

        <p className="muted mt-4 text-sm">
          ¿Ya tenés cuenta?{" "}
          <Link className="underline" href="/auth/login">
            Iniciá sesión
          </Link>
        </p>
      </div>
    </main>
  );
}

"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        setErr(msg || "Credenciales inválidas.");
        return;
      }
      router.push("/");
    } catch {
      setErr("No se pudo iniciar sesión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-md py-10">
      <div className="card card-pad">
        <h1 className="text-2xl font-extrabold text-rose-800 mb-4">Iniciar sesión</h1>
        <form onSubmit={onSubmit} className="space-y-3">
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
            placeholder="••••••••"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {err && <p className="text-rose-700">{err}</p>}
          <button className="btn btn-rose w-full" disabled={loading}>
            {loading ? "Ingresando…" : "Entrar"}
          </button>
        </form>

        <p className="muted mt-4 text-sm">
          ¿No tenés cuenta?{" "}
          <Link className="underline" href="/auth/register">
            Registrate
          </Link>
        </p>
      </div>
    </main>
  );
}

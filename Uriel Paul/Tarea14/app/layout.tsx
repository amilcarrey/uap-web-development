import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Book Advisor',
  description: 'Conversational reading companion powered by the Vercel AI SDK and Google Books.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen text-slate-50">
        <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10">
          <header className="rounded-[40px] border border-white/10 bg-gradient-to-br from-[#070c1e]/90 via-[#050716]/60 to-[#040611]/80 p-6 shadow-[0_25px_70px_rgba(3,7,18,0.65)] backdrop-blur-xl">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-cyan-200">Módulo Eclipse</p>
                <h1 className="text-4xl font-black text-white">Nébula Reading Console</h1>
                <p className="max-w-2xl text-sm text-slate-300">
                  Plataforma de mando para coordinar recomendaciones generadas con IA, herramientas de Google Books y métricas
                  guardadas en backend seguro. Todo viaja por tool calling, nada queda en el cliente.
                </p>
              </div>
              <div className="grid gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/70 sm:grid-cols-2">
                <span className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-center text-emerald-100 shadow shadow-emerald-500/30">
                  Seguridad backend
                </span>
                <span className="rounded-2xl border border-indigo-400/40 bg-indigo-500/10 px-4 py-3 text-center text-indigo-100 shadow shadow-indigo-500/30">
                  Toolset · 6 acciones
                </span>
              </div>
            </div>
          </header>
          {children}
        </main>
      </body>
    </html>
  );
}

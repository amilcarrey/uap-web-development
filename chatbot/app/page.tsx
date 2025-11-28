import { ChatShell } from "@/components/ChatShell";

export default function Page() {
  return (
    <main className="relative">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.18),transparent_45%),radial-gradient(circle_at_bottom,rgba(59,130,246,0.12),transparent_50%)]" />
      <ChatShell />
    </main>
  );
}

import PerfilUsuario from "../components/PerfilUsuario";

export default function PerfilPage() {
  return (
    <main style={{ maxWidth: 600, margin: "2rem auto", background: "#fff", padding: "2rem", borderRadius: 8, boxShadow: "0 2px 8px #eee" }}>
      <PerfilUsuario />
    </main>
  );
}
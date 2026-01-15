type Props = {
  users: string[];
  isLoading: boolean;
  isRefreshing: boolean;
  onRefresh: () => void;
  isAuthenticated: boolean;
};

export default function UsersList({ users, isLoading, isRefreshing, onRefresh, isAuthenticated }: Props) {
  return (
    <section style={{ border: '1px solid #e5e7eb', borderRadius: 14, padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ marginTop: 0 }}>Usuarios que interactuaron</h2>
        <button
          onClick={onRefresh}
          disabled={isRefreshing || !isAuthenticated}
          style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #ccc', cursor: isRefreshing || !isAuthenticated ? 'not-allowed' : 'pointer' }}
        >
          {isRefreshing ? 'Actualizando...' : 'Refrescar'}
        </button>
      </div>
      {!isAuthenticated ? (
        <p>Autenticate para ver el historial de direcciones.</p>
      ) : isLoading ? (
        <p>Cargando...</p>
      ) : users.length === 0 ? (
        <p>Aun no hay interacciones.</p>
      ) : (
        <ol style={{ marginTop: 8 }}>
          {users.map((u, i) => (
            <li key={`${u}-${i}`} style={{ wordBreak: 'break-all' }}>
              {u}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

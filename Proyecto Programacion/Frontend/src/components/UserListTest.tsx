// Prueba rápida del hook de usuarios
import { useAllUsers } from '../hooks/userSettings';

export function UserListTest() {
  const { data: users = [], isLoading, error } = useAllUsers();

  if (isLoading) return <div>Cargando usuarios...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-4 border rounded-md">
      <h3 className="font-bold mb-2">Prueba de Lista de Usuarios</h3>
      <p>Total usuarios encontrados: {users.length}</p>
      <ul className="space-y-1 mt-2">
        {users.map(user => (
          <li key={user.id} className="text-sm">
            {user.alias} - {user.firstName} {user.lastName}
          </li>
        ))}
      </ul>
    </div>
  );
}

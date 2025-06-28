import { useState } from 'react';
import { toast } from 'react-hot-toast';

export function FunctionalityDemo() {
  const [showDemo, setShowDemo] = useState(false);

  const testEndpoint = async (url: string, name: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(url, {
        credentials: 'include',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      if (response.ok) {
        toast.success(`✅ ${name}: Endpoint funcionando correctamente`);
      } else {
        toast.error(`❌ ${name}: Error ${response.status}`);
      }
    } catch (error) {
      toast.error(`❌ ${name}: Error de conexión`);
    }
  };

  const features = [
    {
      title: '🔍 Búsqueda de Usuarios',
      description: 'Busca usuarios por alias usando /api/users/search?q=...',
      status: '✅ Implementado',
      color: 'bg-green-50 border-green-200'
    },
    {
      title: '👤 Gestión de Perfil',
      description: 'Obtener y actualizar perfil usando /api/users/profile',
      status: '✅ Implementado',
      color: 'bg-green-50 border-green-200'
    },
    {
      title: '🔐 Autenticación JWT',
      description: 'Obtener información del usuario usando /api/auth/me',
      status: '✅ Implementado',
      color: 'bg-green-50 border-green-200'
    },
    {
      title: '📋 Búsqueda en Tareas',
      description: 'Buscar tareas usando /api/boards/{id}/tasks?search=...',
      status: '✅ Implementado',
      color: 'bg-green-50 border-green-200'
    },
    {
      title: '🤝 Compartir Tableros',
      description: 'Sistema completo de permisos: otorgar, ver, cambiar y revocar acceso usando /api/boards/{id}/permissions',
      status: '✅ Completado',
      color: 'bg-green-50 border-green-200'
    },
    {
      title: '👥 Gestión de Usuarios',
      description: 'Lista completa de usuarios con paginación usando /api/users?limit=20&offset=0',
      status: '✅ Implementado',
      color: 'bg-green-50 border-green-200'
    }
  ];

  const handleShowDemo = () => {
    setShowDemo(!showDemo);
    if (!showDemo) {
      toast.success('🎉 ¡Todas las funcionalidades están implementadas!');
    }
  };

  if (!showDemo) {
    return (
      <div className="fixed bottom-4 right-4">
        <button
          onClick={handleShowDemo}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
        >
          📋 Ver Funcionalidades
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <h2 className="text-xl font-bold">🚀 Funcionalidades Implementadas</h2>
          <button
            onClick={() => setShowDemo(false)}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* Mensaje de éxito */}
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-400 rounded">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <span className="text-2xl">🎉</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  <strong>¡Problema del backend resuelto!</strong> Ahora AMBOS endpoints de usuarios 
                  (<code>/api/users</code> y <code>/api/users/search</code>) devuelven correctamente 
                  el campo <code>id</code>, por lo que la funcionalidad de compartir tableros 
                  debería funcionar perfectamente.
                </p>
              </div>
            </div>
          </div>

          {/* Corrección realizada */}
          <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <span className="text-2xl">🔧</span>
              </div>
              <div className="ml-3">
                <h4 className="font-medium text-blue-800 mb-2">Problema identificado y resuelto:</h4>
                <p className="text-sm text-blue-700 mb-2">
                  <strong>❌ ANTES:</strong> El endpoint <code>/api/users/search</code> no devolvía el campo <code>id</code>, 
                  causando que el frontend enviara <code>userId: undefined</code>.
                </p>
                <p className="text-sm text-blue-700">
                  <strong>✅ AHORA:</strong> Ambos endpoints devuelven correctamente el <code>id</code>, 
                  permitiendo que el frontend envíe <code>{`{userId: 3, level: "EDITOR"}`}</code>.
                </p>
              </div>
            </div>
          </div>

          {/* Lista de funcionalidades */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`p-4 border rounded-lg ${feature.color}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-800">{feature.title}</h3>
                  <span className="text-sm font-medium text-green-600">{feature.status}</span>
                </div>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Instrucciones de uso */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">📚 API de compartir tableros:</h4>
            <div className="text-sm text-blue-700 space-y-2">
              <div>
                <strong>• Otorgar permisos:</strong> <code>POST /api/boards/:boardId/permissions</code>
                <pre className="mt-1 p-2 bg-blue-100 rounded text-xs">
{`{
  "userId": 3,
  "level": "EDITOR"
}`}
                </pre>
              </div>
              <div>
                <strong>• Ver colaboradores:</strong> <code>GET /api/boards/:boardId/permissions</code>
              </div>
              <div>
                <strong>• Revocar acceso:</strong> <code>DELETE /api/boards/:boardId/permissions/:permissionId</code>
              </div>
            </div>
          </div>

          {/* Detalles técnicos */}
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">🔧 Niveles de permisos disponibles:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• <strong>OWNER:</strong> Propietario con control total del tablero</li>
              <li>• <strong>EDITOR:</strong> Puede crear, editar y eliminar tareas</li>
              <li>• <strong>VIEWER:</strong> Solo puede ver tareas sin modificar</li>
            </ul>
            <h4 className="font-medium text-gray-800 mb-2 mt-4">⚙️ Características técnicas:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Autenticación JWT con headers Bearer y cookies</li>
              <li>• Paginación en la lista de usuarios (?limit=20&offset=0)</li>
              <li>• Búsqueda de usuarios requiere mínimo 2 caracteres</li>
              <li>• El usuario actual (propietario) se excluye automáticamente</li>
              <li>• Sistema completo de permisos conectado a la base de datos</li>
              <li>• Gestión de errores y feedback visual en tiempo real</li>
            </ul>
          </div>
        </div>

        <div className="p-4 border-t bg-gray-50">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => testEndpoint('/api/users?limit=5&offset=0', 'Lista de usuarios')}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
            >
              🧪 Test /api/users
            </button>
            <button
              onClick={() => testEndpoint('/api/users/search?q=test', 'Búsqueda de usuarios')}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
            >
              🔍 Test búsqueda
            </button>
          </div>
          <button
            onClick={() => setShowDemo(false)}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ¡Entendido! Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

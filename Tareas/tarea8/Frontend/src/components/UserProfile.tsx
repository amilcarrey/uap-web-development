import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useUserProfile, useUpdateUserProfile } from '../hooks/userSettings';
import { useAuthStore } from '../stores/authStore';

export function UserProfile() {
  const { data: profile, isLoading } = useUserProfile();
  const updateProfile = useUpdateUserProfile();
  const { user, isAuthenticated } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
  });

  // Actualizar formData cuando se carga el perfil
  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
      });
    }
  }, [profile]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
      });
    }
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync(formData);
      toast.success('Perfil actualizado correctamente');
      setIsEditing(false);
    } catch (error) {
      toast.error('Error al actualizar perfil');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center">
          <p className="text-gray-600">No se pudo obtener la información del usuario</p>
          <p className="text-sm text-gray-500 mt-2">Por favor, inicia sesión nuevamente</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center">Cargando perfil...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-xl font-semibold text-gray-900">Información Personal</h2>
        <p className="mt-1 text-sm text-gray-600">
          Actualiza tu información personal y datos de contacto
        </p>
      </div>
        
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellido
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSave}
                disabled={updateProfile.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {updateProfile.isPending ? 'Guardando...' : 'Guardar'}
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">ID de Usuario</label>
              <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-md">{profile?.id || user.id}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Alias</label>
              <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-md">{profile?.alias || user.alias}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-md">
                {profile?.firstName || 'No especificado'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Apellido</label>
              <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-md">
                {profile?.lastName || 'No especificado'}
              </p>
            </div>

            {profile?.createdAt && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Fecha de registro</label>
                <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-md">
                  {new Date(profile.createdAt).toLocaleDateString()}
                </p>
              </div>
            )}

            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Editar perfil
            </button>
          </div>
        )}
    </div>
  );
}
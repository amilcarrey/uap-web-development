import React, { useState, useEffect } from 'react';
import { Tarea, tareaService, CrearTareaData, ActualizarTareaData } from '../services/tareaService';

interface CrearTareaModalProps {
  tableroId: string;
  tarea?: Tarea; // Si se pasa una tarea, estamos editando
  onClose: () => void;
  onTareaGuardada: (tarea: Tarea) => void;
}

const CrearTareaModal: React.FC<CrearTareaModalProps> = ({
  tableroId,
  tarea,
  onClose,
  onTareaGuardada,
}) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    prioridad: 'MEDIA' as 'URGENTE' | 'ALTA' | 'MEDIA' | 'BAJA',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  useEffect(() => {
    if (tarea) {
      setFormData({
        titulo: tarea.titulo,
        descripcion: tarea.descripcion || '',
        prioridad: tarea.prioridad,
      });
    }
  }, [tarea]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.titulo.trim()) {
      setError('El título es obligatorio');
      return;
    }

    try {
      setLoading(true);
      
      if (tarea) {

        const actualizarData: ActualizarTareaData = {
          titulo: formData.titulo.trim(),
          descripcion: formData.descripcion.trim() || undefined,
          prioridad: formData.prioridad,
        };
        const response = await tareaService.actualizarTarea(tarea.id, actualizarData);
        onTareaGuardada(response.tarea);
      } else {

        const crearData: CrearTareaData = {
          titulo: formData.titulo.trim(),
          descripcion: formData.descripcion.trim() || undefined,
          prioridad: formData.prioridad,
        };
        const response = await tareaService.crearTarea(tableroId, crearData);
        onTareaGuardada(response.tarea);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al guardar la tarea');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {tarea ? 'Editar Tarea' : 'Nueva Tarea'}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4">
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-2">
              Título *
            </label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ingresa el título de la tarea"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe la tarea (opcional)"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="prioridad" className="block text-sm font-medium text-gray-700 mb-2">
              Prioridad
            </label>
            <select
              id="prioridad"
              name="prioridad"
              value={formData.prioridad}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="BAJA">Baja</option>
              <option value="MEDIA">Media</option>
              <option value="ALTA">Alta</option>
              <option value="URGENTE">Urgente</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Guardando...' : (tarea ? 'Actualizar' : 'Crear')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearTareaModal;

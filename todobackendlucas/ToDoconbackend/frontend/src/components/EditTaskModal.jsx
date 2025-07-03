import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const EditTaskModal = ({ isOpen, onClose, onSubmit, task, isLoading }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    fecha_vencimiento: ''
  });

  useEffect(() => {
    if (task) {
      setFormData({
        titulo: task.titulo || '',
        descripcion: task.descripcion || '',
        fecha_vencimiento: task.fecha_vencimiento ? 
          new Date(task.fecha_vencimiento).toISOString().split('T')[0] : ''
      });
    }
  }, [task]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = { ...formData };
    if (!submitData.fecha_vencimiento) {
      delete submitData.fecha_vencimiento;
    }
    onSubmit(submitData);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md w-full bg-white rounded-lg shadow-xl">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <Dialog.Title className="text-lg font-medium text-gray-900">
              Editar Tarea
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">
                Título de la tarea
              </label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                required
                value={formData.titulo}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ej: Revisar documentación"
              />
            </div>
            
            <div>
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
                Descripción (opcional)
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                rows={3}
                value={formData.descripcion}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Describe los detalles de la tarea..."
              />
            </div>
            
            <div>
              <label htmlFor="fecha_vencimiento" className="block text-sm font-medium text-gray-700">
                Fecha de vencimiento (opcional)
              </label>
              <input
                type="date"
                id="fecha_vencimiento"
                name="fecha_vencimiento"
                value={formData.fecha_vencimiento}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default EditTaskModal;

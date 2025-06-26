import { useState, useEffect } from "react";
import { useCategorias } from "../hooks/useCategorias";
import { useLogout } from '../hooks/useAuthUser';
import { useModalStore } from "../store/modalStore";
import { useSettingsStore } from "../store/settingsStore";
import { useUserSettings, useUpdateUserSettings, useResetUserSettings } from "../hooks/useUserSettings";
import type { Categoria } from "../types";

export default function Settings() {
  const { categoriasQuery, addCategoriaMutation, deleteCategoriaMutation } = useCategorias();
  const logout = useLogout();
  const [newCategoriaName, setNewCategoriaName] = useState("");

  // Configuraciones del backend
  const { data: backendSettings, isLoading: settingsLoading } = useUserSettings();
  const updateSettingsMutation = useUpdateUserSettings();
  const resetSettingsMutation = useResetUserSettings();

  // Store local de configuraciones
  const {
    refetchInterval,
    setRefetchInterval,
    uppercaseDescriptions,
    toggleUppercaseDescriptions,
    tasksPerPage,
    setTasksPerPage,
    syncWithBackend,
    reset
  } = useSettingsStore();

  const [hasChanges, setHasChanges] = useState(false);

  // Sincronizar con el backend cuando llegan los datos
  useEffect(() => {
    if (backendSettings) {
      syncWithBackend(backendSettings);
    }
  }, [backendSettings, syncWithBackend]);

  // Guardar configuraciones en el backend
  const handleSaveSettings = async () => {
    try {
      await updateSettingsMutation.mutateAsync({
        uppercaseDescriptions: uppercaseDescriptions.toString(),
        refetchInterval: refetchInterval.toString(),
        tasksPerPage: tasksPerPage.toString(),
      });
      
      setHasChanges(false);
      useModalStore.getState().openModal("Configuraciones guardadas", "success");
    } catch (error) {
      useModalStore.getState().openModal(
        error instanceof Error ? error.message : "Error al guardar configuraciones",
        "error"
      );
    }
  };

  // Reset configuraciones
  const handleResetSettings = async () => {
    try {
      await resetSettingsMutation.mutateAsync();
      reset();
      setHasChanges(false);
      useModalStore.getState().openModal("Configuraciones restablecidas", "success");
    } catch (error) {
      useModalStore.getState().openModal(
        error instanceof Error ? error.message : "Error al restablecer configuraciones",
        "error"
      );
    }
  };

  // Gestión de categorías
  const handleAddCategoria = (name: string) => {
    // check si el nombre no esta en uso
    if (categoriasQuery.data?.some((categoria: Categoria) => categoria.name.toLowerCase() === name.toLowerCase())) {
      useModalStore.getState().openModal("El nombre de la categoría ya está en uso", "error");
      return;
    }

    const id = name.toLowerCase().replace(/\s+/g, "-"); // ID basado en el nombre
  addCategoriaMutation.mutate(
    { id, name }, // ESTO se manda al backend
    { 
      //  ESTOS son callbacks locales del frontend que se ejecutan después de la respuesta del backend
      onSuccess: () => useModalStore.getState().openModal("Categoría creada", "success"),
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.error || error?.message || "Error al crear la categoría";
        useModalStore.getState().openModal(errorMessage, "error");
      },
    }
  );
};

  const handleLogout = () => {
    logout.mutate();
  };

  if (settingsLoading) {
    return (
      <div className="p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando configuraciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">
        <i className="fas fa-cog mr-3"></i>Configuraciones
      </h1>

      {/* Indicador de cambios */}
      {hasChanges && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
              <span className="text-yellow-800">Tienes cambios sin guardar</span>
            </div>
            <button
              onClick={handleSaveSettings}
              disabled={updateSettingsMutation.isPending}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 disabled:opacity-50"
            >
              {updateSettingsMutation.isPending ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>Guardando...
                </>
              ) : (
                <>
                  <i className="fas fa-save mr-2"></i>Guardar
                </>
              )}
            </button>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* CONFIGURACIONES DE LA APP */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
            <i className="fas fa-sliders-h mr-2"></i>Configuraciones de la App
          </h2>
          
          {/* Tareas por página */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              <i className="fas fa-list mr-2"></i>Tareas por página
            </label>
            <select
              value={tasksPerPage}
              onChange={(e) => {
                setTasksPerPage(Number(e.target.value));
                setHasChanges(true);
              }}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value={5}>5 tareas</option>
              <option value={7}>7 tareas</option>
              <option value={10}>10 tareas</option>
              <option value={15}>15 tareas</option>
              <option value={20}>20 tareas</option>
            </select>
          </div>

          {/* Intervalo de refetch */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              <i className="fas fa-sync-alt mr-2"></i>Actualización automática (segundos)
            </label>
            <input
              type="number"
              min="5"
              max="300"
              value={refetchInterval}
              onChange={(e) => {
                setRefetchInterval(Number(e.target.value));
                setHasChanges(true);
              }}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
            <p className="text-xs text-gray-500">
              <i className="fas fa-info-circle mr-1"></i>
              Actualización cada {refetchInterval} segundos
            </p>
          </div>

          {/* Mayúsculas */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              <i className="fas fa-font mr-2"></i>Texto de las tareas
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={uppercaseDescriptions}
                onChange={() => {
                  toggleUppercaseDescriptions();
                  setHasChanges(true);
                }}
                className="w-5 h-5 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">Mostrar en MAYÚSCULAS</span>
            </label>
            <p className="text-xs text-gray-500">
              <i className="fas fa-quote-left mr-1"></i>
              Ejemplo: {uppercaseDescriptions ? '"COMPRAR LECHE"' : '"Comprar leche"'}
            </p>
          </div>

          {/* Botones de configuraciones */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={handleSaveSettings}
              disabled={!hasChanges || updateSettingsMutation.isPending}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateSettingsMutation.isPending ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>Guardando...
                </>
              ) : (
                <>
                  <i className="fas fa-save mr-2"></i>Guardar
                </>
              )}
            </button>
            
            <button
              onClick={handleResetSettings}
              disabled={resetSettingsMutation.isPending}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 disabled:opacity-50"
            >
              {resetSettingsMutation.isPending ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>Restableciendo...
                </>
              ) : (
                <>
                  <i className="fas fa-undo mr-2"></i>Reset
                </>
              )}
            </button>
          </div>
        </div>

        {/* GESTIÓN DE CATEGORÍAS */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
            <i className="fas fa-folder mr-2"></i>Gestión de Tableros
          </h2>
          
          {categoriasQuery.isLoading ? (
            <p className="text-gray-500">
              <i className="fas fa-spinner fa-spin mr-2"></i>Cargando tableros...
            </p>
          ) : categoriasQuery.isError ? (
            <p className="text-red-500">
              <i className="fas fa-exclamation-triangle mr-2"></i>Error al cargar tableros
            </p>
          ) : categoriasQuery.data && categoriasQuery.data.length > 0 ? (
            <div className="space-y-3">
              {categoriasQuery.data.map((categoria: Categoria) => (
                <div key={categoria.id} className={`flex items-center justify-between p-4 border rounded-lg ${
                  categoria.isShared 
                    ? categoria.userRole === 'owner' 
                      ? 'bg-green-50 border-green-200' 
                      : categoria.userRole === 'editor'
                      ? 'bg-orange-50 border-orange-200'
                      : 'bg-blue-50 border-blue-200'
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-gray-900">{categoria.name}</span>
                    {categoria.isShared && (
                      <span className="text-xs px-2 py-1 rounded-full bg-white">
                        {categoria.userRole === 'owner' && (
                          <>
                            <i className="fas fa-crown mr-1"></i>Owner compartido
                          </>
                        )}
                        {categoria.userRole === 'editor' && (
                          <>
                            <i className="fas fa-edit mr-1"></i>Editor
                          </>
                        )}
                        {categoria.userRole === 'viewer' && (
                          <>
                            <i className="fas fa-eye mr-1"></i>Solo lectura
                          </>
                        )}
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => (window.location.href = `/categorias/${categoria.id}`)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                    >
                      <i className="fas fa-folder-open mr-1"></i>Ir
                    </button>
                    {(categoria.userRole === 'owner' || !categoria.isShared) && (
                      <button
                        onClick={() => handleDeleteCategoria(categoria.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                      >
                        <i className="fas fa-trash mr-1"></i>Eliminar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              <i className="fas fa-folder-open mr-2"></i>No hay tableros disponibles.
            </p>
          )}

          {/* Crear nuevo tablero */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-medium text-gray-800 mb-3">
              <i className="fas fa-plus mr-2"></i>Crear Nuevo Tablero
            </h3>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newCategoriaName}
                onChange={(e) => setNewCategoriaName(e.target.value)}
                placeholder="Nombre del tablero"
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              <button
                onClick={() => {
                  if (newCategoriaName.trim() !== "") {
                    handleAddCategoria(newCategoriaName);
                    setNewCategoriaName("");
                  }
                }}
                className="bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600"
              >
                <i className="fas fa-plus mr-2"></i>Crear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CERRAR SESIÓN */}
      <div className="mt-8 pt-6 border-t border-gray-200 text-center">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
        >
          <i className="fas fa-sign-out-alt mr-2"></i>Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
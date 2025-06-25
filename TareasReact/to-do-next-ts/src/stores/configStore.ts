import { create } from 'zustand';

interface ConfigState {
  refetchInterval: number;
  tareasPorPagina: number;
  mayusculas: boolean;

  setRefetchInterval: (ms: number) => void;
  setTareasPorPagina: (cantidad: number) => void;
  setMayusculas: (valor: boolean) => void;

  cargarConfiguracion: () => Promise<void>;
}

export const useConfigStore = create<ConfigState>((set, get) => {
  const guardar = async () => {
    const config = {
      refetchInterval: get().refetchInterval,
      tareasPorPagina: get().tareasPorPagina,
      mayusculas: get().mayusculas,
    };

    try {
      await fetch('http://localhost:4000/api/config', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });
    } catch (err) {
      console.error('❌ Error al guardar configuración', err);
    }
  };

  return {
    refetchInterval: 5000,
    tareasPorPagina: 5,
    mayusculas: false,

    setRefetchInterval: (ms) => {
      set({ refetchInterval: ms });
      guardar();
    },
    setTareasPorPagina: (cantidad) => {
      set({ tareasPorPagina: cantidad });
      guardar();
    },
    setMayusculas: (valor) => {
      set({ mayusculas: valor });
      guardar();
    },

    cargarConfiguracion: async () => {
      try {
        const res = await fetch('http://localhost:4000/api/config', {
          credentials: 'include',
        });

        if (!res.ok) {
          console.warn('⚠️ No se pudo obtener configuración del servidor');
          return;
        }

        const config = await res.json();
        if (config) {
          set({
            refetchInterval: config.refetchInterval ?? 5000,
            tareasPorPagina: config.tareasPorPagina ?? 5,
            mayusculas: config.mayusculas ?? false,
          });
        }
      } catch (err) {
        console.error('❌ Error al cargar configuración', err);
      }
    },
  };
});

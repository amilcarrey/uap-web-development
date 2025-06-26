export type Configuraciones = {
  intervaloRefetch: number;
  descripcionMayusculas: boolean;
  tareasPorPagina: number; 
};

let configuraciones: Configuraciones = {
  intervaloRefetch: 10,
  descripcionMayusculas: false,
  tareasPorPagina: 5, 
};

export function obtenerConfiguraciones(): Configuraciones {
  return configuraciones;
}

export function actualizarConfiguraciones(nuevasConfiguraciones: Partial<Configuraciones>): Configuraciones {
  configuraciones = { ...configuraciones, ...nuevasConfiguraciones };
  return configuraciones;
}

export function resetearConfiguraciones(): Configuraciones {
  configuraciones = {
    intervaloRefetch: 10,
    descripcionMayusculas: false,
    tareasPorPagina: 5, // <-- AGREGAR ESTA LÍNEA
  };
  return configuraciones;
}
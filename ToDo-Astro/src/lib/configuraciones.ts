type Configuraciones = {
  intervaloRefetch: number;
  descripcionMayusculas: boolean;
};

let configuraciones: Configuraciones = {
  intervaloRefetch: 10,
  descripcionMayusculas: false,
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
  };
  return configuraciones;
}
import api from './api'; // tu instancia axios o fetch configurada

export type ConfiguracionUsuario = {
  auto_refresh_interval: number;
  tema: string;
  notificaciones: boolean;
  idioma: string;
};

export async function obtenerConfiguracion() {
  const res = await api.get('/config');  
  return res.data;
}

export async function actualizarConfiguracion(data: ConfiguracionUsuario) {
  const res = await api.put('/config', data);  
  return res.data;
}

export async function restablecerConfiguracion() {
  const res = await api.put('/restablecer');  
  return res.data;
}

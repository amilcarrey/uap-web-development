// services/procesarSolicitud.ts

import { manejarSolicitud } from "../utils/requestHandler";
import { ejecutarAccion } from "../utils/actionHandler";

export async function procesarSolicitudPOST(Astro: any): Promise<Response> {
  const { accion, texto, id, filtro, isAjax, url } = await manejarSolicitud(Astro);

  let resultado = null;
  if (accion) {
    resultado = ejecutarAccion(accion, texto, id, filtro);
  }

  if (isAjax) {
    return new Response(JSON.stringify({ ok: true, ...resultado }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const redirectUrl = (url?.pathname ?? '') + (url?.search ?? '');
  return Astro.redirect(redirectUrl, 303);
}

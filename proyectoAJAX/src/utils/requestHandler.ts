export async function manejarSolicitud(Astro: any) {
    const url = new URL(Astro.request.url);
    const filtro = url.searchParams.get('filtro') || 'all';
  
    if (Astro.request.method !== 'POST') return { filtro };
  
    const contentType = Astro.request.headers.get('content-type') || '';
    const isAjax = Astro.request.headers.get('X-Requested-With') === 'XMLHttpRequest';
  
    let accion = '', texto = '', id = '';
  
    if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      const formData = await Astro.request.formData();
      accion = formData.get('accion')?.toString() || '';
      texto = formData.get('texto')?.toString() || '';
      id = formData.get('id')?.toString() || '';
    } else if (contentType.includes('application/json')) {
      const body = await Astro.request.json();
      accion = body.accion || '';
      texto = body.texto || '';
      id = body.id || '';
    }
  
    return { accion, texto, id, filtro, isAjax, url };
  }
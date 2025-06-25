export interface UserPayload {
  id: number;
  alias: string;
  iat?: number;
  exp?: number;
}

/**
 * Obtiene el userId del token JWT almacenado en las cookies
 * @returns El ID del usuario o null si no se puede obtener
 */
export function getUserFromToken(): UserPayload | null {
  try {
    console.log('=== INICIO getUserFromToken ===');
    
    const cookies = document.cookie.split(';');
    console.log('Todas las cookies:', cookies);
    
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
    console.log('Cookie del token:', tokenCookie);
    
    if (!tokenCookie) {
      console.warn('No se encontró cookie de token');
      return null;
    }
    
    const tokenValue = decodeURIComponent(tokenCookie.split('=')[1]);
    console.log('Token decodificado:', tokenValue);
    
    const tokenParts = tokenValue.split('.');
    console.log('Partes del token:', tokenParts.length);
    
    if (tokenParts.length !== 3) {
      console.error('Token JWT malformado - partes:', tokenParts.length);
      return null;
    }
    
    const payloadBase64 = tokenParts[1];
    console.log('Payload base64:', payloadBase64);
    
    const payload: UserPayload = JSON.parse(atob(payloadBase64));
    console.log('Payload decodificado:', payload);
    
    const currentTime = Math.floor(Date.now() / 1000);
    console.log('Tiempo actual:', currentTime, 'Token expira en:', payload.exp);
    
    if (payload.exp && payload.exp < currentTime) {
      console.warn('Token expirado');
      return null;
    }
    
    console.log('Usuario extraído exitosamente:', payload);
    return payload;
  } catch (error) {
    console.error('Error al obtener usuario del token:', error);
    return null;
  }
}
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
    
    // Obtener todas las cookies
    const cookies = document.cookie;
    console.log('Cookies completas:', cookies);
    
    if (!cookies) {
      console.warn('No hay cookies disponibles');
      return null;
    }
    
    // Buscar la cookie del token de forma más robusta
    const cookieArray = cookies.split(';').map(c => c.trim());
    console.log('Array de cookies:', cookieArray);
    
    const tokenCookie = cookieArray.find(cookie => cookie.startsWith('token='));
    console.log('Cookie del token encontrada:', tokenCookie);
    
    if (!tokenCookie) {
      console.warn('No se encontró cookie de token');
      return null;
    }
    
    let tokenValue = tokenCookie.split('=')[1];
    console.log('Token extraído (raw):', tokenValue ? `${tokenValue.substring(0, 20)}...` : 'vacío');
    
    // Decodificar URL si es necesario
    if (tokenValue.includes('%')) {
      tokenValue = decodeURIComponent(tokenValue);
      console.log('Token decodificado:', tokenValue ? `${tokenValue.substring(0, 20)}...` : 'vacío');
    }
    
    if (!tokenValue) {
      console.warn('Token vacío');
      return null;
    }
    
    const tokenParts = tokenValue.split('.');
    console.log('Partes del token:', tokenParts.length);
    
    if (tokenParts.length !== 3) {
      console.error('Token JWT malformado - partes:', tokenParts.length);
      console.error('Token completo:', tokenValue);
      return null;
    }
    
    const payloadBase64 = tokenParts[1];
    console.log('Payload base64:', payloadBase64);
    
    try {
      // Agregar padding si es necesario para el base64
      const paddedPayload = payloadBase64 + '='.repeat((4 - payloadBase64.length % 4) % 4);
      console.log('Payload con padding:', paddedPayload);
      
      const payload: UserPayload = JSON.parse(atob(paddedPayload));
      console.log('Payload decodificado:', payload);
      
      const currentTime = Math.floor(Date.now() / 1000);
      console.log('Tiempo actual:', currentTime, 'Token expira en:', payload.exp);
      
      if (payload.exp && payload.exp < currentTime) {
        console.warn('Token expirado');
        return null;
      }
      
      console.log('Usuario extraído exitosamente:', payload);
      console.log('=== FIN getUserFromToken ===');
      return payload;
    } catch (parseError) {
      console.error('Error al parsear payload JWT:', parseError);
      console.error('Payload base64 problemático:', payloadBase64);
      return null;
    }
  } catch (error) {
    console.error('Error al obtener usuario del token:', error);
    console.log('=== FIN getUserFromToken (ERROR) ===');
    return null;
  }
}

/**
 * Extrae los datos del usuario desde un token JWT directamente
 * @param token El token JWT como string
 * @returns Los datos del usuario o null si no se puede obtener
 */
export function getUserFromJWTString(token: string): UserPayload | null {
  try {
    console.log('=== INICIO getUserFromJWTString ===');
    
    if (!token) {
      console.warn('Token vacío');
      return null;
    }
    
    const tokenParts = token.split('.');
    console.log('Partes del token:', tokenParts.length);
    
    if (tokenParts.length !== 3) {
      console.error('Token JWT malformado - partes:', tokenParts.length);
      return null;
    }
    
    const payloadBase64 = tokenParts[1];
    
    try {
      // Agregar padding si es necesario para el base64
      const paddedPayload = payloadBase64 + '='.repeat((4 - payloadBase64.length % 4) % 4);
      
      const payload: UserPayload = JSON.parse(atob(paddedPayload));
      console.log('Payload decodificado desde string:', payload);
      
      const currentTime = Math.floor(Date.now() / 1000);
      
      if (payload.exp && payload.exp < currentTime) {
        console.warn('Token expirado');
        return null;
      }
      
      console.log('Usuario extraído exitosamente desde string:', payload);
      console.log('=== FIN getUserFromJWTString ===');
      return payload;
    } catch (parseError) {
      console.error('Error al parsear payload JWT desde string:', parseError);
      return null;
    }
  } catch (error) {
    console.error('Error al obtener usuario del token string:', error);
    console.log('=== FIN getUserFromJWTString (ERROR) ===');
    return null;
  }
}
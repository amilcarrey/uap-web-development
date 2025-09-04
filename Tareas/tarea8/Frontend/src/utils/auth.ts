export interface UserPayload {
  id: number;
  alias: string;
  iat?: number;
  exp?: number;
}

export function getUserFromToken(): UserPayload | null {
  try {
    const cookies = document.cookie;

    if (!cookies) {
      console.warn("Faltan cookies");
      return null;
    }

    const cookieArray = cookies.split(";").map((c) => c.trim());

    const tokenCookie = cookieArray.find((cookie) =>
      cookie.startsWith("token=")
    );

    if (!tokenCookie) {
      console.warn("No se encontró cookie de token");
      return null;
    }

    let tokenValue = tokenCookie.split("=")[1];

    if (tokenValue.includes("%")) {
      tokenValue = decodeURIComponent(tokenValue);
    }

    if (!tokenValue) {
      console.warn("Token vacío");
      return null;
    }

    const tokenParts = tokenValue.split(".");
    console.log("Partes del token:", tokenParts.length);

    if (tokenParts.length !== 3) {
      console.error("Token JWT malformado - partes:", tokenParts.length);
      console.error("Token completo:", tokenValue);
      return null;
    }

    const payloadBase64 = tokenParts[1];

    try {
      const paddedPayload =
        payloadBase64 + "=".repeat((4 - (payloadBase64.length % 4)) % 4);

      const payload: UserPayload = JSON.parse(atob(paddedPayload));

      const currentTime = Math.floor(Date.now() / 1000);

      if (payload.exp && payload.exp < currentTime) {
        console.warn("Token expirado");
        return null;
      }
      return payload;
    } catch (parseError) {
      console.error("Error al parsear payload JWT:", parseError);
      console.error("Payload base64 problemático:", payloadBase64);
      return null;
    }
  } catch (error) {
    console.error("Error al obtener usuario del token:", error);
    return null;
  }
}

export function getUserFromJWTString(token: string): UserPayload | null {
  try {

    if (!token) {
      console.warn("Token vacío");
      return null;
    }

    const tokenParts = token.split(".");

    if (tokenParts.length !== 3) {
      console.error("Token JWT malformado - partes:", tokenParts.length);
      return null;
    }

    const payloadBase64 = tokenParts[1];

    try {
      const payload: UserPayload = JSON.parse(atob(payloadBase64));

      const currentTime = Math.floor(Date.now() / 1000);

      if (payload.exp && payload.exp < currentTime) {
        console.warn("Token expirado");
        return null;
      }

      return payload;
    } catch (parseError) {
      console.error("Error al parsear payload JWT desde string:", parseError);
      return null;
    }
  } catch (error) {
    console.error("Error al obtener usuario del token string:", error);
    return null;
  }
}

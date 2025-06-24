import type { Request, Response } from "express";
import { AuthService } from "../services/authServices.js";

const authService = new AuthService();

export const registerHandler = async (req: Request, res: Response) => {
  const { email, password, role} = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email y contraseña requeridos" }); // ya envia la respuesta para el cliente 
    return; // es solo para cortar la ejecucion no devuleve nada 
  }
  
    const currentUser = req.user as { role: string } | undefined; // representa al usuario actual, si está autenticado
  // Solo un admin logueado puede crear otro admin
  if (role === "admin" && currentUser?.role !== "admin") {
    res.status(403).json({ error: "Solo un administrador puede crear otros administradores" });
    return;
  }

  try {
     const user = await authService.register(email, password, role || "user");
    res.status(201).json(user); // Enviamos el usuario creado como respuesta
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const loginHandler = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email y contraseña requeridos" });
    return;
  }

  try {
    // Llamamos al servicio de autenticación para iniciar sesión
    // El servicio maneja la verificación de usuario y contraseña
    // y devuelve un token JWT si las credenciales son válidas
    // usamos el token para saber si el usuario está autenticado y quién es

    const { user, token } = await authService.login(email, password);
    // Enviamos el token como cookie httpOnly  
    // cookie se guarda en el navegador (osea en el cliente nuestro front) y se envía automáticamente en cada solicitud al servidor (osea a nuestra API)
    // httpOnly significa que no se puede acceder desde JavaScript del lado del cliente, lo
    // que ayuda a prevenir ataques XSS (Cross-Site Scripting)
    res.cookie("token", token, { // le decimos al navegador que guarde la cookie "token" con el valor del token JWT
      httpOnly: true, // true para que la cookie no sea accesible desde JavaScript
      secure: false, // true si usás HTTPS, en local false esta joya
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 días
     path: "/", // la cookie estará disponible en todas las rutas de la aplicación
    });

    console.log('🍪 Cookie enviada:', token.substring(0, 20) + '...'); // ← LOG TEMPORAL

    res.status(200).json({ message: "Inicio de sesión exitoso" });
  } catch (error) {
    res.status(401).json({ error: (error as Error).message });
  }
};

export const getCurrentUserHandler = async (req: Request, res: Response) => {
  try {
    const user = req.user as { id: string; email: string; role: string };
    
    console.log('👤 Usuario autenticado:', user); // ← LOG TEMPORAL
    
    res.status(200).json({
      id: user.id,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.log('❌ Error en getCurrentUser:', error); // ← LOG TEMPORAL
    res.status(401).json({ error: "Usuario no autenticado" });
  }
};

// Handler para logout
export const logoutHandler = async (req: Request, res: Response) => {
  try {
    // Limpiar la cookie
    res.clearCookie('token');
    res.status(200).json({ message: "Logout exitoso" });
  } catch (error) {
    res.status(500).json({ error: "Error en logout" });
  }
};


export const getUsersHandler = async (_: Request, res: Response) => {
  const users = await authService.getUsers();
  res.json(users);
};

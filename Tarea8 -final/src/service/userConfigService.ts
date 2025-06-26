import { prisma } from "../prisma";

// Obtener configuración del usuario
export async function getUserConfig(userId: string) {
  let config = await prisma.userConfig.findUnique({
    where: { userId }
  });

  // Si no existe, la crea con valores por defecto
  if (!config) {
    config = await prisma.userConfig.create({
      data: { 
        userId, 
        tareasPorPagina: 5, // valor por defecto
        allTasksUppercase: false,
        theme: "light",
        autoRefreshInterval: 60, // o el que uses por defecto
      }
    });
  }
  return config;
}

// Actualizar configuración del usuario
export async function updateUserConfig(
  userId: string,
  data: {
    allTasksUppercase?: boolean,
    theme?: string,
    autoRefreshInterval?: number,
    tareasPorPagina?: number // <-- Agregado
  }
) {
  const update: any = {};
  if (typeof data.allTasksUppercase === "boolean") update.allTasksUppercase = data.allTasksUppercase;
  if (data.theme === "light" || data.theme === "dark") update.theme = data.theme;
  if (typeof data.autoRefreshInterval === "number" && data.autoRefreshInterval > 0) update.autoRefreshInterval = data.autoRefreshInterval;
  if (typeof data.tareasPorPagina === "number" && data.tareasPorPagina > 0) update.tareasPorPagina = data.tareasPorPagina; // <-- Agregado

  const config = await prisma.userConfig.upsert({
    where: { userId },
    update,
    create: { userId, ...update }
  });

  return config;
}

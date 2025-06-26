import prisma from '../config/prismaClient';

export const searchUserConfig = async (userId: number) => {
  const configuracion = await prisma.userSettings.findUnique({
    where: { userId },
  });

  if (!configuracion) {
    // Si no existe, devolvemos valores por defecto
    return {
      refetchInterval: 10000,
      descripcionMayusculas: false,
      theme: 'light',
    };
  }

  return configuracion;
};

export const updateUserConfig = async (
  userId: number,
  refetchInterval: number,
  descripcionMayusculas: boolean,
  theme: string
) => {
  const updatedConfig = await prisma.userSettings.upsert({
    where: { userId },
    update: {
      refetchInterval,
      descripcionMayusculas,
      theme,
    },
    create: {
      userId,
      refetchInterval,
      descripcionMayusculas,
      theme,
    },
  });

  return updatedConfig;
};

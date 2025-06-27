const prisma = require("../../prisma/client");

exports.getSettings = async (req, res) => {
  const userId = req.user.id;
  try {
    const settings = await prisma.userSettings.findUnique({
      where: { userId }
    });

    if (!settings) {
      // Si no hay, crear con valores por defecto
      const created = await prisma.userSettings.create({
        data: {
          userId,
          refetchInterval: 10,
          uppercaseContent: false
        }
      });
      return res.json(created);
    }

    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: "No se pudo obtener configuración" });
  }
};

exports.updateSettings = async (req, res) => {
  const userId = req.user.id;
  const { refetchInterval, uppercaseContent } = req.body;

  try {
    const updated = await prisma.userSettings.upsert({
      where: { userId },
      update: { refetchInterval, uppercaseContent },
      create: {
        userId,
        refetchInterval: refetchInterval ?? 10,
        uppercaseContent: uppercaseContent ?? false
      }
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "No se pudo actualizar configuración" });
  }
};

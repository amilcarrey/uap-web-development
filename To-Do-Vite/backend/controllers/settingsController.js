const settingsService = require('../services/settingsService');

const getUserSettings = async (req, res) => {
    try {
        const settings = await settingsService.getUserSettings(req.user.userId);
        res.json(settings);
    } catch (error) {
        console.error('Error en getUserSettings:', error);
        res.status(500).json({ error: 'Error al obtener ajustes del usuario' });
    }
};

const updateUserSettings = async (req, res) => {
    try {
        const { refetch_interval, items_per_page, uppercase_tasks } = req.body;

        // Validar los datos
        if (refetch_interval && (refetch_interval < 5 || refetch_interval > 120)) {
            return res.status(400).json({ error: 'El intervalo de actualización debe estar entre 5 y 120 segundos' });
        }

        if (items_per_page && (items_per_page < 3 || items_per_page > 20)) {
            return res.status(400).json({ error: 'Las tareas por página deben estar entre 3 y 20' });
        }

        const settings = {
            refetch_interval: refetch_interval || 30,
            items_per_page: items_per_page || 10,
            uppercase_tasks: uppercase_tasks || false
        };

        await settingsService.updateUserSettings(req.user.userId, settings);
        res.json({ message: 'Ajustes actualizados correctamente', settings });
    } catch (error) {
        console.error('Error en updateUserSettings:', error);
        res.status(500).json({ error: 'Error al actualizar ajustes del usuario' });
    }
};

module.exports = {
    getUserSettings,
    updateUserSettings
}; 
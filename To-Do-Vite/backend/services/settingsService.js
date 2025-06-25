const { query, run } = require('../config/db');

const getDefaultSettings = () => ({
    refetch_interval: 30,
    items_per_page: 10,
    uppercase_tasks: false
});

const getUserSettings = async (userId) => {
    try {
        const result = await query(
            'SELECT refetch_interval, items_per_page, uppercase_tasks FROM user_settings WHERE user_id = ?',
            [userId]
        );

        if (result.rows.length === 0) {
            // Crear ajustes por defecto si no existen
            const defaultSettings = getDefaultSettings();
            await run(
                'INSERT INTO user_settings (user_id, refetch_interval, items_per_page, uppercase_tasks) VALUES (?, ?, ?, ?)',
                [userId, defaultSettings.refetch_interval, defaultSettings.items_per_page, defaultSettings.uppercase_tasks]
            );
            return defaultSettings;
        }

        const settings = result.rows[0];
        return {
            refetch_interval: settings.refetch_interval,
            items_per_page: settings.items_per_page,
            uppercase_tasks: Boolean(settings.uppercase_tasks)
        };
    } catch (error) {
        console.error('Error al obtener ajustes del usuario:', error);
        return getDefaultSettings();
    }
};

const updateUserSettings = async (userId, settings) => {
    try {
        const { refetch_interval, items_per_page, uppercase_tasks } = settings;
        
        const result = await run(
            `UPDATE user_settings 
             SET refetch_interval = ?, items_per_page = ?, uppercase_tasks = ?, updated_at = datetime('now')
             WHERE user_id = ?`,
            [refetch_interval, items_per_page, uppercase_tasks ? 1 : 0, userId]
        );

        if (result.rowCount === 0) {
            await run(
                'INSERT INTO user_settings (user_id, refetch_interval, items_per_page, uppercase_tasks) VALUES (?, ?, ?, ?)',
                [userId, refetch_interval, items_per_page, uppercase_tasks ? 1 : 0]
            );
        }

        return { success: true };
    } catch (error) {
        console.error('Error al actualizar ajustes del usuario:', error);
        throw error;
    }
};

module.exports = {
    getUserSettings,
    updateUserSettings,
    getDefaultSettings
}; 
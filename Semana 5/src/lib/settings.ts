export let settings = {
    refetchInterval: 10, //segundos
    uppercaseDescriptions: false,
};

export function updateSettings(newSettings: Partial<typeof settings>) {
    settings = { ...settings, ...newSettings };
}
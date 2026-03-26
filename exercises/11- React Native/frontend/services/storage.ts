import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = (courseId: string) => `progress:${courseId}`;

export async function saveProgress(courseId: string, progress: any) {
  await AsyncStorage.setItem(KEY(courseId), JSON.stringify(progress));
}

export async function loadProgress(courseId: string) {
  const s = await AsyncStorage.getItem(KEY(courseId));
  return s ? JSON.parse(s) : null;
}

export async function clearProgress(courseId: string) {
  await AsyncStorage.removeItem(KEY(courseId));
}

export async function clearAllProgress() {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const progressKeys = keys.filter(k => k.startsWith('progress:'));
    if (progressKeys.length) {
      await AsyncStorage.multiRemove(progressKeys);
    }
  } catch (err) {
    console.error('clearAllProgress error', err);
    throw err;
  }
}

export function toast(message: string, type: 'success' | 'error') {
  alert(`[${type.toUpperCase()}] ${message}`);
}

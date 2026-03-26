export function parseCourseIdFromQRCode(data: string | null | undefined): string | null {
  if (!data) return null;
  const s = data.trim();
  // Formatos soportados:
  // AppEstudiosBiblico-curso-1
  // AppEstudiosBiblico-curso1
  // course:curso-1
  // curso-1
  if (s.startsWith('AppEstudiosBiblico-')) return s.substring('AppEstudiosBiblico-'.length);
  if (s.includes(':')) {
    const parts = s.split(':');
    return parts[1] || null;
  }
  return s || null;
}

export function buildQrPayload(courseId: string) {
  return `AppEstudiosBiblico-${courseId}`;
}

export function buildDeepLink(courseId: string) {
  // esquema profundo (ajustable)
  return `AppEstudiosBiblico://curso/${courseId}`;
}

export function buildShareMessage(course: { id: string; title?: string }) {
  const dl = buildDeepLink(course.id);
  const payload = buildQrPayload(course.id);
  return `Haz este curso en AppEstudiosBiblico:\n\n${course.title ?? ''}\nEnlace: ${dl}\n\nTambién puedes escanear este QR: ${payload}`;
}
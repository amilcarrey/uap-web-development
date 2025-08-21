// src/lib/cover.ts
export function normalizeCover(url?: string | null) {
  if (!url) return "";
  // Google a veces manda http:
  return url.replace(/^http:\/\//, "https://");
}

export function pickCover(images?: {
  thumbnail?: string;
  smallThumbnail?: string;
  small?: string;
  medium?: string;
  large?: string;
}) {
  const order = ["large", "medium", "thumbnail", "small", "smallThumbnail"] as const;
  for (const k of order) {
    const u = images?.[k];
    if (u) return normalizeCover(u);
  }
  return "";
}

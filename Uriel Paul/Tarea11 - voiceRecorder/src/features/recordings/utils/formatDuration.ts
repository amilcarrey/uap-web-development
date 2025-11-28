// src/app/features/recordings/utils/formatDuration.ts
// Formateo de duraciones en milisegundos para UI.
// - Reloj: "mm:ss" o "hh:mm:ss" (auto o forzado).
// - Humano corto: "1 h 03 min", "2 min 05 s", "35 s".
//
// Uso típico:
//   formatDuration(65321)                 -> "01:05"
//   formatDuration(3723000)               -> "01:02:03"
//   formatDuration(3723000, {showHours:false}) -> "62:03"
//   formatDuration(65321, {msDigits:1})   -> "01:05.6"
//   humanDurationShort(3723000)           -> "1 h 02 min"
//   humanDurationShort(6500)              -> "6 s"

export type FormatDurationOptions = {
    /** Muestra horas siempre en formato reloj (hh:mm:ss). Si es false, sólo se muestran horas si > 0. */
    showHours?: boolean;
    /** Cantidad de decimales para los segundos (0..3). 0 = sin milisegundos. */
    msDigits?: 0 | 1 | 2 | 3;
    /** Cadena a usar cuando el valor no es válido. */
    fallback?: string;
  };
  
  export function formatDuration(
    ms?: number,
    opts: FormatDurationOptions = {}
  ): string {
    const { showHours, msDigits = 0, fallback = "00:00" } = opts;
  
    if (ms == null || !isFinite(ms)) return fallback;
  
    const sign = ms < 0 ? "-" : "";
    const abs = Math.max(0, Math.floor(Math.abs(ms)));
  
    const totalSeconds = Math.floor(abs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
  
    // parte fraccional para .ms (si se pidió)
    let fraction = "";
    if (msDigits > 0) {
      const msRemainder = abs % 1000; // 0..999
      const scale = 10 ** (3 - msDigits);
      const frac = Math.floor(msRemainder / scale)
        .toString()
        .padStart(msDigits, "0");
      fraction = `.${frac}`;
    }
  
    const mm = pad(minutes);
    const ss = pad(seconds) + fraction;
  
    if (showHours || hours > 0) {
      return `${sign}${pad(hours)}:${mm}:${ss}`;
    }
    return `${sign}${minutes}:${ss}`;
  }
  
  /** Versión “humana” y corta en español (es-AR). */
  export function humanDurationShort(ms?: number, fallback = "0 s"): string {
    if (ms == null || !isFinite(ms)) return fallback;
  
    const abs = Math.max(0, Math.floor(Math.abs(ms)));
    const totalSeconds = Math.floor(abs / 1000);
  
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
  
    const parts: string[] = [];
    if (h > 0) parts.push(`${h} h`);
    if (m > 0 || (h > 0 && s > 0)) parts.push(`${pad2(m)} min`);
    if (s > 0 && h === 0) parts.push(`${pad2(s)} s`);
  
    if (parts.length === 0) return fallback;
    return parts.join(" ");
  }
  
  /* ----------------- helpers internos ----------------- */
  
  function pad(n: number): string {
    return n.toString().padStart(2, "0");
  }
  
  function pad2(n: number): string {
    // Para estilo “02” en minutos/segundos cuando hay horas presentes
    return n < 10 ? `0${n}` : `${n}`;
  }
  
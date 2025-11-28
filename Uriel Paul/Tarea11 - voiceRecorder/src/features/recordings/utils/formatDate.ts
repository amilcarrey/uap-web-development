// src/app/features/recordings/utils/formatDate.ts
// Utilidades de formateo de fechas para mostrar metadatos (creación de grabaciones).
// Pensado para locale español de Argentina por defecto, con fallback manual
// si Intl no estuviera disponible en el runtime (algunas builds antiguas).

export type FormatDateOptions = {
    /** Locale a usar (por defecto es-AR). */
    locale?: string;
    /** Zona horaria a usar (por defecto America/Argentina/Cordoba). */
    timeZone?: string;
    /** Incluye la hora además de la fecha. */
    withTime?: boolean;
    /** Muestra segundos cuando withTime=true. */
    withSeconds?: boolean;
    /** dateStyle/timeStyle “estándar” de Intl; si se proveen tienen prioridad. */
    dateStyle?: "full" | "long" | "medium" | "short";
    timeStyle?: "full" | "long" | "medium" | "short";
  };
  
  /** Extiende las opciones de Intl para permitir dateStyle/timeStyle sin requerir libs adicionales. */
  type ExtendedDTFOptions = Intl.DateTimeFormatOptions & {
    dateStyle?: "full" | "long" | "medium" | "short";
    timeStyle?: "full" | "long" | "medium" | "short";
  };
  
  /**
   * Formatea una fecha (Date o ISO string) en es-AR.
   * Ej: 13/09/2025 10:15
   */
  export function formatDate(
    input: Date | string | number,
    opts: FormatDateOptions = {}
  ): string {
    const {
      locale = "es-AR",
      timeZone = "America/Argentina/Cordoba",
      withTime = true,
      withSeconds = false,
      dateStyle,
      timeStyle,
    } = opts;
  
    const d = toDate(input);
    if (!d) return "—";
  
    // Preferimos Intl si está disponible.
    try {
      const hasIntl = typeof Intl !== "undefined" && !!Intl.DateTimeFormat;
      if (hasIntl) {
        let options: ExtendedDTFOptions;
  
        if (dateStyle || timeStyle) {
          // Si el entorno soporta estas opciones, el motor las usará; si no, las ignora.
          options = { dateStyle, timeStyle, timeZone };
        } else {
          // Construimos manualmente evitando spreads de `null`
          options = {
            timeZone,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          };
          if (withTime) {
            options.hour = "2-digit";
            options.minute = "2-digit";
            if (withSeconds) options.second = "2-digit";
            options.hour12 = false;
          }
        }
  
        // Cast a Intl.DateTimeFormatOptions para que TypeScript no se queje.
        return new Intl.DateTimeFormat(locale, options as Intl.DateTimeFormatOptions).format(d);
      }
    } catch {
      // caemos al fallback manual
    }
  
    // Fallback manual (dd/mm/yyyy hh:mm[:ss])
    const pad = (n: number) => n.toString().padStart(2, "0");
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    if (!withTime) return `${dd}/${mm}/${yyyy}`;
    const hh = pad(d.getHours());
    const mi = pad(d.getMinutes());
    const ss = pad(d.getSeconds());
    return withSeconds
      ? `${dd}/${mm}/${yyyy} ${hh}:${mi}:${ss}`
      : `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
  }
  
  /**
   * Devuelve una marca apta para nombre de archivo:
   * "YYYY-MM-DD HH-mm-ss"
   */
  export function stampForFileName(input: Date | string | number = new Date()): string {
    const d = toDate(input);
    if (!d) return "fecha-invalida";
    const pad = (n: number) => n.toString().padStart(2, "0");
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const mi = pad(d.getMinutes());
    const ss = pad(d.getSeconds());
    return `${yyyy}-${mm}-${dd} ${hh}-${mi}-${ss}`;
  }
  
  /* ----------------- helpers internos ----------------- */
  
  function toDate(input: Date | string | number): Date | null {
    if (input instanceof Date) {
      return isNaN(input.getTime()) ? null : input;
    }
    const d = new Date(input);
    return isNaN(d.getTime()) ? null : d;
  }
  
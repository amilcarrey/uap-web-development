// src/app/shared/styles/theme.ts
// Tema oscuro liviano para toda la app: colores, tipografía, espaciamiento,
// radios, sombras y helpers. 100% estático (sin provider), pero podés
// “extender” con mergeTheme si más adelante agregás theming dinámico.

import { Platform } from "react-native";

/* ===================== Paleta base ===================== */

export const palette = {
  // Fondo y superficies
  bg: "#0B0B0C",
  surface: "#0F0F12",
  surface2: "#141416",
  surface3: "#1A1A1E",

  // Bordes / líneas
  line: "#1C1C22",
  lineMuted: "#17171A",

  // Texto
  text: "#E6E6E9",
  textSecondary: "#C9CAD1",
  textMuted: "#A8A8B3",
  textInverse: "#0B0B0C",

  // Accentos
  accent: "#6BC46D",
  accentAlt: "#4DA3FF",

  // Estados
  success: "#6BC46D",
  warning: "#FFAE42",
  danger: "#FF3B30",
  info: "#4DA3FF",

  // Miscelánea
  placeholder: "#595A63",
} as const;

/* ===================== Escalas ===================== */

export const spacing = {
  0: 0,
  1: 2,
  2: 4,
  3: 6,
  4: 8,
  5: 10,
  6: 12,
  7: 16,
  8: 20,
  9: 24,
  10: 28,
  11: 32,
  12: 40,
} as const;

export const radius = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

export const typography = {
  // Usa fuentes del sistema (sin dependencias).
  family: {
    regular: Platform.select({ ios: "System", android: "sans-serif", default: "System" }),
    medium: Platform.select({ ios: "System", android: "sans-serif-medium", default: "System" }),
    mono: Platform.select({ ios: "Menlo", android: "monospace", default: "monospace" }),
  },
  size: {
    xs: 11,
    sm: 12,
    base: 13,
    md: 15,
    lg: 17,
    xl: 20,
    h3: 24,
    h2: 28,
    h1: 32,
  },
  weight: {
    regular: "400" as const,
    medium: "600" as const,
    bold: "700" as const,
  },
} as const;

/* ===================== Sombras / Elevación ===================== */

export type ElevationLevel = 0 | 1 | 2 | 3 | 4 | 6 | 8 | 12;

// Un tipo de estilo común a iOS (sombras) y Android (elevation)
type ShadowStyle = {
  shadowColor?: string;
  shadowOpacity?: number;
  shadowRadius?: number;
  shadowOffset?: { width: number; height: number };
  elevation?: number;
};

export function elevation(level: ElevationLevel): ShadowStyle {
  if (level === 0) {
    // Limpio en cada plataforma
    return Platform.select<ShadowStyle>({
      ios: {},
      android: { elevation: 0 },
      default: {},
    }) as ShadowStyle;
  }

  const ios: ShadowStyle = {
    shadowColor: "#000",
    shadowOpacity: level >= 8 ? 0.24 : level >= 4 ? 0.18 : 0.12,
    shadowRadius: level >= 12 ? 18 : level >= 8 ? 12 : level >= 4 ? 8 : 4,
    shadowOffset: { width: 0, height: Math.min(level, 8) },
  };

  return Platform.select<ShadowStyle>({
    ios,
    android: { elevation: level },
    default: ios,
  }) as ShadowStyle;
}

/* ===================== HitSlop por defecto ===================== */

export const hitSlop = { top: 8, right: 8, bottom: 8, left: 8 } as const;

/* ===================== Tema compuesto ===================== */

export type Theme = {
  palette: typeof palette;
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
  elevation: typeof elevation;
  hitSlop: typeof hitSlop;

  // presets opcionales para componentes comunes
  card: {
    container: {
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
      borderRadius: number;
    };
  };
  button: {
    base: {
      height: number;
      borderRadius: number;
      paddingHorizontal: number;
    };
    primary: {
      backgroundColor: string;
      textColor: string;
    };
    ghost: {
      backgroundColor: string;
      borderColor: string;
      textColor: string;
    };
  };
  listItem: {
    container: {
      backgroundColor: string;
      borderColor: string;
    };
    title: { color: string };
    subtitle: { color: string };
  };
};

export const theme: Theme = {
  palette,
  spacing,
  radius,
  typography,
  elevation,
  hitSlop,

  card: {
    container: {
      backgroundColor: palette.surface,
      borderColor: palette.line,
      borderWidth: 1,
      borderRadius: radius.md,
    },
  },

  button: {
    base: {
      height: 44,
      borderRadius: radius.sm,
      paddingHorizontal: spacing[8],
    },
    primary: {
      backgroundColor: palette.accent,
      textColor: palette.textInverse,
    },
    ghost: {
      backgroundColor: "transparent",
      borderColor: palette.line,
      textColor: palette.text,
    },
  },

  listItem: {
    container: {
      backgroundColor: palette.surface,
      borderColor: palette.line,
    },
    title: { color: palette.text },
    subtitle: { color: palette.textMuted },
  },
};

/* ===================== Helpers ===================== */

/** Mezcla superficial para extender el tema (sin provider global). */
export function mergeTheme<T extends Partial<Theme>>(patch: T): Theme {
  // mezcla superficial; si necesitás deep merge, podés usar lodash.merge
  return {
    ...theme,
    ...(patch as any),
    // ejemplo: permitir cambiar sólo algunos colores
    palette: { ...theme.palette, ...(patch as any)?.palette },
    spacing: { ...theme.spacing, ...(patch as any)?.spacing },
    radius: { ...theme.radius, ...(patch as any)?.radius },
    typography: { ...theme.typography, ...(patch as any)?.typography },
    button: {
      ...theme.button,
      ...(patch as any)?.button,
      base: { ...theme.button.base, ...(patch as any)?.button?.base },
      primary: { ...theme.button.primary, ...(patch as any)?.button?.primary },
      ghost: { ...theme.button.ghost, ...(patch as any)?.button?.ghost },
    },
    card: {
      ...theme.card,
      ...(patch as any)?.card,
      container: { ...theme.card.container, ...(patch as any)?.card?.container },
    },
    listItem: {
      ...theme.listItem,
      ...(patch as any)?.listItem,
      container: { ...theme.listItem.container, ...(patch as any)?.listItem?.container },
      title: { ...theme.listItem.title, ...(patch as any)?.listItem?.title },
      subtitle: { ...theme.listItem.subtitle, ...(patch as any)?.listItem?.subtitle },
    },
  };
}

/* ===================== Ejemplos de uso ===================== */
/*
import { theme, elevation } from "@/shared/styles/theme";

<View style={[{ backgroundColor: theme.palette.surface, borderRadius: theme.radius.md }, elevation(2)]} />
<Text style={{ color: theme.palette.text, fontSize: theme.typography.size.lg, fontFamily: theme.typography.family.medium }}>
  Título
</Text>
*/

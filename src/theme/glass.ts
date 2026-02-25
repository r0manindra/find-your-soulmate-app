import { Platform } from 'react-native';

// ---------------------------------------------------------------------------
// Glass Design Tokens
// ---------------------------------------------------------------------------

export const GLASS = {
  blur: { none: 0, light: 10, medium: 20, heavy: 40 },
  opacity: { subtle: 0.4, light: 0.6, medium: 0.7, heavy: 0.85 },
  border: { width: 0.5, opacity: 0.2 },
} as const;

export const BORDER_RADIUS = {
  xs: 6,
  sm: 10,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 100,
  circle: 9999,
} as const;

export const SHADOWS = {
  medium: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
    },
    default: { elevation: 4 },
  }),
} as const;

export const SPACING = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

// ---------------------------------------------------------------------------
// Color utility
// ---------------------------------------------------------------------------

/**
 * Parse a color string and return an rgba() string with the given opacity.
 * Supports: #RGB, #RRGGBB, rgb(), rgba(), hsl().
 */
export function withOpacity(color: string, opacity: number): string {
  const o = Math.max(0, Math.min(1, opacity));

  // Hex
  const hexMatch = color.match(/^#([0-9a-f]{3,8})$/i);
  if (hexMatch) {
    let hex = hexMatch[1];
    if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${o})`;
  }

  // rgb() / rgba()
  const rgbMatch = color.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (rgbMatch) {
    return `rgba(${rgbMatch[1]},${rgbMatch[2]},${rgbMatch[3]},${o})`;
  }

  // hsl() — pass through with opacity as alpha
  const hslMatch = color.match(/hsl\(\s*(\d+)\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*\)/);
  if (hslMatch) {
    return `hsla(${hslMatch[1]},${hslMatch[2]}%,${hslMatch[3]}%,${o})`;
  }

  // Fallback: return as-is with opacity wrapper
  return `rgba(0,0,0,${o})`;
}

// ---------------------------------------------------------------------------
// Platform detection
// ---------------------------------------------------------------------------

/**
 * Returns true only on iOS 26+ where native liquid glass is available.
 */
export function supportsLiquidGlass(): boolean {
  if (Platform.OS !== 'ios') return false;
  const version = typeof Platform.Version === 'string'
    ? parseInt(Platform.Version, 10)
    : Platform.Version;
  return version >= 26;
}

/**
 * Color manipulation utilities for theme token generation.
 * All functions work with hex colors (with or without # prefix).
 */

/**
 * Parse a hex color string into [r, g, b] array.
 * @param {string} hex - Hex color (e.g. "#ff0000" or "ff0000")
 * @returns {[number, number, number]} RGB values 0-255
 */
function parseHex(hex) {
  const clean = hex.replace('#', '');
  if (clean.length === 3) {
    return [
      parseInt(clean[0] + clean[0], 16),
      parseInt(clean[1] + clean[1], 16),
      parseInt(clean[2] + clean[2], 16)
    ];
  }
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16)
  ];
}

/**
 * Convert RGB to hex string.
 * @param {[number, number, number]} rgb
 * @returns {string} Hex color with #
 */
function rgbToHex(rgb) {
  return '#' + rgb.map(v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
}

/**
 * Convert RGB to rgba string.
 * @param {[number, number, number]} rgb
 * @param {number} alpha - 0-1
 * @returns {string} rgba() string
 */
function rgbToRgba(rgb, alpha) {
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
}

/**
 * Darken a hex color by percentage.
 * @param {string} hex
 * @param {number} percent - 0-100
 * @returns {string}
 */
export function darkenColor(hex, percent) {
  const [r, g, b] = parseHex(hex);
  const factor = 1 - percent / 100;
  return rgbToHex([r * factor, g * factor, b * factor]);
}

/**
 * Lighten a hex color by percentage.
 * @param {string} hex
 * @param {number} percent - 0-100
 * @returns {string}
 */
export function lightenColor(hex, percent) {
  const [r, g, b] = parseHex(hex);
  return rgbToHex([
    r + (255 - r) * percent / 100,
    g + (255 - g) * percent / 100,
    b + (255 - b) * percent / 100
  ]);
}

/**
 * Mix two hex colors by ratio.
 * @param {string} hex1
 * @param {string} hex2
 * @param {number} ratio - 0-1 (0 = all hex1, 1 = all hex2)
 * @returns {string}
 */
export function mixColor(hex1, hex2, ratio) {
  const [r1, g1, b1] = parseHex(hex1);
  const [r2, g2, b2] = parseHex(hex2);
  return rgbToHex([
    r1 + (r2 - r1) * ratio,
    g1 + (g2 - g1) * ratio,
    b1 + (b2 - b1) * ratio
  ]);
}

/**
 * Convert hex to rgba string.
 * @param {string} hex
 * @param {number} alpha - 0-1
 * @returns {string}
 */
export function hexToRgba(hex, alpha) {
  const rgb = parseHex(hex);
  return rgbToRgba(rgb, alpha);
}

/**
 * Generate a full token set from primitive colors.
 * @param {object} tokens - { background, surface, text, accent, border, radius }
 * @returns {object} Full token set with derived colors
 */
export function generateTokenSet(tokens) {
  const { background, surface, text, accent, border, radius } = tokens;

  return {
    // Base colors (from blueprint)
    background,
    surface,
    text,
    accent,
    border,
    radius,

    // Derived text colors
    textSoft: lightenColor(text, 55),
    textFaint: lightenColor(text, 70),
    textInverse: '#ffffff',

    // Derived accent colors
    accentHover: darkenColor(accent, 18),
    accentSoft: lightenColor(accent, 65),
    accentGlow: hexToRgba(accent, 0.15),

    // Derived border colors
    borderStrong: darkenColor(border, 12),

    // Derived surface colors
    surfaceHover: mixColor(surface, background, 0.3),
    surfaceMuted: mixColor(surface, background, 0.5),
    surfaceStrong: mixColor(surface, border, 0.4),

    // Derived shadows
    shadowColor: hexToRgba(text, 0.06),
    shadowColorMd: hexToRgba(text, 0.10),
    shadowColorLg: hexToRgba(text, 0.15),
    shadowColorXl: hexToRgba(text, 0.22),

    // Semantic colors (standard, not accent-mixed for clarity)
    success: '#2d7a4f',
    successSoft: '#d4edda',
    successBg: '#e8f5ec',
    warning: '#b8860b',
    warningSoft: '#fdf3cd',
    warningBg: '#fef9e7',
    error: '#c0392b',
    errorSoft: '#f8d7da',
    errorBg: '#fce4e4',
    info: '#2980b9',
    infoSoft: '#d1ecf1',
    infoBg: '#e3f2fd',

    // Focus
    focus: '#b47a3c',

    // Radius aliases
    radiusNone: '0',
    radiusXs: '0.25rem',
    radiusSm: radius,
    radiusMd: `calc(${radius} * 1.5)`,
    radiusLg: `calc(${radius} * 2)`,
    radiusXl: `calc(${radius} * 2.5)`,
    radiusFull: '9999px',
  };
}

/**
 * Generate dark mode token overrides.
 * @param {object} tokens - Full token set from generateTokenSet
 * @returns {object} Dark mode overrides
 */
export function generateDarkTokens(tokens) {
  const { text, accent, border, surface, background } = tokens;

  return {
    background: darkenColor(background, 92),
    surface: darkenColor(surface, 88),
    surfaceHover: darkenColor(surface, 82),
    surfaceMuted: darkenColor(surface, 85),
    surfaceStrong: darkenColor(surface, 80),
    text: lightenColor(text, 85),
    textSoft: lightenColor(text, 55),
    textFaint: lightenColor(text, 35),
    textInverse: darkenColor(background, 92),
    accent: lightenColor(accent, 25),
    accentHover: lightenColor(accent, 35),
    accentSoft: darkenColor(accent, 75),
    border: darkenColor(border, 65),
    borderStrong: darkenColor(border, 50),
    focus: lightenColor(tokens.focus, 15),
    success: '#4ade80',
    successSoft: darkenColor(tokens.successSoft, 70),
    successBg: darkenColor(tokens.successBg, 70),
    warning: '#fbbf24',
    warningSoft: darkenColor(tokens.warningSoft, 70),
    warningBg: darkenColor(tokens.warningBg, 70),
    error: '#f87171',
    errorSoft: darkenColor(tokens.errorSoft, 70),
    errorBg: darkenColor(tokens.errorBg, 70),
    info: '#60a5fa',
    infoSoft: darkenColor(tokens.infoSoft, 70),
    infoBg: darkenColor(tokens.infoBg, 70),
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowColorMd: 'rgba(0, 0, 0, 0.5)',
    shadowColorLg: 'rgba(0, 0, 0, 0.55)',
    shadowColorXl: 'rgba(0, 0, 0, 0.65)',
    accentGlow: hexToRgba(lightenColor(accent, 25), 0.2),
  };
}

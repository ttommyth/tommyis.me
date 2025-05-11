import { Color as CuloriColor, Oklch, formatCss } from 'culori';

// Helper to get CSS string from Culori color object
export const getCssString = (colorObj: CuloriColor | undefined): string => {
  if (!colorObj) return 'transparent';
  const str = formatCss(colorObj);
  return str || 'transparent';
};

// Helper to generate hue gradient colors
export const getHueGradientCssStrings = (
  colorConstructor: (hue: number) => CuloriColor,
  stops = 6,
): string[] => {
  const result: string[] = [];
  for (let i = 0; i <= stops; i++) {
    const hue = (i / stops) * 360;
    result.push(getCssString(colorConstructor(hue % 360)));
  }
  return result;
};

// Palette Generation Utilities (Oklch)
export const generatePaletteSteps = (
  baseColor: Oklch,
  targetProperty: keyof Oklch,
  startValue: number,
  endValue: number,
  numSteps: number,
): string[] => {
  const palette: string[] = [];
  if (numSteps <= 0) return [getCssString(baseColor)];

  for (let i = 0; i <= numSteps; i++) {
    const progress = i / numSteps;
    const newColor = { ...baseColor };
    (newColor[targetProperty] as number) =
      startValue + (endValue - startValue) * progress;
    // Clamp lightness and chroma
    if (newColor.l < 0) newColor.l = 0;
    if (newColor.l > 1) newColor.l = 1;
    if (newColor.c < 0) newColor.c = 0;
    palette.push(getCssString(newColor) || 'transparent');
  }
  return palette;
};

export const generateTints = (baseOklch: Oklch, numSteps = 12): string[] => {
  const targetL = Math.min(0.98, baseOklch.l + (1 - baseOklch.l) * 0.9);
  return generatePaletteSteps(baseOklch, 'l', baseOklch.l, targetL, numSteps);
};

export const generateShades = (baseOklch: Oklch, numSteps = 12): string[] => {
  const targetL = Math.max(0.02, baseOklch.l * 0.1);
  return generatePaletteSteps(baseOklch, 'l', baseOklch.l, targetL, numSteps);
};

export const generateTones = (baseOklch: Oklch, numSteps = 12): string[] => {
  return generatePaletteSteps(baseOklch, 'c', baseOklch.c, 0, numSteps);
};

// Color Harmony Utilities (Oklch)
export const getHarmonyColor = (baseOklch: Oklch, hueShift: number): Oklch => {
  let newHue = (baseOklch.h || 0) + hueShift;
  while (newHue < 0) newHue += 360;
  while (newHue >= 360) newHue -= 360;
  return { ...baseOklch, h: newHue };
};

export const generateComplementaryHarmony = (baseOklch: Oklch): string[] => {
  return [
    getCssString(baseOklch),
    getCssString(getHarmonyColor(baseOklch, 180)),
  ].filter(Boolean) as string[];
};

export const generateAnalogousHarmony = (
  baseOklch: Oklch,
  angle = 30,
): string[] => {
  return [
    getCssString(getHarmonyColor(baseOklch, -angle)),
    getCssString(baseOklch),
    getCssString(getHarmonyColor(baseOklch, angle)),
  ].filter(Boolean) as string[];
};

export const generateTriadicHarmony = (baseOklch: Oklch): string[] => {
  return [
    getCssString(baseOklch),
    getCssString(getHarmonyColor(baseOklch, 120)),
    getCssString(getHarmonyColor(baseOklch, 240)),
  ].filter(Boolean) as string[];
};

export const generateTetradicHarmony = (
  baseOklch: Oklch,
  angle = 60,
): string[] => {
  return [
    getCssString(baseOklch),
    getCssString(getHarmonyColor(baseOklch, angle)),
    getCssString(getHarmonyColor(baseOklch, 180)),
    getCssString(getHarmonyColor(baseOklch, 180 + angle)),
  ].filter(Boolean) as string[];
};

export const generateSplitComplementaryHarmony = (
  baseOklch: Oklch,
  angle = 30,
): string[] => {
  return [
    getCssString(baseOklch),
    getCssString(getHarmonyColor(baseOklch, 180 - angle)),
    getCssString(getHarmonyColor(baseOklch, 180 + angle)),
  ].filter(Boolean) as string[];
};

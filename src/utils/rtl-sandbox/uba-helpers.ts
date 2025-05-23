import {
  MIRRORED_CHARACTERS,
  NEUTRAL_UBA_TYPES,
  WEAK_DIRECTION_TYPES,
} from '@/constants/rtl-sandbox/uba-types';
import type { UbaBidiType } from '@/utils/directionality';

/**
 * Get the Unicode Bidirectional Algorithm type for a character
 */
export function getUbaBidiType(char: string): UbaBidiType {
  const code = char.codePointAt(0);
  if (!code) return 'ON';

  // Basic Latin (ASCII)
  if (code >= 0x0041 && code <= 0x005a) return 'L'; // A-Z
  if (code >= 0x0061 && code <= 0x007a) return 'L'; // a-z
  if (code >= 0x0030 && code <= 0x0039) return 'EN'; // 0-9

  // Hebrew
  if (code >= 0x05d0 && code <= 0x05ea) return 'R'; // Hebrew letters
  if (code >= 0x05f0 && code <= 0x05f4) return 'R'; // Hebrew ligatures

  // Arabic
  if (code >= 0x0600 && code <= 0x06ff) return 'AL'; // Arabic block
  if (code >= 0x0750 && code <= 0x077f) return 'AL'; // Arabic Supplement
  if (code >= 0x08a0 && code <= 0x08ff) return 'AL'; // Arabic Extended-A
  if (code >= 0xfb50 && code <= 0xfdff) return 'AL'; // Arabic Presentation Forms-A
  if (code >= 0xfe70 && code <= 0xfeff) return 'AL'; // Arabic Presentation Forms-B

  // Common punctuation and symbols
  if (char === ' ' || char === '\t') return 'WS'; // Whitespace
  if (char === '\n' || char === '\r') return 'B'; // Paragraph separator
  if ('.,;:!?'.includes(char)) return 'CS'; // Common separator
  if ('()[]{}«»""\'\''.includes(char)) return 'ON'; // Other neutral
  if ('+-*/=<>'.includes(char)) return 'ES'; // European separator
  if ('$€£¥'.includes(char)) return 'ET'; // European terminator

  // Default fallback
  return 'ON'; // Other Neutral
}

/**
 * Check if a character is a mirrored character
 */
export function isMirroredCharacter(char: string): boolean {
  return MIRRORED_CHARACTERS.includes(char);
}

/**
 * Check if a character has a weak direction type
 */
export function isWeakType(type: UbaBidiType): boolean {
  return WEAK_DIRECTION_TYPES.includes(type);
}

/**
 * Check if a character has a neutral type
 */
export function isNeutralType(type: UbaBidiType): boolean {
  return NEUTRAL_UBA_TYPES.includes(type);
}

/**
 * Check if all characters in a text have weak direction types
 */
export function areAllCharsWeak(text: string): boolean {
  return Array.from(text).every((char) => {
    const type = getUbaBidiType(char);
    return isWeakType(type);
  });
}

/**
 * Check if text contains any mirrored characters
 */
export function containsMirroredCharacters(text: string): boolean {
  return Array.from(text).some((char) => isMirroredCharacter(char));
}

/**
 * Check if text is uniformly mirrored (all same mirrored character)
 */
export function isUniformlyMirrored(text: string): boolean {
  if (text.length === 0) return false;

  const firstChar = text[0];
  if (!isMirroredCharacter(firstChar)) return false;

  return Array.from(text).every((char) => char === firstChar);
}

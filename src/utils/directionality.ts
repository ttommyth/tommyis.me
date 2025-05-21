export type Direction = 'ltr' | 'rtl' | 'auto';
export type DetectedDirection = 'ltr' | 'rtl' | 'neutral';

// Unicode Bidirectional Character Types (a selection relevant for common cases)
// Reference: https://www.unicode.org/reports/tr9/#Bidirectional_Character_Types
export type UbaBidiType =
  | 'L' // Left-to-Right
  | 'R' // Right-to-Left
  | 'AL' // Arabic Letter
  | 'EN' // European Number
  | 'ES' // European Separator
  | 'ET' // European Terminator
  | 'AN' // Arabic Number
  | 'CS' // Common Separator
  | 'NSM' // Non-Spacing Mark (will be attached to preceding char type)
  | 'BN' // Boundary Neutral (often ignored in rendering, like ZWJ, ZWNJ)
  | 'B' // Paragraph Separator
  | 'S' // Segment Separator
  | 'WS' // Whitespace
  | 'ON'; // Other Neutral
// Plus others like PDF, LRE, RLE, LRO, RLO, LRI, RLI, FSI, PDI for explicit formatting (might be out of scope for analysis)

export interface OriginalTypedChunk {
  text: string;
  originalType: UbaBidiType;
  resolvedType?: UbaBidiType;
}

export interface FirstStrongCharInfo {
  char: string | null;
  index: number | null;
  direction: DetectedDirection; // This remains the high-level outcome
  rawType?: UbaBidiType; // For debugging or more advanced analysis
}

export interface BiDiSegment {
  text: string; // The full text of this display segment after all merging
  direction: DetectedDirection; // The final LTR/RTL/Neutral direction for this whole segment
  chunks: OriginalTypedChunk[]; // Detailed breakdown of the text by original UBA type
  // rawType: UbaBidiType; // This will be effectively replaced by inspecting chunks if needed for the whole segment
}

// Unicode ranges - these are simplified and not exhaustive
const LTR_RANGES: Array<[number, number, UbaBidiType?]> = [
  [0x0041, 0x005a, 'L'], // A-Z
  [0x0061, 0x007a, 'L'], // a-z
  [0x00c0, 0x00d6, 'L'], // Latin-1 Supplement (subset)
  [0x00d8, 0x00f6, 'L'], // Latin-1 Supplement (subset)
  [0x00f8, 0x024f, 'L'], // Latin-1 Supplement & more
  // Greek, Cyrillic etc. would also be 'L'
  [0x3040, 0x309f, 'L'], // Hiragana
  [0x30a0, 0x30ff, 'L'], // Katakana
  [0x4e00, 0x9fff, 'L'], // CJK Unified Ideographs (Common Chinese, Japanese, Korean)
  [0xac00, 0xd7a3, 'L'], // Hangul Syllables (Korean)
];

const RTL_RANGES: Array<[number, number, UbaBidiType?]> = [
  [0x0590, 0x05ff, 'R'], // Hebrew
  // Note: Arabic letters are typically 'AL', handled separately if needed for stricter UBA, but often grouped with 'R' in simplified models.
  // For now, we'll use 'R' as a general RTL strong type. If specific AL rules are needed, we'll refine.
  [0x0700, 0x074f, 'R'], // Syriac
  [0x0780, 0x07bf, 'R'], // Thaana
  [0x0800, 0x083f, 'R'], // Samaritan
];

const ARABIC_LETTER_RANGES: Array<[number, number, UbaBidiType?]> = [
  [0x0600, 0x06ff, 'AL'], // Arabic block (includes letters, some digits, punctuation)
  [0x0750, 0x077f, 'AL'], // Arabic Supplement
  [0x08a0, 0x08ff, 'AL'], // Arabic Extended-A
  // More specific sub-ranges for AL vs AN vs ON within these blocks might be needed.
];

const EUROPEAN_NUMBER_RANGES: Array<[number, number]> = [
  [0x0030, 0x0039], // 0-9
];

const ARABIC_NUMBER_RANGES: Array<[number, number]> = [
  [0x0660, 0x0669], // Arabic-Indic Digits (٠١٢٣٤٥٦٧٨٩)
  [0x06f0, 0x06f9], // Extended Arabic-Indic Digits (۰۱۲۳۴۵۶۷۸۹ - Persian, Urdu, etc.)
];

// TODO: Add ranges for NSM, BN, B, S, WS, ON, CS, ES, ET

/**
 * Determines the Unicode Bidi Class of a single character.
 * This is a simplified version. A full UBA implementation is complex.
 */
function getUbaBidiType(char: string): UbaBidiType {
  const code = char.charCodeAt(0);

  for (const range of LTR_RANGES) {
    if (code >= range[0] && code <= range[1]) return range[2] || 'L';
  }

  // Specific RTL characters before general Arabic/RTL blocks for precision
  if (code === 0x061f) return 'AL'; // Arabic Question Mark ؟

  // Test for Arabic Letters *before* general RTL if AL needs distinct handling
  for (const range of ARABIC_LETTER_RANGES) {
    if (code >= range[0] && code <= range[1]) {
      // Further refinement: check if it's an Arabic Number within an AL block
      for (const anRange of ARABIC_NUMBER_RANGES) {
        if (code >= anRange[0] && code <= anRange[1]) return 'AN';
      }
      // Could add more specific checks here for ON, etc. within Arabic blocks
      return range[2] || 'AL';
    }
  }
  for (const range of RTL_RANGES) {
    if (code >= range[0] && code <= range[1]) return range[2] || 'R';
  }
  for (const range of EUROPEAN_NUMBER_RANGES) {
    if (code >= range[0] && code <= range[1]) return 'EN';
  }
  for (const range of ARABIC_NUMBER_RANGES) {
    // Re-check in case not caught by AL block refinement
    if (code >= range[0] && code <= range[1]) return 'AN';
  }

  // Whitespace check (simplified)
  if (/\s/.test(char)) {
    // This is a broad check for any whitespace
    if (char === '\\n') return 'B'; // Paragraph Separator (Newline)
    // Other specific WS characters like tab (S - Segment Separator) could be added
    return 'WS';
  }

  // Common Punctuation and Symbols (very simplified, UBA is more granular)
  // CS (Common Separator): , . / : ;
  if ([',', '.', ':', ';'].includes(char)) return 'CS';
  // Treat markup-like symbols as LTR for visualization stability within segments
  if (['<', '>', '/'].includes(char)) return 'L';

  // ES (European Separator): Used between EN, like a decimal point. Often same as CS.
  // ET (European Terminator): $, %, #, degree sign etc. Often used with EN.
  // For simplicity, many of these might fall to ON for now.
  // Example ET:
  if (['$', '%', '#', '°'].includes(char)) return 'ET';

  // Fallback to Other Neutral
  return 'ON';
}

/**
 * Detects the direction of a string based on its first strong directionality character.
 * Now uses getUbaBidiType and checks for L, R, or AL.
 */
export function detectFirstStrongDirection(text: string): FirstStrongCharInfo {
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const type = getUbaBidiType(char);
    if (type === 'L') {
      return { char, index: i, direction: 'ltr', rawType: type };
    }
    if (type === 'R' || type === 'AL') {
      return { char, index: i, direction: 'rtl', rawType: type };
    }
  }
  return { char: null, index: null, direction: 'neutral', rawType: 'ON' }; // Default if no strong found
}

/**
 * Analyzes a string to identify segments of LTR, RTL, or Neutral text,
 * aiming for a more UBA-compliant approach.
 */
export function analyzeBiDiSegments(
  text: string,
  overallDirProp: Direction = 'auto',
  _locale?: string,
): BiDiSegment[] {
  if (!text) return [];

  let paragraphBaseDirection: 'ltr' | 'rtl';
  if (overallDirProp === 'ltr' || overallDirProp === 'rtl') {
    paragraphBaseDirection = overallDirProp;
  } else {
    const firstStrong = detectFirstStrongDirection(text);
    paragraphBaseDirection =
      firstStrong.direction === 'neutral' ? 'ltr' : firstStrong.direction;
  }

  // 1. Initial segmentation into OriginalTypedChunk[]
  const chunks: Array<OriginalTypedChunk & { resolvedType?: UbaBidiType }> = []; // Add resolvedType for UBA processing
  if (text.length > 0) {
    let currentText = '';
    let currentOriginalType: UbaBidiType | null = null;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const charOriginalType = getUbaBidiType(char);
      if (currentOriginalType === null) {
        currentText = char;
        currentOriginalType = charOriginalType;
      } else if (charOriginalType === currentOriginalType) {
        currentText += char;
      } else {
        chunks.push({ text: currentText, originalType: currentOriginalType });
        currentText = char;
        currentOriginalType = charOriginalType;
      }
    }
    if (currentText && currentOriginalType) {
      chunks.push({ text: currentText, originalType: currentOriginalType });
    }
  }

  if (chunks.length === 0) return [];

  // Initialize resolvedType to originalType for each chunk
  chunks.forEach((chunk) => {
    chunk.resolvedType = chunk.originalType;
  });

  // --- Apply UBA W-rules (simplified set, with whitespace skipping) ---
  // Rules modify chunk.resolvedType

  // Rule W2: AL + EN(s) -> AL + AN(s)
  for (let i = 0; i < chunks.length; i++) {
    if (chunks[i].resolvedType === 'EN') {
      let k = i - 1;
      while (k >= 0 && chunks[k].resolvedType === 'WS') k--;
      if (k >= 0 && chunks[k].resolvedType === 'AL') {
        chunks[i].resolvedType = 'AN';
      }
    }
  }

  // Rule W4: (EN|AN) + (ES|CS) -> (EN|AN) + (EN|AN)
  for (let i = 0; i < chunks.length; i++) {
    if (chunks[i].resolvedType === 'ES' || chunks[i].resolvedType === 'CS') {
      let k = i - 1;
      while (k >= 0 && chunks[k].resolvedType === 'WS') k--;
      if (
        k >= 0 &&
        (chunks[k].resolvedType === 'EN' || chunks[k].resolvedType === 'AN')
      ) {
        // Check character after CS/ES too for cases like EN CS EN -> EN EN EN
        let m = i + 1;
        while (m < chunks.length && chunks[m].resolvedType === 'WS') m++;
        if (
          m < chunks.length &&
          chunks[m].resolvedType === chunks[k].resolvedType
        ) {
          chunks[i].resolvedType = chunks[k].resolvedType; // e.g. EN CS EN -> EN EN EN
        } else if (m === chunks.length) {
          // CS/ES is at the end after a number
          chunks[i].resolvedType = chunks[k].resolvedType; // e.g. EN CS -> EN EN
        }
      }
    }
  }

  // Combined/Revised W5/W6 for ET: Make ET part of EN sequence if adjacent (before W7)
  // Iteration 1: EN + ET -> EN + EN
  for (let i = 0; i < chunks.length - 1; i++) {
    if (chunks[i].resolvedType === 'EN') {
      let k = i + 1;
      while (k < chunks.length && chunks[k].resolvedType === 'WS') k++;
      if (k < chunks.length && chunks[k].resolvedType === 'ET') {
        chunks[k].resolvedType = 'EN';
      }
    }
  }
  // Iteration 2: ET + EN -> EN + EN
  for (let i = chunks.length - 1; i > 0; i--) {
    if (chunks[i].resolvedType === 'EN') {
      let k = i - 1;
      while (k >= 0 && chunks[k].resolvedType === 'WS') k--;
      if (k >= 0 && chunks[k].resolvedType === 'ET') {
        chunks[k].resolvedType = 'EN';
      }
    }
  }

  // Rule W7: L + EN(s) -> L + L(s) (applied after ETs are potentially converted to ENs)
  // Also handles L + Neutral + EN -> L + L + L
  for (let i = 0; i < chunks.length; i++) {
    if (chunks[i].resolvedType === 'EN') {
      let k1 = i - 1;
      while (k1 >= 0 && chunks[k1].resolvedType === 'WS') k1--;

      if (k1 >= 0) {
        const p1Chunk = chunks[k1];
        if (p1Chunk.resolvedType === 'L') {
          chunks[i].resolvedType = 'L'; // Case: L + EN -> L + L
        } else if (['CS', 'ES', 'ET', 'ON'].includes(p1Chunk.resolvedType!)) {
          // Case: Potential L + Neutral + EN
          let k2 = k1 - 1;
          while (k2 >= 0 && chunks[k2].resolvedType === 'WS') k2--;
          if (k2 >= 0 && chunks[k2].resolvedType === 'L') {
            p1Chunk.resolvedType = 'L'; // Change Neutral to L
            chunks[i].resolvedType = 'L'; // Change EN to L
          }
        }
      }
    }
  }

  // New Rule W7b: L + ON + L -> L + L + L (handles intervening WS)
  // This helps bridge LTR context across isolated ONs between LTR segments.
  for (let i = 1; i < chunks.length - 1; i++) {
    // Iterate from second to second-to-last
    if (chunks[i].resolvedType === 'ON') {
      let k_prev = i - 1;
      while (k_prev >= 0 && chunks[k_prev].resolvedType === 'WS') k_prev--;

      if (k_prev >= 0 && chunks[k_prev].resolvedType === 'L') {
        let k_next = i + 1;
        while (k_next < chunks.length && chunks[k_next].resolvedType === 'WS')
          k_next++;

        if (k_next < chunks.length && chunks[k_next].resolvedType === 'L') {
          chunks[i].resolvedType = 'L'; // Change the ON segment to L
        }
      }
    }
  }

  // --- Apply UBA N-rules (simplified set) ---
  // Rules modify chunk.resolvedType for neutrals
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    if (['ON', 'WS', 'CS', 'ES', 'ET'].includes(chunk.resolvedType!)) {
      // Use resolvedType
      let prevStrongResolvedType: UbaBidiType | null = null;
      for (let j = i - 1; j >= 0; j--) {
        const s = chunks[j];
        if (['L', 'R', 'AL'].includes(s.resolvedType!)) {
          prevStrongResolvedType = s.resolvedType!;
          break;
        }
      }
      let nextStrongResolvedType: UbaBidiType | null = null;
      for (let j = i + 1; j < chunks.length; j++) {
        const s = chunks[j];
        if (['L', 'R', 'AL'].includes(s.resolvedType!)) {
          nextStrongResolvedType = s.resolvedType!;
          break;
        }
      }
      let finalNeutralResolvedType: UbaBidiType =
        paragraphBaseDirection === 'ltr' ? 'L' : 'R'; // Default to paragraph dir
      if (
        prevStrongResolvedType &&
        prevStrongResolvedType === nextStrongResolvedType
      ) {
        finalNeutralResolvedType = prevStrongResolvedType;
      }
      chunk.resolvedType = finalNeutralResolvedType;
    }
  }

  // 2. Group chunks into BiDiSegments based on final resolved direction
  const finalSegments: BiDiSegment[] = [];
  if (chunks.length === 0) return [];

  let currentSegmentChunks: OriginalTypedChunk[] = [];
  let currentSegmentDirection: DetectedDirection | null = null;

  function mapResolvedTypeToDirection(
    type: UbaBidiType,
    paraDir: 'ltr' | 'rtl',
  ): DetectedDirection {
    switch (type) {
      case 'L':
        return 'ltr';
      case 'R':
      case 'AL':
        return 'rtl';
      case 'AN':
        return 'rtl'; // ANs are RTL
      case 'EN':
        // If an EN has not been resolved to L by W7 (L+EN) or AN by W2 (AL+EN),
        // its directionality is determined by the paragraph direction as per UBA N0/N2.
        return paraDir === 'rtl' ? 'rtl' : 'ltr';
      // Other weak types (CS, ES, ET, WS, ON) should have been resolved to L, R, or AL by N-rules.
      // If they are still their original weak type, they take the paragraph direction.
      case 'CS':
      case 'ES':
      case 'ET':
      case 'WS':
      case 'ON':
      case 'B':
      case 'S':
      case 'NSM': // NSM should ideally be absorbed or take type of preceding, but as fallback:
      case 'BN': // BN is often ignored, but as fallback:
        return paraDir;
      default:
        // Should ideally not happen if all types are handled.
        // As a fallback, assume it takes paragraph direction.
        return paraDir;
    }
  }

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const chunkResolvedDirection = mapResolvedTypeToDirection(
      chunk.resolvedType!,
      paragraphBaseDirection,
    );

    if (currentSegmentDirection === null) {
      currentSegmentDirection = chunkResolvedDirection;
      currentSegmentChunks.push({
        text: chunk.text,
        originalType: chunk.originalType,
      });
    } else if (chunkResolvedDirection === currentSegmentDirection) {
      currentSegmentChunks.push({
        text: chunk.text,
        originalType: chunk.originalType,
      });
    } else {
      // Direction changed, finalize previous segment
      finalSegments.push({
        text: currentSegmentChunks.map((c) => c.text).join(''),
        direction: currentSegmentDirection,
        chunks: [...currentSegmentChunks],
      });
      // Start new segment
      currentSegmentDirection = chunkResolvedDirection;
      currentSegmentChunks = [
        { text: chunk.text, originalType: chunk.originalType },
      ];
    }
  }
  // Add the last segment
  if (currentSegmentChunks.length > 0 && currentSegmentDirection !== null) {
    finalSegments.push({
      text: currentSegmentChunks.map((c) => c.text).join(''),
      direction: currentSegmentDirection,
      chunks: currentSegmentChunks,
    });
  }
  return finalSegments;
}

// Example of how Intl.Segmenter could be used (requires browser support):
// export async function segmentTextWithIntl(text: string, locale: string): Promise<string[]> {
//   if (!('Segmenter' in Intl)) {
//     console.warn('Intl.Segmenter not supported in this browser.');
//     return text.split(' '); // Fallback
//   }
//   try {
//     const segmenter = new Intl.Segmenter(locale, { granularity: 'word' });
//     const segments = Array.from(segmenter.segment(text)).map(s => s.segment);
//     return segments;
//   } catch (error) {
//     console.error('Error using Intl.Segmenter:', error);
//     return text.split(' '); // Fallback
//   }
// }

// }

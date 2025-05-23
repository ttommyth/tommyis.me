import type { UbaBidiType } from '@/utils/directionality';

/**
 * Unicode Bidirectional Algorithm (UBA) Type Definitions
 * These describe the bidirectional behavior of different character types
 */
export const UBA_TYPE_DEFINITIONS: Readonly<Record<UbaBidiType, string>> = {
  L: 'L: Left-to-Right (Strong type for LTR scripts like Latin, Greek, Cyrillic)',
  R: 'R: Right-to-Left (Strong type for RTL scripts like Hebrew, Syriac)',
  AL: 'AL: Arabic Letter (Strong type for Arabic, Thaana, etc.)',
  EN: 'EN: European Number (Weak type, e.g., 0-9. Direction influenced by context)',
  ES: 'ES: European Separator (Weak type, e.g., comma/period with EN. Context-dependent)',
  ET: 'ET: European Terminator (Weak type, e.g., $, %, degree. Used with EN. Context-dependent)',
  AN: 'AN: Arabic Number (Weak type, e.g., Arabic-Indic digits. Inherently RTL context)',
  CS: 'CS: Common Separator (Weak type, e.g., ,, ., :, /. Context-dependent)',
  NSM: 'NSM: Non-Spacing Mark (Weak type, attaches to preceding char. Zero width)',
  BN: 'BN: Boundary Neutral (Weak type, e.g., ZWJ, ZWNJ. No visual effect, affects joining/segmentation)',
  B: 'B: Paragraph Separator (Neutral type, e.g., newline. Causes BiDi algorithm to restart)',
  S: 'S: Segment Separator (Neutral type, e.g., Tab. Handled by higher-level protocols)',
  WS: 'WS: Whitespace (Neutral type, e.g., space, tab. Resolved by surrounding types or base dir)',
  ON: 'ON: Other Neutral (Neutral type, e.g., most punctuation, symbols not otherwise classified)',
};

/**
 * Common color mapping for UBA types used across visualization components
 */
export const UBA_TYPE_COLOR_MAP: Record<UbaBidiType, string> = {
  L: 'bg-sky-200 dark:bg-sky-800 text-sky-800 dark:text-sky-200 border-sky-400 dark:border-sky-600',
  R: 'bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 border-emerald-400 dark:border-emerald-600',
  AL: 'bg-teal-200 dark:bg-teal-800 text-teal-800 dark:text-teal-200 border-teal-400 dark:border-teal-600',
  EN: 'bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 border-amber-400 dark:border-amber-600',
  AN: 'bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 border-yellow-400 dark:border-yellow-600',
  ES: 'bg-rose-200 dark:bg-rose-800 text-rose-800 dark:text-rose-200 border-rose-400 dark:border-rose-600',
  ET: 'bg-pink-200 dark:bg-pink-800 text-pink-800 dark:text-pink-200 border-pink-400 dark:border-pink-600',
  CS: 'bg-fuchsia-200 dark:bg-fuchsia-800 text-fuchsia-800 dark:text-fuchsia-200 border-fuchsia-400 dark:border-fuchsia-600',
  NSM: 'bg-indigo-200 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200 border-indigo-400 dark:border-indigo-600',
  BN: 'bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 border-purple-400 dark:border-purple-600',
  B: 'bg-gray-400 dark:bg-gray-600 text-gray-800 dark:text-gray-200 border-gray-500',
  S: 'bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-400',
  WS: 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-400 dark:border-slate-500',
  ON: 'bg-stone-300 dark:bg-stone-600 text-stone-800 dark:text-stone-200 border-stone-400 dark:border-stone-500',
};

/**
 * Types that are considered neutral for group classification
 */
export const NEUTRAL_UBA_TYPES: ReadonlyArray<UbaBidiType> = [
  'ON',
  'WS',
  'CS',
  'ES',
  'ET',
  'B',
  'S',
  'NSM',
  'BN',
];

/**
 * Weak direction types that should be underlined in visualizations
 */
export const WEAK_DIRECTION_TYPES: ReadonlyArray<UbaBidiType> = [
  'EN',
  'ES',
  'ET',
  'AN',
  'CS',
  'NSM',
  'BN',
  'B',
  'S',
  'WS',
  'ON',
];

/**
 * Characters that get mirrored in RTL context
 */
export const MIRRORED_CHARACTERS: ReadonlyArray<string> = [
  '(',
  ')',
  '[',
  ']',
  '{',
  '}',
  '<',
  '>',
];

/**
 * Animation speed constants
 */
export const ANIMATION_SPEEDS = {
  FAST: 200, // 200ms per character
  SLOW: 500, // 500ms per character
} as const;

/**
 * Default example texts for RTL sandbox
 */
export const EXAMPLE_TEXTS = [
  {
    labelKey: 'loadRtlFirst',
    value: 'مرحبا LTR text 123 !؟',
  },
  {
    labelKey: 'loadLtrFirst',
    value: 'Hello RTL نص 456 ؟!',
  },
  {
    labelKey: 'loadNeutralFirst',
    value: '12345 LTR نص RTL',
  },
  {
    labelKey: 'loadMixedComplex',
    value:
      'The title is "كتاب العبر", by Ibn Khaldun (ابن خلدون). Price: $25.50.',
  },
  {
    labelKey: 'exampleMixedComplexRtlFirst',
    value:
      '"كتاب العبر", by <1>Ibn Khaldun</1> (((((ابن خلدون). Price: $25.50.',
  },
] as const;

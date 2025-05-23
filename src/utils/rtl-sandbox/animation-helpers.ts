import type { DetectedDirection, UbaBidiType } from '@/utils/directionality';
import { areAllCharsWeak } from './uba-helpers';

/**
 * Animation segment representing a character in the animation
 */
export interface AnimationSegment {
  char: string;
  type: UbaBidiType;
  direction: DetectedDirection;
  processed: boolean;
  groupIndex: number;
  resolvedType?: UbaBidiType;
}

/**
 * Processed group for animation visualization
 */
export interface ProcessedGroup {
  groupDirection: DetectedDirection;
  typeGroups: {
    [key: string]: {
      type: UbaBidiType;
      chars: AnimationSegment[];
    };
  };
}

/**
 * Initializes animation segments from input text
 * @param inputText - Text to create animation segments from
 * @returns Array of animation segments
 */
export function initializeAnimationSegments(
  inputText: string,
): AnimationSegment[] {
  return Array.from(inputText).map((char, index) => {
    // Simple type detection for initialization
    const code = char.charCodeAt(0);
    let type: UbaBidiType;
    let direction: DetectedDirection;

    // Latin characters
    if (
      (code >= 0x0041 && code <= 0x005a) ||
      (code >= 0x0061 && code <= 0x007a)
    ) {
      type = 'L';
      direction = 'ltr';
    }
    // Arabic
    else if (code >= 0x0600 && code <= 0x06ff) {
      type = 'AL';
      direction = 'rtl';
    }
    // Hebrew
    else if (code >= 0x0590 && code <= 0x05ff) {
      type = 'R';
      direction = 'rtl';
    }
    // European Numbers
    else if (code >= 0x0030 && code <= 0x0039) {
      type = 'EN';
      direction = 'neutral';
    }
    // Default to Other Neutral
    else {
      type = 'ON';
      direction = 'neutral';
    }

    return {
      char,
      type,
      direction,
      processed: false,
      groupIndex: -1,
    };
  });
}

/**
 * Groups animation segments by their assigned group index and type
 * @param animatedSegments - Array of animation segments
 * @returns Grouped characters by group index
 */
export function groupAnimationSegments(animatedSegments: AnimationSegment[]): {
  [key: number]: AnimationSegment[];
} {
  const groupedChars: { [key: number]: AnimationSegment[] } = {};

  animatedSegments.forEach((segment) => {
    if (segment.processed) {
      const groupIdx = segment.groupIndex;
      if (groupIdx !== -1) {
        if (!groupedChars[groupIdx]) {
          groupedChars[groupIdx] = [];
        }
        groupedChars[groupIdx].push(segment);
      }
    }
  });

  return groupedChars;
}

/**
 * Processes grouped characters into final visualization groups
 * @param groupedChars - Characters grouped by index
 * @param bidiSegments - BiDi segments for direction determination
 * @returns Processed groups for visualization
 */
export function processAnimationGroups(
  groupedChars: { [key: number]: AnimationSegment[] },
  bidiSegments: Array<{ direction: DetectedDirection }>,
): { [key: number]: ProcessedGroup } {
  const processedGroups: { [key: number]: ProcessedGroup } = {};

  Object.entries(groupedChars).forEach(([groupIdx, chars]) => {
    const groupIdxNum = parseInt(groupIdx);
    let groupDirection: DetectedDirection = 'neutral';

    // Check if all characters in this group have weak types
    const allCharsAreWeak = areAllCharsWeak(
      chars.map((char) => char.char).join(''),
    );

    // Determine group direction
    if (chars.length > 0) {
      if (allCharsAreWeak) {
        // If all characters are weak, set direction to neutral (will be displayed as LTR)
        groupDirection = 'neutral';
      } else if (
        bidiSegments[groupIdxNum] &&
        bidiSegments[groupIdxNum].direction
      ) {
        groupDirection = bidiSegments[groupIdxNum].direction;
      } else {
        groupDirection = chars[0].direction;
      }
    }

    // Initialize the processed group
    processedGroups[groupIdxNum] = {
      groupDirection,
      typeGroups: {},
    };

    // Sort chars to ensure sequential processing
    const sortedChars = [...chars].sort((a, b) => {
      // Find the original indices in the animatedSegments array for sorting
      return 0; // Simplified for now, would need the original array reference
    });

    // Group by resolvedType, maintaining sequential grouping
    let currentType: UbaBidiType | null = null;
    let currentTypeGroup: AnimationSegment[] = [];
    let currentTypeKey = 0;

    sortedChars.forEach((char, idx) => {
      const charType = char.resolvedType || char.type;

      // If this is the first char or matches the current type, add to current group
      if (currentType === null || charType === currentType) {
        if (currentType === null) {
          currentType = charType;
        }
        currentTypeGroup.push(char);
      } else {
        // Different type, create a new group
        if (currentTypeGroup.length > 0) {
          processedGroups[groupIdxNum].typeGroups[currentTypeKey] = {
            type: currentType,
            chars: [...currentTypeGroup],
          };
          currentTypeKey++;
        }
        currentType = charType;
        currentTypeGroup = [char];
      }

      // Handle the last group
      if (idx === sortedChars.length - 1 && currentTypeGroup.length > 0) {
        processedGroups[groupIdxNum].typeGroups[currentTypeKey] = {
          type: currentType!,
          chars: [...currentTypeGroup],
        };
      }
    });
  });

  return processedGroups;
}

/**
 * Calculates animation progress percentage
 * @param currentProgress - Current animation progress
 * @param totalLength - Total length of text
 * @returns Progress percentage (0-100)
 */
export function calculateAnimationProgress(
  currentProgress: number,
  totalLength: number,
): number {
  return totalLength > 0 ? (currentProgress / totalLength) * 100 : 0;
}

/**
 * Determines HTML dir attribute value for a group
 * @param groupDirection - The group's detected direction
 * @param isNeutralWeakGroup - Whether this is a neutral group with weak types
 * @returns HTML dir attribute value
 */
export function getHtmlDirection(
  groupDirection: DetectedDirection,
  isNeutralWeakGroup: boolean,
): 'ltr' | 'rtl' | undefined {
  if (isNeutralWeakGroup) {
    return 'ltr';
  }

  return groupDirection !== 'neutral' ? groupDirection : undefined;
}

/**
 * Determines CSS flexbox justification for a group
 * @param groupDirection - The group's detected direction
 * @param isNeutralWeakGroup - Whether this is a neutral group with weak types
 * @returns CSS class for flexbox justification
 */
export function getFlexJustification(
  groupDirection: DetectedDirection,
  isNeutralWeakGroup: boolean,
): string {
  if (isNeutralWeakGroup || groupDirection === 'ltr') {
    return 'justify-start';
  } else if (groupDirection === 'rtl') {
    return 'justify-end';
  } else {
    return 'justify-center';
  }
}

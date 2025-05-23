import {
  analyzeBiDiSegments,
  detectFirstStrongDirection,
  type BiDiSegment,
  type Direction,
  type FirstStrongCharInfo,
} from '@/utils/directionality';
import { useEffect, useMemo, useState } from 'react';

interface UseBiDiAnalysisProps {
  inputText: string;
  overallDirection: Direction;
  locale: string;
}

interface UseBiDiAnalysisReturn {
  // Analysis results
  detectedFirstStrongInfo: FirstStrongCharInfo | null;
  bidiSegments: BiDiSegment[];
  effectiveDirForVisualizations: Exclude<Direction, 'auto'>;

  // Computed values
  hasStrongDirection: boolean;
  hasSegments: boolean;
  isInputEmpty: boolean;
}

export function useBiDiAnalysis({
  inputText,
  overallDirection,
  locale,
}: UseBiDiAnalysisProps): UseBiDiAnalysisReturn {
  // State for analysis results
  const [detectedFirstStrongInfo, setDetectedFirstStrongInfo] =
    useState<FirstStrongCharInfo | null>(null);
  const [bidiSegments, setBidiSegments] = useState<BiDiSegment[]>([]);

  // Perform BiDi analysis when dependencies change
  useEffect(() => {
    if (inputText) {
      const firstStrongInfo = detectFirstStrongDirection(inputText);
      setDetectedFirstStrongInfo(firstStrongInfo);

      const segments = analyzeBiDiSegments(inputText, overallDirection, locale);
      setBidiSegments(segments);
    } else {
      setDetectedFirstStrongInfo(null);
      setBidiSegments([]);
    }
  }, [inputText, overallDirection, locale]);

  // Determine the effective direction for visualization containers
  const effectiveDirForVisualizations: Exclude<Direction, 'auto'> =
    useMemo(() => {
      if (overallDirection === 'ltr' || overallDirection === 'rtl') {
        return overallDirection;
      } else {
        // overallDirection is 'auto'
        if (
          detectedFirstStrongInfo?.direction === 'ltr' ||
          detectedFirstStrongInfo?.direction === 'rtl'
        ) {
          return detectedFirstStrongInfo.direction;
        } else {
          // Default to LTR if 'auto' and no strong direction detected in input, or input is neutral
          return 'ltr';
        }
      }
    }, [overallDirection, detectedFirstStrongInfo]);

  // Computed values
  const hasStrongDirection = useMemo(() => {
    return (
      detectedFirstStrongInfo !== null &&
      detectedFirstStrongInfo.direction !== 'neutral' &&
      detectedFirstStrongInfo.index !== null
    );
  }, [detectedFirstStrongInfo]);

  const hasSegments = bidiSegments.length > 0;
  const isInputEmpty = !inputText || inputText.trim().length === 0;

  return {
    // Analysis results
    detectedFirstStrongInfo,
    bidiSegments,
    effectiveDirForVisualizations,

    // Computed values
    hasStrongDirection,
    hasSegments,
    isInputEmpty,
  };
}

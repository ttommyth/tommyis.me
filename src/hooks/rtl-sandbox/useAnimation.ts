import { ANIMATION_SPEEDS } from '@/constants/rtl-sandbox/uba-types';
import type { BiDiSegment, DetectedDirection } from '@/utils/directionality';
import {
  calculateAnimationProgress,
  type AnimationSegment,
} from '@/utils/rtl-sandbox/animation-helpers';
import { getUbaBidiType } from '@/utils/rtl-sandbox/uba-helpers';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface UseAnimationProps {
  inputText: string;
  bidiSegments: BiDiSegment[];
}

interface UseAnimationReturn {
  // State
  isPlaying: boolean;
  animationProgress: number;
  animatedSegments: AnimationSegment[];
  animationSpeed: number;

  // Actions
  startAnimation: () => void;
  resetAnimation: () => void;
  toggleAnimationSpeed: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  seekToPosition: (position: number) => void;
  seekToPercentage: (percentage: number) => void;

  // Computed values
  progressPercentage: number;
  currentCharacter: string | null;
  currentType: string | null;
  isComplete: boolean;
  canStepForward: boolean;
  canStepBackward: boolean;
  segmentMarkers: Array<{
    position: number;
    segmentIndex: number;
    percentage: number;
  }>;
}

export function useAnimation({
  inputText,
  bidiSegments,
}: UseAnimationProps): UseAnimationReturn {
  // Animation state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [animationProgress, setAnimationProgress] = useState<number>(0);
  const [animatedSegments, setAnimatedSegments] = useState<AnimationSegment[]>(
    [],
  );
  const [animationInterval, setAnimationInterval] =
    useState<NodeJS.Timeout | null>(null);
  const [animationSpeed, setAnimationSpeed] = useState<number>(
    ANIMATION_SPEEDS.FAST,
  );

  // Reset animation when input text changes
  useEffect(() => {
    resetAnimation();
  }, [inputText]);

  // Cleanup animation interval on unmount
  useEffect(() => {
    return () => {
      if (animationInterval) {
        clearInterval(animationInterval);
      }
    };
  }, [animationInterval]);

  // Update animated segments from BiDi segments
  const updateAnimatedSegmentsFromBidiSegments = useCallback(
    (progress: number) => {
      if (!bidiSegments.length || !inputText) return;

      setAnimatedSegments((prev) => {
        const newSegments = [...prev];

        // Reset all characters first
        newSegments.forEach((segment, index) => {
          if (index >= progress) {
            segment.processed = false;
            segment.groupIndex = -1;
            segment.resolvedType = undefined;
          }
        });

        // Mark characters up to progress as processed
        let charIndex = 0;
        let currentGroupIndex = 0;

        // Iterate through all BiDi segments to find character positions
        for (const segment of bidiSegments) {
          for (const chunk of segment.chunks) {
            // Create an array of indices for all characters in this chunk
            const resolvedType = chunk.resolvedType || chunk.originalType;

            for (let i = 0; i < chunk.text.length; i++) {
              if (charIndex < newSegments.length) {
                // Only mark as processed if we've reached this point in the animation
                if (charIndex < progress) {
                  newSegments[charIndex].processed = true;
                  newSegments[charIndex].groupIndex = currentGroupIndex;

                  // Add resolved type to make grouping by type easier
                  newSegments[charIndex].resolvedType = resolvedType;
                }
              }
              charIndex++;
            }
          }
          currentGroupIndex++;
        }

        return newSegments;
      });
    },
    [bidiSegments, inputText],
  );

  const startAnimation = useCallback(() => {
    if (isPlaying) {
      // Pause animation
      if (animationInterval) {
        clearInterval(animationInterval);
        setAnimationInterval(null);
      }
      setIsPlaying(false);
    } else {
      // Start or resume animation
      if (inputText && bidiSegments.length > 0) {
        setIsPlaying(true);

        // Prepare animated segments if not already initialized
        if (animationProgress === 0 || animatedSegments.length === 0) {
          const initialSegments = Array.from(inputText).map((char, index) => {
            const type = getUbaBidiType(char);
            let direction: DetectedDirection;
            if (type === 'L') direction = 'ltr';
            else if (type === 'R' || type === 'AL') direction = 'rtl';
            else direction = 'neutral';

            return {
              char,
              type,
              direction,
              processed: false,
              groupIndex: -1, // Not yet assigned to a group
            };
          });
          setAnimatedSegments(initialSegments);
        }

        // Start the animation interval
        const interval = setInterval(() => {
          setAnimationProgress((prev) => {
            const newProgress = prev + 1;
            if (newProgress >= inputText.length) {
              // Animation complete, clear interval
              setAnimationInterval(null);
              setIsPlaying(false);

              // Final state - assign all characters to their groups from bidiSegments
              updateAnimatedSegmentsFromBidiSegments(inputText.length);

              return inputText.length;
            }

            // Update current character and any preceding ones
            updateAnimatedSegmentsFromBidiSegments(newProgress);

            return newProgress;
          });
        }, animationSpeed);

        setAnimationInterval(interval);
      }
    }
  }, [
    isPlaying,
    animationInterval,
    inputText,
    bidiSegments,
    animationProgress,
    animatedSegments.length,
    animationSpeed,
    updateAnimatedSegmentsFromBidiSegments,
  ]);

  const resetAnimation = useCallback(() => {
    if (animationInterval) {
      clearInterval(animationInterval);
      setAnimationInterval(null);
    }
    setIsPlaying(false);
    setAnimationProgress(0);
    setAnimatedSegments([]);
  }, [animationInterval]);

  const toggleAnimationSpeed = useCallback(() => {
    // Toggle between fast and slow
    setAnimationSpeed((prev) =>
      prev === ANIMATION_SPEEDS.FAST
        ? ANIMATION_SPEEDS.SLOW
        : ANIMATION_SPEEDS.FAST,
    );

    // Only restart if animation is currently playing
    if (isPlaying) {
      if (animationInterval) {
        clearInterval(animationInterval);
        setAnimationInterval(null);
      }

      // Using setTimeout to ensure state is updated before restarting
      setTimeout(() => {
        startAnimation();
      }, 10);
    }
  }, [isPlaying, animationInterval, startAnimation]);

  const stepForward = useCallback(() => {
    if (animationProgress < inputText.length - 1) {
      const newPosition = animationProgress + 1;
      setAnimationProgress(newPosition);
      updateAnimatedSegmentsFromBidiSegments(newPosition);
    }
  }, [
    animationProgress,
    inputText.length,
    updateAnimatedSegmentsFromBidiSegments,
  ]);

  const stepBackward = useCallback(() => {
    if (animationProgress > 0) {
      const newPosition = animationProgress - 1;
      setAnimationProgress(newPosition);
      updateAnimatedSegmentsFromBidiSegments(newPosition);
    }
  }, [animationProgress, updateAnimatedSegmentsFromBidiSegments]);

  const seekToPosition = useCallback(
    (position: number) => {
      const clampedPosition = Math.max(0, Math.min(position, inputText.length));
      setAnimationProgress(clampedPosition);
      updateAnimatedSegmentsFromBidiSegments(clampedPosition);

      // Initialize segments if needed
      if (animatedSegments.length === 0 && inputText) {
        const initialSegments = Array.from(inputText).map((char, index) => {
          const type = getUbaBidiType(char);
          let direction: DetectedDirection;
          if (type === 'L') direction = 'ltr';
          else if (type === 'R' || type === 'AL') direction = 'rtl';
          else direction = 'neutral';

          return {
            char,
            type,
            direction,
            processed: false,
            groupIndex: -1,
          };
        });
        setAnimatedSegments(initialSegments);
      }
    },
    [
      inputText,
      updateAnimatedSegmentsFromBidiSegments,
      animatedSegments.length,
    ],
  );

  const seekToPercentage = useCallback(
    (percentage: number) => {
      const clampedPercentage = Math.max(0, Math.min(percentage, 100));
      const position = Math.round((inputText.length * clampedPercentage) / 100);
      seekToPosition(position);
    },
    [inputText.length, seekToPosition],
  );

  // Computed values
  const progressPercentage = calculateAnimationProgress(
    animationProgress,
    inputText.length,
  );
  const currentCharacter = animatedSegments[animationProgress]?.char || null;
  const currentType = animatedSegments[animationProgress]?.type || null;
  const isComplete = animationProgress >= inputText.length;
  const canStepForward = animationProgress < inputText.length - 1;
  const canStepBackward = animationProgress > 0;
  const segmentMarkers = useMemo(() => {
    if (!bidiSegments.length || !inputText) return [];

    const markers: Array<{
      position: number;
      segmentIndex: number;
      percentage: number;
    }> = [];
    let charIndex = 0;

    bidiSegments.forEach((segment, segmentIndex) => {
      // Add marker at the start of each segment
      markers.push({
        position: charIndex,
        segmentIndex,
        percentage: calculateAnimationProgress(charIndex, inputText.length),
      });

      // Count characters in this segment
      segment.chunks.forEach((chunk) => {
        charIndex += chunk.text.length;
      });
    });

    return markers;
  }, [bidiSegments, inputText]);

  return {
    // State
    isPlaying,
    animationProgress,
    animatedSegments,
    animationSpeed,

    // Actions
    startAnimation,
    resetAnimation,
    toggleAnimationSpeed,
    stepForward,
    stepBackward,
    seekToPosition,
    seekToPercentage,

    // Computed values
    progressPercentage,
    currentCharacter,
    currentType,
    isComplete,
    canStepForward,
    canStepBackward,
    segmentMarkers,
  };
}

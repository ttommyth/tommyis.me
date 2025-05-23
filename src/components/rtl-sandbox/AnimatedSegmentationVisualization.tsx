import {
  NEUTRAL_UBA_TYPES,
  UBA_TYPE_COLOR_MAP,
  UBA_TYPE_DEFINITIONS,
} from '@/constants/rtl-sandbox/uba-types';
import type { Direction, UbaBidiType } from '@/utils/directionality';
import type { AnimationSegment } from '@/utils/rtl-sandbox/animation-helpers';
import {
  containsMirroredCharacters,
  isMirroredCharacter,
  isUniformlyMirrored,
} from '@/utils/rtl-sandbox/uba-helpers';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface AnimatedSegmentationVisualizationProps {
  inputText: string;
  animatedSegments: AnimationSegment[];
  animationProgress: number;
  isPlaying: boolean;
  effectiveDirection: Exclude<Direction, 'auto'>;
  textContainerRef: React.RefObject<HTMLDivElement>;
}

export function AnimatedSegmentationVisualization({
  inputText,
  animatedSegments,
  animationProgress,
  isPlaying,
  effectiveDirection,
  textContainerRef,
}: AnimatedSegmentationVisualizationProps) {
  const t = useTranslations('RtlSandbox');

  if (!inputText || animatedSegments.length === 0) {
    return (
      <p className="py-4 text-base-600 dark:text-base-400">
        {t('clickPlayToStartAnimation') || 'Click Play to start the animation'}
      </p>
    );
  }

  // Group processed characters by their group index
  const groupedChars: { [key: number]: AnimationSegment[] } = {};

  animatedSegments.forEach((segment) => {
    if (segment.processed && segment.groupIndex !== -1) {
      if (!groupedChars[segment.groupIndex]) {
        groupedChars[segment.groupIndex] = [];
      }
      groupedChars[segment.groupIndex].push(segment);
    }
  });

  // Group adjacent characters of the same type into chunks
  const groupCharsByType = (chars: AnimationSegment[]) => {
    const chunks: Array<{
      text: string;
      originalType: UbaBidiType;
      resolvedType?: UbaBidiType;
      chars: AnimationSegment[];
    }> = [];

    let currentChunk: {
      text: string;
      originalType: UbaBidiType;
      resolvedType?: UbaBidiType;
      chars: AnimationSegment[];
    } | null = null;

    chars.forEach((char) => {
      const charType = char.type as UbaBidiType;
      const charResolvedType = char.resolvedType as UbaBidiType | undefined;

      if (
        !currentChunk ||
        currentChunk.originalType !== charType ||
        currentChunk.resolvedType !== charResolvedType
      ) {
        // Start a new chunk
        if (currentChunk) {
          chunks.push(currentChunk);
        }
        currentChunk = {
          text: char.char,
          originalType: charType,
          resolvedType: charResolvedType,
          chars: [char],
        };
      } else {
        // Add to current chunk
        currentChunk.text += char.char;
        currentChunk.chars.push(char);
      }
    });

    // Add the final chunk
    if (currentChunk) {
      chunks.push(currentChunk);
    }

    return chunks;
  };

  return (
    <div
      dir={effectiveDirection}
      className="p-4 border border-default rounded-md bg-base-200 dark:bg-base-700 min-h-[200px] flex flex-col gap-6"
    >
      {/* Original text with cursor - section heading */}
      <div className="text-sm font-medium text-base-600 dark:text-base-400 flex items-center gap-2">
        <span className="bg-primary-100 dark:bg-primary-900/30 px-2 py-1 rounded-md border border-primary-200 dark:border-primary-800">
          {t('originalTextHeading') || 'Original Text (LTR View)'}
        </span>
        <span className="text-xs">
          {!isPlaying && animationProgress === 0
            ? t('clickPlayToBegin') || 'Click Play to start'
            : t('watchCursorMove') ||
              'Watch cursor move through each character'}
        </span>
      </div>

      {/* Original text with cursor */}
      <div className="relative overflow-y-hidden">
        <div
          ref={textContainerRef}
          dir="ltr" // Always LTR regardless of text content
          className="flex items-center justify-start mb-2 overflow-x-auto  whitespace-nowrap p-4 border border-base-300 dark:border-base-600 rounded-md"
          style={{ maxWidth: '100%', scrollbarWidth: 'thin' }}
        >
          {animatedSegments.map((char, idx) => (
            <motion.div
              key={idx}
              className={`inline-block text-xl px-1 py-1 rounded ${
                idx === animationProgress
                  ? 'border-b-2 border-primary-500 bg-primary-100 dark:bg-primary-900/30'
                  : char.processed
                    ? 'opacity-70'
                    : 'opacity-90'
              }`}
              layout
            >
              {idx === animationProgress && (
                <motion.div
                  className="absolute h-full w-full bg-primary-400/20 dark:bg-primary-700/30 -inset-0 z-0 rounded"
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                />
              )}
              <span className="relative z-10">
                {char.char === ' ' ? (
                  <span className="text-base-400">␣</span>
                ) : (
                  char.char
                )}
              </span>
            </motion.div>
          ))}
          {/* Show a blinking cursor at the end when animation completes */}
          {animationProgress >= inputText.length && (
            <motion.div
              className="inline-block w-0.5 h-6 bg-primary-500 mx-1 self-center"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
            />
          )}
        </div>
      </div>

      {/* Current processing step explanation */}
      {isPlaying && animationProgress < inputText.length && (
        <div className="text-center text-sm bg-base-100 dark:bg-base-800 p-2 rounded-md shadow-sm">
          {(() => {
            const currentChar = animatedSegments[animationProgress]?.char || '';
            const currentType = animatedSegments[animationProgress]?.type || '';
            return (
              <p>
                Processing character{' '}
                <span className="font-mono px-1 py-0.5 bg-base-200 dark:bg-base-700 rounded">
                  {currentChar === ' ' ? '␣' : currentChar}
                </span>{' '}
                which has type{' '}
                <span className="font-semibold">{currentType}</span>
              </p>
            );
          })()}
        </div>
      )}

      {/* Animated Segmentation Visualization - matching ResolvedTypeVisualization design */}
      {Object.keys(groupedChars).length > 0 && (
        <div className="space-y-4">
          <div className="text-sm font-medium text-base-600 dark:text-base-400">
            <span className="bg-secondary-100 dark:bg-secondary-900/30 px-2 py-1 rounded-md border border-secondary-200 dark:border-secondary-800">
              Segmentation Process
            </span>
          </div>
          <div
            dir={effectiveDirection}
            className="p-4 border border-default rounded-md bg-base-200 dark:bg-base-700 min-h-[60px] flex flex-wrap items-start"
          >
            {Object.entries(groupedChars)
              .sort(([a], [b]) => parseInt(a) - parseInt(b))
              .map(([groupIdx, chars]) => {
                // Determine group direction based on strong characters
                const hasLtr = chars.some((char) => {
                  const type = char.resolvedType || char.type;
                  return type === 'L';
                });
                const hasRtl = chars.some((char) => {
                  const type = char.resolvedType || char.type;
                  return type === 'R' || type === 'AL';
                });

                let groupDirection: string = 'neutral';
                if (hasRtl && !hasLtr) {
                  groupDirection = 'rtl';
                } else if (hasLtr && !hasRtl) {
                  groupDirection = 'ltr';
                } else if (hasLtr && hasRtl) {
                  // Mixed - use the first strong character to determine
                  const firstStrong = chars.find((char) => {
                    const type = char.resolvedType || char.type;
                    return type === 'L' || type === 'R' || type === 'AL';
                  });
                  if (firstStrong) {
                    const type = firstStrong.resolvedType || firstStrong.type;
                    groupDirection = type === 'L' ? 'ltr' : 'rtl';
                  }
                }

                const isRtlSegment = groupDirection === 'rtl';
                const isEffectivelyNeutralGroup = chars.every((char) =>
                  NEUTRAL_UBA_TYPES.includes(char.type),
                );

                return (
                  <motion.div
                    key={groupIdx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: parseInt(groupIdx) * 0.2 }}
                    dir={
                      groupDirection === 'neutral' ? undefined : groupDirection
                    }
                    className="inline-flex flex-col items-stretch m-1 p-2 border border-neutral-400 dark:border-neutral-500 rounded shadow-md bg-base-100 dark:bg-base-800"
                  >
                    {/* Characters Row - now using chunked groups */}
                    <div className="flex flex-row flex-wrap justify-center">
                      {groupCharsByType(chars)
                        .filter((chunk) => {
                          // Only show chunks where ALL characters have been processed by the animation cursor
                          const maxCharIndex = Math.max(
                            ...chunk.chars.map((char) =>
                              animatedSegments.findIndex((seg) => seg === char),
                            ),
                          );
                          return maxCharIndex < animationProgress;
                        })
                        .map((chunk, chunkIdx) => {
                          const chunkText = chunk.text;
                          const chunkContainsAnyMirroredChar =
                            containsMirroredCharacters(chunkText);
                          const chunkIsUniformlyMirrored =
                            isUniformlyMirrored(chunkText);

                          let titleText = `Original: ${UBA_TYPE_DEFINITIONS[chunk.originalType] || chunk.originalType}`;
                          if (
                            chunk.resolvedType &&
                            chunk.originalType !== chunk.resolvedType
                          ) {
                            titleText += `\nResolved: ${UBA_TYPE_DEFINITIONS[chunk.resolvedType] || chunk.resolvedType}`;
                          }
                          if (chunkIsUniformlyMirrored && isRtlSegment) {
                            titleText += '\n(Mirrored)';
                          } else if (
                            chunkContainsAnyMirroredChar &&
                            isRtlSegment
                          ) {
                            titleText += '\n(Contains mirrored characters)';
                          }

                          return (
                            <motion.div
                              key={`${groupIdx}-${chunkIdx}`}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: 0.3,
                              }}
                              title={titleText}
                              className={`inline-flex flex-col items-center p-1.5 m-0.5 rounded border text-xs ${
                                UBA_TYPE_COLOR_MAP[chunk.originalType] ||
                                UBA_TYPE_COLOR_MAP.ON
                              } min-w-[2em] min-h-[3.5em] justify-center ${
                                chunkIsUniformlyMirrored && isRtlSegment
                                  ? 'ring-2 ring-orange-500 ring-inset'
                                  : ''
                              }`}
                            >
                              <span className="font-mono text-sm whitespace-pre-wrap">
                                {chunkText
                                  .split('')
                                  .map((char, charInnerIdx) => (
                                    <span
                                      key={charInnerIdx}
                                      className={
                                        isRtlSegment &&
                                        isMirroredCharacter(char)
                                          ? 'font-bold text-orange-600 dark:text-orange-400'
                                          : ''
                                      }
                                    >
                                      {char === ' ' ? '␣' : char}
                                    </span>
                                  ))}
                              </span>
                              <span className="mt-1 opacity-80">
                                {chunk.originalType}
                              </span>
                              {chunk.resolvedType &&
                                chunk.originalType !== chunk.resolvedType && (
                                  <span className="mt-0.5 text-[0.6rem] opacity-60">
                                    {'-> '}
                                    {chunk.resolvedType}
                                  </span>
                                )}
                            </motion.div>
                          );
                        })}
                    </div>
                    {/* Segment Group Label Row */}
                    <div className="mt-2 pt-2 text-center w-full">
                      <span
                        className={(() => {
                          let labelClasses =
                            'inline-block w-full border-t-2 px-2 py-1 text-xs font-semibold';
                          if (
                            (groupDirection === 'ltr' ||
                              groupDirection === 'rtl') &&
                            isEffectivelyNeutralGroup
                          ) {
                            labelClasses +=
                              ' border-slate-500 text-slate-700 dark:text-slate-300';
                          } else if (groupDirection === 'ltr') {
                            labelClasses +=
                              ' border-sky-500 text-sky-700 dark:text-sky-300';
                          } else if (groupDirection === 'rtl') {
                            labelClasses +=
                              ' border-emerald-500 text-emerald-700 dark:text-emerald-300';
                          } else {
                            labelClasses +=
                              ' border-slate-500 text-slate-700 dark:text-slate-300';
                          }
                          return labelClasses;
                        })()}
                      >
                        {(() => {
                          if (
                            (groupDirection === 'ltr' ||
                              groupDirection === 'rtl') &&
                            isEffectivelyNeutralGroup
                          ) {
                            return `GROUP ${groupIdx}`;
                          }
                          return `${groupDirection.toUpperCase()} GROUP ${groupIdx}`;
                        })()}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
          </div>
        </div>
      )}

      {/* Animation progress indicator */}
      <div className="mt-4">
        <div className="w-full bg-base-300 dark:bg-base-600 rounded-full h-2.5">
          <div
            className="bg-primary-500 h-2.5 rounded-full transition-all duration-300"
            style={{
              width: `${inputText ? (animationProgress / inputText.length) * 100 : 0}%`,
            }}
          ></div>
        </div>
        <div className="text-xs text-center mt-1 text-base-500">
          {animationProgress}/{inputText.length} characters processed
        </div>
      </div>
    </div>
  );
}

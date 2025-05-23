import {
  NEUTRAL_UBA_TYPES,
  UBA_TYPE_COLOR_MAP,
  UBA_TYPE_DEFINITIONS,
} from '@/constants/rtl-sandbox/uba-types';
import type { BiDiSegment, Direction } from '@/utils/directionality';
import {
  containsMirroredCharacters,
  isMirroredCharacter,
  isUniformlyMirrored,
} from '@/utils/rtl-sandbox/uba-helpers';
import { useTranslations } from 'next-intl';

interface ResolvedTypeVisualizationProps {
  bidiSegments: BiDiSegment[];
  effectiveDirection: Exclude<Direction, 'auto'>;
}

export function ResolvedTypeVisualization({
  bidiSegments,
  effectiveDirection,
}: ResolvedTypeVisualizationProps) {
  const t = useTranslations('RtlSandbox');

  if (!bidiSegments.length) {
    return (
      <p className="py-4 text-base-600 dark:text-base-400">{t('noSegments')}</p>
    );
  }

  return (
    <div
      dir={effectiveDirection}
      className="p-4 border border-default rounded-md bg-base-200 dark:bg-base-700 min-h-[60px] flex flex-wrap items-start"
    >
      {bidiSegments.map((segment, segIdx) => (
        <div
          key={segIdx}
          dir={segment.direction === 'neutral' ? undefined : segment.direction}
          className="inline-flex flex-col items-stretch m-1 p-2 border border-neutral-400 dark:border-neutral-500 rounded shadow-md bg-base-100 dark:bg-base-800"
        >
          {/* Chunks Row */}
          <div className="flex flex-row flex-wrap justify-center">
            {segment.chunks.map((chunk, chunkIdx) => {
              const isRtlSegment = segment.direction === 'rtl';
              const chunkText = chunk.text;
              const chunkContainsAnyMirroredChar =
                containsMirroredCharacters(chunkText);
              const chunkIsUniformlyMirrored = isUniformlyMirrored(chunkText);

              let titleText = `Original: ${UBA_TYPE_DEFINITIONS[chunk.originalType] || chunk.originalType}`;
              if (
                chunk.resolvedType &&
                chunk.originalType !== chunk.resolvedType
              ) {
                titleText += `\nResolved: ${UBA_TYPE_DEFINITIONS[chunk.resolvedType] || chunk.resolvedType}`;
              }
              if (chunkIsUniformlyMirrored && isRtlSegment) {
                titleText += '\n(Mirrored)';
              } else if (chunkContainsAnyMirroredChar && isRtlSegment) {
                titleText += '\n(Contains mirrored characters)';
              }

              return (
                <div
                  key={`${segIdx}-${chunkIdx}`}
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
                    {chunkText.split('').map((char, charInnerIdx) => (
                      <span
                        key={charInnerIdx}
                        className={
                          isRtlSegment && isMirroredCharacter(char)
                            ? 'font-bold text-orange-600 dark:text-orange-400'
                            : ''
                        }
                      >
                        {char === ' ' ? '␣' : char}
                      </span>
                    ))}
                  </span>
                  <div className="mt-1 flex flex-col items-center text-center">
                    {chunk.resolvedType &&
                    chunk.originalType !== chunk.resolvedType ? (
                      // Show both original and resolved types when they differ
                      <>
                        <span className="text-[0.6rem] opacity-60 line-through">
                          {chunk.originalType}
                        </span>
                        <span className="text-xs font-semibold opacity-90">
                          {chunk.resolvedType}
                        </span>
                        <span className="text-[0.5rem] opacity-50 mt-0.5">
                          resolved
                        </span>
                      </>
                    ) : (
                      // Show just the original type when no resolution occurred
                      <span className="text-xs opacity-80">
                        {chunk.originalType}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {/* Segment Group Label Row */}
          <div className="mt-2 pt-2 text-center w-full">
            <span
              className={(() => {
                const isEffectivelyNeutralGroup = segment.chunks.every(
                  (chunk) => NEUTRAL_UBA_TYPES.includes(chunk.originalType),
                );
                let labelClasses =
                  'inline-block w-full border-t-2 px-2 py-1 text-xs font-semibold';
                if (
                  (segment.direction === 'ltr' ||
                    segment.direction === 'rtl') &&
                  isEffectivelyNeutralGroup
                ) {
                  labelClasses +=
                    ' border-slate-500 text-slate-700 dark:text-slate-300';
                } else if (segment.direction === 'ltr') {
                  labelClasses +=
                    ' border-sky-500 text-sky-700 dark:text-sky-300';
                } else if (segment.direction === 'rtl') {
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
                const isEffectivelyNeutralGroup = segment.chunks.every(
                  (chunk) => NEUTRAL_UBA_TYPES.includes(chunk.originalType),
                );
                if (
                  (segment.direction === 'ltr' ||
                    segment.direction === 'rtl') &&
                  isEffectivelyNeutralGroup
                ) {
                  return `GROUP ${segIdx}`;
                }
                return `${segment.direction.toUpperCase()} GROUP ${segIdx}`;
              })()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

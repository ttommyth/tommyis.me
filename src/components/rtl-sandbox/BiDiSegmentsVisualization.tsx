import { WEAK_DIRECTION_TYPES } from '@/constants/rtl-sandbox/uba-types';
import type { BiDiSegment, Direction } from '@/utils/directionality';
import { useTranslations } from 'next-intl';

interface BiDiSegmentsVisualizationProps {
  bidiSegments: BiDiSegment[];
  effectiveDirection: Exclude<Direction, 'auto'>;
  showWeakUnderlines: boolean;
}

export function BiDiSegmentsVisualization({
  bidiSegments,
  effectiveDirection,
  showWeakUnderlines,
}: BiDiSegmentsVisualizationProps) {
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
      {bidiSegments.map((segment, i) => (
        <div
          key={i}
          className={`relative group inline-flex flex-col items-center p-1 mx-0.5 my-1 rounded transition-all duration-300 ease-in-out 
                      ${
                        segment.direction === 'ltr'
                          ? 'bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-700'
                          : ''
                      }
                      ${
                        segment.direction === 'rtl'
                          ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                          : ''
                      }
                      ${
                        segment.direction === 'neutral'
                          ? 'text-base-600 dark:text-base-400 bg-base-300 dark:bg-base-600 border-default'
                          : ''
                      }
                      hover:shadow-lg hover:scale-105 min-h-[3em] justify-center`}
        >
          <span className="absolute -top-5 text-xs bg-black text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
            {t('segmentTooltip', {
              index: i,
              direction: segment.direction.toUpperCase(),
            })}
          </span>
          {/* Render chunks within the segment */}
          <span className="px-1 py-0.5 text-center whitespace-pre-wrap">
            {segment.chunks.map((chunk, chunkIndex) => (
              <span
                key={chunkIndex}
                className={
                  showWeakUnderlines &&
                  WEAK_DIRECTION_TYPES.includes(chunk.originalType)
                    ? 'underline decoration-solid decoration-current decoration-1 underline-offset-2'
                    : ''
                }
              >
                {chunk.text}
              </span>
            ))}
          </span>
          {segment.direction !== 'neutral' && (
            <span className="text-xs mt-0.5 opacity-75">
              {segment.direction === 'ltr' ? '➡️' : '⬅️'}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

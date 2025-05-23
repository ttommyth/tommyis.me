import type { Direction, FirstStrongCharInfo } from '@/utils/directionality';
import { useTranslations } from 'next-intl';

interface FirstStrongVisualizationProps {
  detectedFirstStrongInfo: FirstStrongCharInfo | null;
  inputText: string;
  effectiveDirection: Exclude<Direction, 'auto'>;
}

export function FirstStrongVisualization({
  detectedFirstStrongInfo,
  inputText,
  effectiveDirection,
}: FirstStrongVisualizationProps) {
  const t = useTranslations('RtlSandbox');

  if (!detectedFirstStrongInfo || !inputText) {
    return (
      <p className="py-4 text-base-600 dark:text-base-400">
        {t('enterTextToAnalyze')}
      </p>
    );
  }

  const { char, index, direction } = detectedFirstStrongInfo;

  if (direction === 'neutral' || index === null) {
    return (
      <p className="py-4 text-base-600 dark:text-base-400">
        {t('noStrongCharFound')}
      </p>
    );
  }

  return (
    <div
      dir={effectiveDirection}
      className="whitespace-pre-wrap font-mono text-lg p-3 bg-base-200 dark:bg-base-700 rounded text-base-800 dark:text-base-200"
    >
      {inputText.substring(0, index)}
      <span className="bg-yellow-300 text-black px-1 rounded relative">
        {char}
        <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs bg-black text-white px-2 py-1 rounded whitespace-nowrap">
          {t('firstStrongLabel')} ({direction.toUpperCase()})
        </span>
      </span>
      {inputText.substring(index + 1)}
      <p className="mt-3 text-sm text-base-700 dark:text-base-300">
        {t('detectedDirection')}:{' '}
        <span className="font-semibold">{direction.toUpperCase()}</span>{' '}
        {t('basedOnChar', { charVal: char || ' ', indexVal: index })}
      </p>
    </div>
  );
}

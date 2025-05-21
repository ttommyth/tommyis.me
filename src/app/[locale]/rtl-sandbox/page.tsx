'use client';

import { useEffect, useState } from 'react';
// import { getTranslations } from 'next-intl/server'; // Will use useTranslations for client component
import {
  analyzeBiDiSegments,
  detectFirstStrongDirection,
  type BiDiSegment,
  type Direction,
  type FirstStrongCharInfo,
  type UbaBidiType, // Import UbaBidiType
} from '@/utils/directionality';
import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
  ArrowsRightLeftIcon,
} from '@heroicons/react/24/outline'; // Assuming Heroicons are available
import { useLocale, useTranslations } from 'next-intl';

// Placeholder for direction detection utilities
// We will create this file next: src/utils/directionality.ts
// import { detectFirstStrongDirection, analyzeBiDiSegments } from '@/utils/directionality';

export default function RtlSandboxPage() {
  const t = useTranslations('RtlSandbox'); // Assuming you'll add 'RtlSandbox' to your i18n files
  const locale = useLocale(); // Get current locale

  const UBA_TYPE_DEFINITIONS: Readonly<Record<UbaBidiType, string>> = {
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

  const [inputText, setInputText] = useState<string>(
    'Hello عالم 123 !مرحبا Check English.',
  );
  const [overallDirection, setOverallDirection] = useState<Direction>('auto'); // Default to auto
  const [detectedFirstStrongInfo, setDetectedFirstStrongInfo] =
    useState<FirstStrongCharInfo | null>(null);
  const [bidiSegments, setBidiSegments] = useState<BiDiSegment[]>([]);
  const [showWeakUnderlines, setShowWeakUnderlines] = useState<boolean>(true);

  useEffect(() => {
    if (inputText) {
      const firstStrongInfo = detectFirstStrongDirection(inputText);
      setDetectedFirstStrongInfo(firstStrongInfo);

      const segments = analyzeBiDiSegments(
        inputText,
        overallDirection, // This is passed to analyzeBiDiSegments but currently not used by it to determine segment types
        locale,
      );
      setBidiSegments(segments);
    } else {
      setDetectedFirstStrongInfo(null);
      setBidiSegments([]);
    }
  }, [inputText, overallDirection, locale]);

  const handleDirectionChange = (dir: Direction) => {
    setOverallDirection(dir);
  };

  // Determine the effective direction for the visualization containers
  let effectiveDirForVisualizations: Exclude<Direction, 'auto'> = 'ltr';
  if (overallDirection === 'ltr' || overallDirection === 'rtl') {
    effectiveDirForVisualizations = overallDirection;
  } else {
    // overallDirection is 'auto'
    if (
      detectedFirstStrongInfo?.direction === 'ltr' ||
      detectedFirstStrongInfo?.direction === 'rtl'
    ) {
      effectiveDirForVisualizations = detectedFirstStrongInfo.direction;
    } else {
      // Default to LTR if 'auto' and no strong direction detected in input, or input is neutral
      effectiveDirForVisualizations = 'ltr';
    }
  }

  const directionControls = [
    { dir: 'ltr' as Direction, label: 'LTR', Icon: ArrowLongRightIcon },
    { dir: 'rtl' as Direction, label: 'RTL', Icon: ArrowLongLeftIcon },
    { dir: 'auto' as Direction, label: 'Auto', Icon: ArrowsRightLeftIcon },
  ];

  const predefinedInputs = [
    {
      labelKey: 'loadRtlFirst',
      value: 'مرحبا LTR text 123 !؟', // RTL word, LTR phrase, numbers, RTL punctuation
    },
    {
      labelKey: 'loadLtrFirst',
      value: 'Hello RTL نص 456 ؟!', // LTR word, RTL phrase, numbers, RTL punctuation then LTR punctuation
    },
    {
      labelKey: 'loadNeutralFirst',
      value: '12345 LTR نص RTL', // Neutral (numbers), LTR phrase, RTL phrase
    },
    {
      labelKey: 'loadMixedComplex',
      value:
        'The title is "كتاب العبر", by Ibn Khaldun (ابن خلدون). Price: $25.50.', // More complex mixed string
    },
    {
      labelKey: 'exampleMixedComplexRtlFirst', // New label key
      value:
        '"كتاب العبر", by <1>Ibn Khaldun</1> (((((ابن خلدون). Price: $25.50.', // New example string
    },
  ];

  const renderFirstStrongVisualization = () => {
    if (!detectedFirstStrongInfo || !inputText)
      return (
        <p className="py-4 text-base-600 dark:text-base-400">
          {t('enterTextToAnalyze')}
        </p>
      );

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
        dir={effectiveDirForVisualizations}
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
  };

  const renderBiDiSegmentsVisualization = () => {
    if (!bidiSegments.length)
      return (
        <p className="py-4 text-base-600 dark:text-base-400">
          {t('noSegments')}
        </p>
      );

    const weakTypesForUnderline: ReadonlyArray<string> = [
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

    return (
      <div
        dir={effectiveDirForVisualizations}
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
                // Optional: could also show original types of chunks in tooltip if complex
              })}
            </span>
            {/* Render chunks within the segment */}
            <span className="px-1 py-0.5 text-center whitespace-pre-wrap">
              {segment.chunks.map((chunk, chunkIndex) => (
                <span
                  key={chunkIndex}
                  className={
                    showWeakUnderlines &&
                    weakTypesForUnderline.includes(chunk.originalType)
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
  };

  const renderResolvedTypeVisualization = () => {
    if (!bidiSegments.length) {
      return (
        <p className="py-4 text-base-600 dark:text-base-400">
          {t('noSegments')}
        </p>
      );
    }

    const typeToColorMap: Record<UbaBidiType, string> = {
      L: 'bg-sky-200 dark:bg-sky-800 text-sky-800 dark:text-sky-200 border-sky-400 dark:border-sky-600',
      R: 'bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 border-emerald-400 dark:border-emerald-600',
      AL: 'bg-teal-200 dark:bg-teal-800 text-teal-800 dark:text-teal-200 border-teal-400 dark:border-teal-600',
      EN: 'bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 border-amber-400 dark:border-amber-600',
      AN: 'bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 border-yellow-400 dark:border-yellow-600',
      ES: 'bg-rose-200 dark:bg-rose-800 text-rose-800 dark:text-rose-200 border-rose-400 dark:border-rose-600', // European Separator
      ET: 'bg-pink-200 dark:bg-pink-800 text-pink-800 dark:text-pink-200 border-pink-400 dark:border-pink-600', // European Terminator
      CS: 'bg-fuchsia-200 dark:bg-fuchsia-800 text-fuchsia-800 dark:text-fuchsia-200 border-fuchsia-400 dark:border-fuchsia-600', // Common Separator
      NSM: 'bg-indigo-200 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200 border-indigo-400 dark:border-indigo-600', // Non-Spacing Mark
      BN: 'bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 border-purple-400 dark:border-purple-600', // Boundary Neutral
      B: 'bg-gray-400 dark:bg-gray-600 text-gray-800 dark:text-gray-200 border-gray-500', // Paragraph Separator
      S: 'bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-400', // Segment Separator
      WS: 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-400 dark:border-slate-500', // Whitespace
      ON: 'bg-stone-300 dark:bg-stone-600 text-stone-800 dark:text-stone-200 border-stone-400 dark:border-stone-500', // Other Neutral
    };

    const mirroredChars = ['(', ')', '[', ']', '{', '}', '<', '>'];
    const neutralTypes: UbaBidiType[] = [
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

    return (
      <div
        dir={effectiveDirForVisualizations} // Segments within will respect their LTR/RTL nature
        className="p-4 border border-default rounded-md bg-base-200 dark:bg-base-700 min-h-[60px] flex flex-wrap items-start"
      >
        {bidiSegments.map((segment, segIdx) => (
          <div
            key={segIdx}
            dir={
              segment.direction === 'neutral' ? undefined : segment.direction
            } // Force direction for LTR/RTL groups
            className="inline-flex flex-col items-stretch m-1 p-2 border border-neutral-400 dark:border-neutral-500 rounded shadow-md bg-base-100 dark:bg-base-800"
          >
            {/* Chunks Row */}
            <div className="flex flex-row flex-wrap justify-center">
              {segment.chunks.map((chunk, chunkIdx) => {
                const isRtlSegment = segment.direction === 'rtl';
                const chunkText = chunk.text;
                let chunkContainsAnyMirroredChar = false;
                let chunkIsUniformlyMirrored = false;

                if (isRtlSegment && chunkText.length > 0) {
                  // Check for any mirrored char
                  for (const char of chunkText) {
                    if (mirroredChars.includes(char)) {
                      chunkContainsAnyMirroredChar = true;
                      break;
                    }
                  }

                  // Check for uniformly mirrored
                  if (chunkContainsAnyMirroredChar) {
                    // Optimization: only proceed if there's at least one
                    const firstChar = chunkText[0];
                    if (mirroredChars.includes(firstChar)) {
                      let allSameAndMirrored = true;
                      for (let k = 0; k < chunkText.length; k++) {
                        if (chunkText[k] !== firstChar) {
                          allSameAndMirrored = false;
                          break;
                        }
                      }
                      if (allSameAndMirrored) {
                        chunkIsUniformlyMirrored = true;
                      }
                    }
                  }
                }

                let titleText = `Original: ${UBA_TYPE_DEFINITIONS[chunk.originalType] || chunk.originalType}`;
                if (
                  chunk.resolvedType &&
                  chunk.originalType !== chunk.resolvedType
                ) {
                  titleText += `\\nResolved: ${UBA_TYPE_DEFINITIONS[chunk.resolvedType] || chunk.resolvedType}`;
                }
                if (chunkIsUniformlyMirrored) {
                  titleText += '\\n(Mirrored)';
                } else if (chunkContainsAnyMirroredChar) {
                  titleText += '\\n(Contains mirrored characters)';
                }

                return (
                  <div
                    key={`${segIdx}-${chunkIdx}`}
                    title={titleText}
                    className={`inline-flex flex-col items-center p-1.5 m-0.5 rounded border text-xs ${
                      typeToColorMap[chunk.originalType] || typeToColorMap.ON // Fallback to ON color
                    } min-w-[2em] min-h-[3.5em] justify-center ${
                      chunkIsUniformlyMirrored
                        ? 'ring-2 ring-orange-500 ring-inset'
                        : ''
                    }`}
                  >
                    <span className="font-mono text-sm whitespace-pre-wrap">
                      {chunkIsUniformlyMirrored || !chunkContainsAnyMirroredChar
                        ? chunkText === ' '
                          ? "' '"
                          : chunkText
                        : chunkText.split('').map((char, charInnerIdx) => (
                            <span
                              key={charInnerIdx}
                              className={
                                isRtlSegment && mirroredChars.includes(char)
                                  ? 'font-bold text-orange-600 dark:text-orange-400'
                                  : ''
                              }
                            >
                              {char === ' ' ? "' '" : char}
                            </span>
                          ))}{' '}
                      {/* Make space visible / keep existing space logic */}
                    </span>
                    <span className="mt-1 opacity-80">
                      {chunk.originalType}
                    </span>
                    {/* Display resolved type if different from original and for clarity */}
                    {chunk.resolvedType &&
                      chunk.originalType !== chunk.resolvedType && (
                        <span className="mt-0.5 text-[0.6rem] opacity-60">
                          {'-> '}
                          {chunk.resolvedType}
                        </span>
                      )}
                  </div>
                );
              })}
            </div>
            {/* Segment Group Label Row */}
            <div className="mt-2 pt-2 text-center w-full">
              <span
                className={(() => {
                  const isEffectivelyNeutralGroup = segment.chunks.every(
                    (chunk) => neutralTypes.includes(chunk.originalType),
                  );
                  let labelClasses =
                    'inline-block w-full border-t-2 px-2 py-1 text-xs font-semibold';
                  if (
                    (segment.direction === 'ltr' ||
                      segment.direction === 'rtl') &&
                    isEffectivelyNeutralGroup
                  ) {
                    labelClasses +=
                      ' border-slate-500 text-slate-700 dark:text-slate-300'; // Style as neutral
                  } else if (segment.direction === 'ltr') {
                    labelClasses +=
                      ' border-sky-500 text-sky-700 dark:text-sky-300';
                  } else if (segment.direction === 'rtl') {
                    labelClasses +=
                      ' border-emerald-500 text-emerald-700 dark:text-emerald-300';
                  } else {
                    // neutral
                    labelClasses +=
                      ' border-slate-500 text-slate-700 dark:text-slate-300';
                  }
                  return labelClasses;
                })()}
              >
                {(() => {
                  const isEffectivelyNeutralGroup = segment.chunks.every(
                    (chunk) => neutralTypes.includes(chunk.originalType),
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
  };

  return (
    <div className="container mx-auto px-4 pt-20 flex flex-col gap-6 font-sans">
      <header className="mb-4 text-center">
        <h1 className="text-4xl font-bold">{t('title')}</h1>
        <p className="text-lg text-base-600 dark:text-base-400 mt-2">
          {t('description')}
        </p>
      </header>

      {/* Input Section with Integrated Controls */}
      <section className="py-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">{t('inputSectionTitle')}</h2>
          <div className="flex gap-2">
            {directionControls.map(({ dir, label, Icon }) => (
              <button
                key={dir}
                onClick={() => handleDirectionChange(dir)}
                title={t('setDirectionTooltip', { direction: label })}
                className={`p-2 rounded-md transition-all duration-200 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 
                            ${
                              overallDirection === dir
                                ? 'bg-primary-500 text-base-100 shadow-md focus:ring-primary-500'
                                : 'bg-base-200 dark:bg-base-700 text-base-700 dark:text-base-300 hover:bg-base-300 dark:hover:bg-base-600 focus:ring-base-400'
                            }`}
              >
                <Icon className="h-5 w-5" />
                <span className="sr-only">{label}</span>
              </button>
            ))}
          </div>
        </div>
        <textarea
          className="w-full p-3 bg-default border-2 border-default rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 min-h-[100px] text-lg resize-y dark:text-white"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={t('inputPlaceholder')}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <p className="text-sm text-base-600 dark:text-base-400 mr-2 self-center">
            {t('loadExamplesLabel')}:
          </p>
          {predefinedInputs.map((item) => (
            <button
              key={item.labelKey}
              onClick={() => setInputText(item.value)}
              className="px-3 py-1.5 text-xs bg-base-200 dark:bg-base-700 text-base-700 dark:text-base-300 hover:bg-base-300 dark:hover:bg-base-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
              title={t(item.labelKey as any)} // Using 'as any' to bypass strict t key checking for dynamic keys if needed
            >
              {t(item.labelKey as any)}
            </button>
          ))}
        </div>
      </section>

      {/* Display Section */}
      <section className="py-4">
        <h2 className="text-2xl font-semibold mb-4">
          {t('displaySectionTitle')}
        </h2>
        <div
          dir={overallDirection}
          className="p-4 border-2 border-dashed border-default rounded-md bg-base-200 dark:bg-base-700 min-h-[100px] text-xl whitespace-pre-wrap overflow-x-auto"
          aria-label={t('stringDisplayArea')}
        >
          {inputText}
        </div>
      </section>

      {/* First Strong Character Detection Section */}
      <section className="py-4">
        <h2 className="text-2xl font-semibold mb-4">{t('firstStrongTitle')}</h2>
        {renderFirstStrongVisualization()}
      </section>

      {/* BiDi Segmentation Visualization Section */}
      <section className="py-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">{t('bidiSegmentsTitle')}</h2>
          <button
            onClick={() => setShowWeakUnderlines(!showWeakUnderlines)}
            className="px-3 py-1 text-sm bg-primary-500 hover:bg-primary-600 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            {showWeakUnderlines
              ? t('hideWeakUnderlines')
              : t('showWeakUnderlines')}
          </button>
        </div>
        {renderBiDiSegmentsVisualization()}
        <p className="mt-3 text-sm text-base-500 dark:text-base-400 italic">
          ({t('bidiNote')})
        </p>
      </section>

      {/* Resolved UBA Type Visualization Section */}
      <section className="py-4">
        <h2 className="text-2xl font-semibold mb-4">
          {t('resolvedTypesTitle')}
        </h2>
        {renderResolvedTypeVisualization()}
        <p className="mt-3 text-sm text-base-500 dark:text-base-400 italic">
          ({t('resolvedTypesNote')})
        </p>
      </section>
    </div>
  );
}

// Basic type for Next.js App Directory props if needed elsewhere, not strictly for this page currently
// interface NextAppDirectoryProps {
//   params: { locale: string; [key: string]: string };
//   searchParams?: { [key: string]: string | string[] | undefined };
// }

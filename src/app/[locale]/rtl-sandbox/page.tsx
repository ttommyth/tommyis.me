'use client';

import { type Direction } from '@/utils/directionality';
import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
  ArrowsRightLeftIcon,
} from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

// Import constants and utilities
import {
  EXAMPLE_TEXTS,
  UBA_TYPE_DEFINITIONS,
} from '@/constants/rtl-sandbox/uba-types';

// Import custom hooks
import { useAnimation } from '@/hooks/rtl-sandbox/useAnimation';
import { useBiDiAnalysis } from '@/hooks/rtl-sandbox/useBiDiAnalysis';

// Import visualization components
import { AnimatedSegmentationVisualization } from '@/components/rtl-sandbox/AnimatedSegmentationVisualization';
import { AnimationVideoControls } from '@/components/rtl-sandbox/AnimationVideoControls';
import { BiDiSegmentsVisualization } from '@/components/rtl-sandbox/BiDiSegmentsVisualization';
import { FirstStrongVisualization } from '@/components/rtl-sandbox/FirstStrongVisualization';
import { ResolvedTypeVisualization } from '@/components/rtl-sandbox/ResolvedTypeVisualization';

export default function RtlSandboxPage() {
  const t = useTranslations('RtlSandbox');
  const locale = useLocale();

  // Ref for text cursor scrolling
  const textContainerRef = useRef<HTMLDivElement>(null);

  // Main state
  const [inputText, setInputText] = useState<string>(
    EXAMPLE_TEXTS[4].value, // Use the complex RTL-first example as default
  );
  const [overallDirection, setOverallDirection] = useState<Direction>('auto');
  const [showWeakUnderlines, setShowWeakUnderlines] = useState<boolean>(true);
  const [definitionsExpanded, setDefinitionsExpanded] = useState(false);

  // Custom hooks
  const bidiAnalysis = useBiDiAnalysis({
    inputText,
    overallDirection,
    locale,
  });

  const animation = useAnimation({
    inputText,
    bidiSegments: bidiAnalysis.bidiSegments,
  });

  // Effect to scroll the text container to follow the cursor
  useEffect(() => {
    if (textContainerRef.current && animation.animatedSegments.length > 0) {
      // Get the current cursor position element
      const cursorElement = textContainerRef.current.children[
        animation.animationProgress
      ] as HTMLElement;

      if (cursorElement) {
        // Calculate the scroll position to center the cursor in view
        const containerWidth = textContainerRef.current.clientWidth;
        const cursorLeft = cursorElement.offsetLeft;
        const cursorWidth = cursorElement.clientWidth;

        // Center the cursor in the view when possible
        const scrollPosition = Math.max(
          0,
          cursorLeft - containerWidth / 2 + cursorWidth / 2,
        );

        // Use smooth scrolling except for the initial positioning or reset
        const behavior =
          animation.animationProgress === 0 || !animation.isPlaying
            ? 'auto'
            : 'smooth';

        textContainerRef.current.scrollTo({
          left: scrollPosition,
          behavior,
        });
      } else if (
        animation.animationProgress >= inputText.length &&
        textContainerRef.current.children.length > 0
      ) {
        // If animation is complete, scroll to show the end cursor
        const lastElement = textContainerRef.current.children[
          textContainerRef.current.children.length - 1
        ] as HTMLElement;
        const containerWidth = textContainerRef.current.clientWidth;
        const lastElementLeft = lastElement.offsetLeft;

        textContainerRef.current.scrollTo({
          left: Math.max(0, lastElementLeft - containerWidth / 2 + 10),
          behavior: 'smooth',
        });
      }
    }
  }, [
    animation.animationProgress,
    animation.animatedSegments.length,
    animation.isPlaying,
    inputText,
  ]);

  // Reset the scroll position when animation is reset
  useEffect(() => {
    if (textContainerRef.current && animation.animationProgress === 0) {
      textContainerRef.current.scrollTo({
        left: 0,
        behavior: 'auto',
      });
    }
  }, [animation.animationProgress]);

  const handleDirectionChange = (dir: Direction) => {
    setOverallDirection(dir);
  };

  const directionControls = [
    { dir: 'ltr' as Direction, label: 'LTR', Icon: ArrowLongRightIcon },
    { dir: 'rtl' as Direction, label: 'RTL', Icon: ArrowLongLeftIcon },
    { dir: 'auto' as Direction, label: 'Auto', Icon: ArrowsRightLeftIcon },
  ];

  return (
    <div className="container mx-auto pt-20 flex flex-col gap-6 font-sans">
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
          {EXAMPLE_TEXTS.map((item) => (
            <button
              key={item.labelKey}
              onClick={() => setInputText(item.value)}
              className="px-3 py-1.5 text-xs bg-base-200 dark:bg-base-700 text-base-700 dark:text-base-300 hover:bg-base-300 dark:hover:bg-base-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
              title={t(item.labelKey as any)}
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
        <FirstStrongVisualization
          detectedFirstStrongInfo={bidiAnalysis.detectedFirstStrongInfo}
          inputText={inputText}
          effectiveDirection={bidiAnalysis.effectiveDirForVisualizations}
        />
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
        <BiDiSegmentsVisualization
          bidiSegments={bidiAnalysis.bidiSegments}
          effectiveDirection={bidiAnalysis.effectiveDirForVisualizations}
          showWeakUnderlines={showWeakUnderlines}
        />
        <p className="mt-3 text-sm text-base-500 dark:text-base-400 italic">
          ({t('bidiNote')})
        </p>
      </section>

      {/* Resolved UBA Type Visualization Section */}
      <section className="py-4">
        <h2 className="text-2xl font-semibold mb-4">
          {t('resolvedTypesTitle')}
        </h2>
        <ResolvedTypeVisualization
          bidiSegments={bidiAnalysis.bidiSegments}
          effectiveDirection={bidiAnalysis.effectiveDirForVisualizations}
        />
        <p className="mt-3 text-sm text-base-500 dark:text-base-400 italic">
          ({t('resolvedTypesNote')})
        </p>
      </section>

      {/* Animated Segmentation Process Section */}
      <section className="py-4">
        <h2 className="text-2xl font-semibold mb-4">
          {t('animatedSegmentationTitle')}
        </h2>

        {/* Video-like Animation Controls */}
        <AnimationVideoControls
          isPlaying={animation.isPlaying}
          animationProgress={animation.animationProgress}
          animationSpeed={animation.animationSpeed}
          progressPercentage={animation.progressPercentage}
          currentCharacter={animation.currentCharacter}
          currentType={animation.currentType}
          isComplete={animation.isComplete}
          canStepForward={animation.canStepForward}
          canStepBackward={animation.canStepBackward}
          segmentMarkers={animation.segmentMarkers}
          totalLength={inputText.length}
          startAnimation={animation.startAnimation}
          resetAnimation={animation.resetAnimation}
          toggleAnimationSpeed={animation.toggleAnimationSpeed}
          stepForward={animation.stepForward}
          stepBackward={animation.stepBackward}
          seekToPosition={animation.seekToPosition}
          seekToPercentage={animation.seekToPercentage}
        />

        <AnimatedSegmentationVisualization
          inputText={inputText}
          animatedSegments={animation.animatedSegments}
          animationProgress={animation.animationProgress}
          isPlaying={animation.isPlaying}
          effectiveDirection={bidiAnalysis.effectiveDirForVisualizations}
          textContainerRef={textContainerRef}
        />
        <p className="mt-3 text-sm text-base-500 dark:text-base-400 italic">
          ({t('animationNote')})
        </p>
      </section>

      {/* UBA Type Definitions Section */}
      <section className="py-4">
        <motion.header
          initial={false}
          onClick={() => setDefinitionsExpanded(!definitionsExpanded)}
          className="flex items-center justify-between cursor-pointer p-3 bg-base-200 dark:bg-base-700 hover:bg-base-300 dark:hover:bg-base-600 rounded-md shadow transition-colors"
          aria-expanded={definitionsExpanded}
        >
          <h2 className="text-xl font-semibold">
            {t('ubaTypeDefinitionsTitle')}
          </h2>
          <motion.div
            animate={{ rotate: definitionsExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDownIcon className="w-6 h-6 text-base-700 dark:text-base-300" />
          </motion.div>
        </motion.header>
        <AnimatePresence initial={false}>
          {definitionsExpanded && (
            <motion.section
              key="definitions-content"
              initial="collapsed"
              animate="open"
              exit="collapsed"
              variants={{
                open: { opacity: 1, height: 'auto', marginTop: '1rem' },
                collapsed: { opacity: 0, height: 0, marginTop: '0rem' },
              }}
              transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
              className="overflow-hidden"
            >
              <div className="p-4 border border-t-0 border-default rounded-b-md bg-base-100 dark:bg-base-800">
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  {Object.entries(UBA_TYPE_DEFINITIONS).map(
                    ([type, description]) => (
                      <div key={type} className="break-inside-avoid">
                        <dt className="font-semibold text-primary-600 dark:text-primary-400">
                          {type}
                        </dt>
                        <dd className="text-sm text-base-700 dark:text-base-300">
                          {description}
                        </dd>
                      </div>
                    ),
                  )}
                </dl>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </section>
      <div className="mt-8">
        <p>
          <Link href="/tools" className="text-accent hover:underline">
            Back to Tools
          </Link>
        </p>
      </div>
    </div>
  );
}

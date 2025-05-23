import { ANIMATION_SPEEDS } from '@/constants/rtl-sandbox/uba-types';
import {
  ArrowUturnLeftIcon,
  BackwardIcon,
  ForwardIcon,
  PauseIcon,
  PlayIcon,
} from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import React, { useCallback, useRef, useState } from 'react';

interface SegmentMarker {
  position: number;
  segmentIndex: number;
  percentage: number;
}

interface AnimationVideoControlsProps {
  // Animation state
  isPlaying: boolean;
  animationProgress: number;
  animationSpeed: number;
  progressPercentage: number;
  currentCharacter: string | null;
  currentType: string | null;
  isComplete: boolean;
  canStepForward: boolean;
  canStepBackward: boolean;
  segmentMarkers: SegmentMarker[];
  totalLength: number;

  // Animation controls
  startAnimation: () => void;
  resetAnimation: () => void;
  toggleAnimationSpeed: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  seekToPosition: (position: number) => void;
  seekToPercentage: (percentage: number) => void;
}

export function AnimationVideoControls({
  isPlaying,
  animationProgress,
  animationSpeed,
  progressPercentage,
  currentCharacter,
  currentType,
  isComplete,
  canStepForward,
  canStepBackward,
  segmentMarkers,
  totalLength,
  startAnimation,
  resetAnimation,
  toggleAnimationSpeed,
  stepForward,
  stepBackward,
  seekToPosition,
  seekToPercentage,
}: AnimationVideoControlsProps) {
  const t = useTranslations('RtlSandbox');
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleProgressBarClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!progressBarRef.current) return;

      const rect = progressBarRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const percentage = (x / rect.width) * 100;
      seekToPercentage(Math.max(0, Math.min(100, percentage)));
    },
    [seekToPercentage],
  );

  const handleProgressBarMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      setIsDragging(true);
      handleProgressBarClick(event);
    },
    [handleProgressBarClick],
  );

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!isDragging || !progressBarRef.current) return;

      const rect = progressBarRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const percentage = (x / rect.width) * 100;
      seekToPercentage(Math.max(0, Math.min(100, percentage)));
    },
    [isDragging, seekToPercentage],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Handle mouse events for dragging
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div className="space-y-4">
      {/* Main Controls Row */}
      <div className="flex items-center gap-2">
        {/* Play/Pause Button */}
        <button
          onClick={startAnimation}
          className="flex items-center justify-center w-12 h-12 bg-primary-500 hover:bg-primary-600 text-white rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          title={isPlaying ? t('pauseAnimation') : t('playAnimation')}
        >
          {isPlaying ? (
            <PauseIcon className="h-6 w-6" />
          ) : (
            <PlayIcon className="h-6 w-6 ml-0.5" />
          )}
        </button>

        {/* Step Backward */}
        <button
          onClick={stepBackward}
          disabled={!canStepBackward}
          className="flex items-center justify-center w-10 h-10 bg-base-200 dark:bg-base-700 hover:bg-base-300 dark:hover:bg-base-600 text-base-700 dark:text-base-300 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-base-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          title={t('stepBackward')}
        >
          <BackwardIcon className="h-5 w-5" />
        </button>

        {/* Step Forward */}
        <button
          onClick={stepForward}
          disabled={!canStepForward}
          className="flex items-center justify-center w-10 h-10 bg-base-200 dark:bg-base-700 hover:bg-base-300 dark:hover:bg-base-600 text-base-700 dark:text-base-300 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-base-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          title={t('stepForward')}
        >
          <ForwardIcon className="h-5 w-5" />
        </button>

        {/* Reset Button */}
        <button
          onClick={resetAnimation}
          className="flex items-center justify-center w-10 h-10 bg-base-200 dark:bg-base-700 hover:bg-base-300 dark:hover:bg-base-600 text-base-700 dark:text-base-300 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-base-400 focus:ring-offset-2"
          title={t('resetAnimation')}
        >
          <ArrowUturnLeftIcon className="h-5 w-5" />
        </button>

        {/* Speed Toggle */}
        <button
          onClick={toggleAnimationSpeed}
          className="px-3 py-2 text-sm bg-base-200 dark:bg-base-700 hover:bg-base-300 dark:hover:bg-base-600 text-base-700 dark:text-base-300 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-base-400 focus:ring-offset-2"
        >
          {animationSpeed === ANIMATION_SPEEDS.FAST
            ? t('speedFast')
            : t('speedSlow')}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-base-600 dark:text-base-400 select-none">
          <span>{t('progressBarLabel')}</span>
          <span>
            {t('currentPosition', {
              current: animationProgress,
              total: totalLength,
            })}
          </span>
        </div>

        <div
          ref={progressBarRef}
          className="relative h-6 bg-base-200 dark:bg-base-700 rounded-lg cursor-pointer overflow-hidden select-none"
          onMouseDown={handleProgressBarMouseDown}
          title={t('scrubTooltip')}
        >
          {/* Progress Fill */}
          <div
            className="absolute top-0 left-0 h-full bg-primary-500 transition-all duration-75 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />

          {/* Segment Markers */}
          {segmentMarkers.map((marker) => (
            <div
              key={marker.segmentIndex}
              className="absolute top-0 w-0.5 h-full bg-accent-400 dark:bg-accent-500"
              style={{ left: `${marker.percentage}%` }}
              title={t('segmentMarker', { index: marker.segmentIndex })}
            />
          ))}

          {/* Character Position Ticks */}
          {Array.from({ length: totalLength + 1 }, (_, i) => {
            const percentage = (i / totalLength) * 100;
            return (
              <div
                key={i}
                className="absolute top-0 w-px h-2 bg-base-400 dark:bg-base-500 opacity-50"
                style={{ left: `${percentage}%` }}
              />
            );
          })}

          {/* Current Position Indicator */}
          <div
            className="absolute top-0 w-1 h-full bg-white dark:bg-base-100 shadow-md rounded-sm"
            style={{
              left: `${progressPercentage}%`,
              transform: 'translateX(-50%)',
            }}
          />
        </div>
      </div>

      {/* Current Character Info */}
      {currentCharacter && (
        <div className="flex items-center gap-4 text-sm text-base-600 dark:text-base-400 select-none">
          <span>
            {t('currentCharacter', {
              character: currentCharacter === ' ' ? '␣' : currentCharacter,
            })}
          </span>
          <span className="font-semibold">{currentType}</span>
        </div>
      )}
    </div>
  );
}

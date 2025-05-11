'use client';

import React from 'react';
import ColorSlider from './ColorSlider'; // Corrected import for default export
// We'll need to define or import ColorSlider if it's not globally available or passed as prop

interface GlobalColorPickerProps {
  t: (key: string) => string; // Simplified type for translation function
  globalHue: number;
  globalSat: number;
  globalLight: number;
  handleGlobalHueChange: (value: number) => void;
  onPickerClick: React.MouseEventHandler<HTMLDivElement>;
  handleSatLightPickerMouseDown: (
    event: React.MouseEvent<HTMLDivElement>,
  ) => void;
  handleSatLightPickerTouchStart: (
    event: React.TouchEvent<HTMLDivElement>,
  ) => void;
  satLightPickerRef: React.RefObject<HTMLDivElement>;
  globalPickerColorString: string;
  hueGradientColors?: string[];
}

const GlobalColorPicker: React.FC<GlobalColorPickerProps> = ({
  t,
  globalHue,
  globalSat,
  globalLight,
  handleGlobalHueChange,
  onPickerClick,
  handleSatLightPickerMouseDown,
  handleSatLightPickerTouchStart,
  satLightPickerRef,
  globalPickerColorString,
  hueGradientColors,
}) => {
  return (
    <section className="mb-12 p-6 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-2xl">
      <div className="grid grid-cols-1 md:grid-cols-[400px_200px] gap-6 items-center justify-center">
        <div>
          <ColorSlider
            label={`${t('sliderHue') || 'Hue'}: ${globalHue.toFixed(0)}°`}
            min={0}
            max={360}
            step={1}
            value={globalHue.toString()}
            onValueChange={handleGlobalHueChange}
            gradientColors={hueGradientColors}
          />
          <div
            ref={satLightPickerRef}
            className="w-full h-64 rounded-md cursor-grab active:cursor-grabbing border border-gray-300 dark:border-gray-600 relative overflow-hidden select-none"
            style={{
              backgroundColor: `hsl(${globalHue}, 100%, 50%)`,
              backgroundImage: `
                linear-gradient(to bottom, white 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0) 50%, black 100%),
                linear-gradient(to right, hsl(${globalHue}, 0%, 50%) 0%, hsla(${globalHue}, 0%, 50%, 0) 100%)
              `,
              touchAction: 'none',
            }}
            onClick={onPickerClick}
            onMouseDown={handleSatLightPickerMouseDown}
            onTouchStart={handleSatLightPickerTouchStart}
          >
            <div
              style={{
                position: 'absolute',
                left: `${globalSat.toFixed(2)}%`,
                top: `${(100 - globalLight).toFixed(2)}%`,
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                border: '2px solid white',
                backgroundColor: globalPickerColorString,
                transform: 'translate(-50%, -50%)',
                boxShadow: '0 0 0 1px rgba(0,0,0,0.5)',
                pointerEvents: 'none',
              }}
            ></div>
          </div>
        </div>
        <div className="flex flex-col items-center space-y-4">
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
            {/* Assuming 'selectedColorLabel' is a valid key */}
            {t('selectedColorLabel') || 'Selected Color:'}
          </p>
          <div
            className="w-32 h-32 rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-inner"
            style={{ backgroundColor: globalPickerColorString }}
          ></div>
        </div>
      </div>
      <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
        {/* Assuming 'globalPickerNote' is a valid key */}
        {t('globalPickerNote') ||
          'Picking a color here will update the HSL, RGB and Oklch sections below.'}
      </p>
    </section>
  );
};

export default GlobalColorPicker;

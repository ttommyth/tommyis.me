'use client';

import { Popover } from '@headlessui/react';
import { InformationCircleIcon } from '@heroicons/react/20/solid';
import React from 'react';
import ColorDisplay from './ColorDisplay';
import ColorSlider, { ColorSliderProps } from './ColorSlider';

export interface ColorModelPanelProps {
  title: string;
  colorString: string;
  onPreviewClick: (colorString: string) => void;
  notes: React.ReactNode;
  sliderConfigs: ColorSliderProps[];
  gamutNote?: string | null;
  // t might be needed if there are any internal translations, or pass translated strings directly
}

const ColorModelPanel: React.FC<ColorModelPanelProps> = ({
  title,
  colorString,
  onPreviewClick,
  notes,
  sliderConfigs,
  gamutNote,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        <Popover className="relative">
          {({ open }) => (
            <>
              <Popover.Button
                className={`
                  ${open ? '' : 'text-opacity-90'}
                  p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
              >
                <InformationCircleIcon className="h-6 w-6 " />
              </Popover.Button>
              <Popover.Panel className="absolute z-10 w-64 p-3 mt-2 text-xs text-left text-gray-700 dark:text-gray-300 transform -translate-x-full left-1/2 bg-base-100 dark:bg-base-700 rounded-lg shadow-xl ring-1 ring-black ring-opacity-5">
                <div className="space-y-2">
                  {notes}
                  {gamutNote && (
                    <>
                      <hr className="my-1 border-gray-300 dark:border-gray-600" />
                      <p className="italic text-orange-600 dark:text-orange-400">
                        {gamutNote}
                      </p>
                    </>
                  )}
                </div>
              </Popover.Panel>
            </>
          )}
        </Popover>
      </div>
      <ColorDisplay
        colorString={colorString}
        onPreviewClick={onPreviewClick}
        isClipped={!!gamutNote}
      />
      <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow-2xl">
        {sliderConfigs.map((sliderProps, index) => (
          <ColorSlider key={index} {...sliderProps} />
        ))}
      </div>
    </div>
  );
};

export default ColorModelPanel;

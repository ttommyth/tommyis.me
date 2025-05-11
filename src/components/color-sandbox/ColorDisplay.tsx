'use client';

import { Transition } from '@headlessui/react';
import {
  ClipboardIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/20/solid';
import React, { Fragment, useEffect, useState } from 'react';

export interface ColorDisplayProps {
  colorString: string;
  onPreviewClick: (colorString: string) => void;
  isClipped?: boolean;
}

const ColorDisplay: React.FC<ColorDisplayProps> = ({
  colorString,
  onPreviewClick,
  isClipped,
}) => {
  const [copiedMessage, setCopiedMessage] = useState<string | null>(null);
  const copyTimeoutRef = React.useRef<number | null>(null);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(colorString)
      .then(() => {
        setCopiedMessage('Copied!');
        if (copyTimeoutRef.current) {
          clearTimeout(copyTimeoutRef.current);
        }
        copyTimeoutRef.current = window.setTimeout(() => {
          setCopiedMessage(null);
        }, 1500);
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
        setCopiedMessage('Failed to copy');
        if (copyTimeoutRef.current) {
          clearTimeout(copyTimeoutRef.current);
        }
        copyTimeoutRef.current = window.setTimeout(() => {
          setCopiedMessage(null);
        }, 1500);
      });
  };

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-2xl flex flex-col">
      <div
        className="w-full h-48 rounded-lg mb-4 transition-colors duration-500 ease-out border border-gray-200 dark:border-gray-700 cursor-pointer hover:ring-4 hover:ring-cyan-500/50 dark:hover:ring-cyan-400/50 relative"
        style={{ backgroundColor: colorString }}
        onClick={() => onPreviewClick(colorString)}
      >
        {isClipped && (
          <div
            className="absolute top-2 right-2 p-1 bg-yellow-400/80 dark:bg-yellow-500/80 rounded-full shadow flex items-center space-x-1"
            title="Displayed sRGB color is clipped from a wider gamut source"
          >
            <ExclamationTriangleIcon className="h-4 w-4 text-black/70 dark:text-black/80" />
            <span className="text-xs text-black/70 dark:text-black/80 font-medium">
              Clipped
            </span>
          </div>
        )}
      </div>
      <div className="relative flex items-center justify-between text-center font-mono text-xs text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-3 py-2 rounded-md mb-4 h-8">
        <div className="flex-grow whitespace-nowrap overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-500 scrollbar-track-gray-100 dark:scrollbar-track-gray-800 pr-2 relative">
          <span
            className={`${copiedMessage ? 'opacity-0' : 'opacity-100'} transition-opacity duration-100`}
          >
            {colorString}
          </span>

          <Transition
            as={Fragment}
            show={!!copiedMessage}
            enter="transition-all ease-out duration-300"
            enterFrom="opacity-0 translate-y-2"
            enterTo="opacity-100 translate-y-0"
            leave="transition-all ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 -translate-y-2"
          >
            <span className="absolute inset-0 flex items-center justify-center">
              {copiedMessage}
            </span>
          </Transition>
        </div>
        <button
          onClick={handleCopy}
          title="Copy to clipboard"
          className="p-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400"
          disabled={!!copiedMessage}
        >
          <ClipboardIcon className="h-4 w-4 text-gray-700 dark:text-gray-300" />
        </button>
      </div>
    </div>
  );
};

export default ColorDisplay;

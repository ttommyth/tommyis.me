import { ClipboardIcon } from '@heroicons/react/20/solid';
import React from 'react';

// Component to display a single palette (tints, shades, or tones)
export interface ColorPaletteDisplayProps {
  title: string;
  colors: string[];
  onPreviewClick: (color: string) => void;
  controls?: React.ReactNode; // Optional prop for additional controls
}

const ColorPaletteDisplay: React.FC<ColorPaletteDisplayProps> = ({
  title,
  colors,
  onPreviewClick,
  controls, // Destructure the new prop
}) => {
  const handleCopyToClipboard = (color: string) => {
    navigator.clipboard.writeText(color).then(
      () => {
        // Optional: Add some feedback to the user, e.g., a toast message
        console.log(`Color ${color} copied to clipboard`);
      },
      (err) => {
        console.error('Failed to copy color: ', err);
      },
    );
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
        {title}
      </h3>
      {controls && <div className="mb-3">{controls}</div>}
      {/* Render controls if provided */}
      <div className="flex flex-wrap gap-2">
        {colors.map((color, index) => (
          <div
            key={`${title}-${index}`}
            className="relative w-12 h-12 rounded border border-gray-300 dark:border-gray-600 group" // Added relative and group
            style={{ backgroundColor: color }}
            title={color} // Keep title for the whole block for accessibility/hover
          >
            <div
              className="absolute inset-0 cursor-pointer transform hover:scale-110 transition-transform"
              onClick={() => onPreviewClick(color)}
              title={`Preview ${color}`} // More specific title for preview action
            />
            <button
              onClick={() => handleCopyToClipboard(color)}
              className="absolute bottom-0 right-0 p-1 bg-gray-800 bg-opacity-50 text-white text-xs rounded-tl opacity-0 group-hover:opacity-100 hover:bg-opacity-75 transition-opacity"
              title={`Copy ${color} to clipboard`}
            >
              {/* Using a simple text representation for clipboard; consider an SVG icon */}
              <ClipboardIcon className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorPaletteDisplay;

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
            className="w-12 h-12 rounded border border-gray-300 dark:border-gray-600 cursor-pointer transform hover:scale-110 transition-transform"
            style={{ backgroundColor: color }}
            onClick={() => onPreviewClick(color)}
            title={color}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorPaletteDisplay;

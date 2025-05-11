'use client';

import React from 'react';

export interface ColorSliderProps {
  label: string;
  min: number;
  max: number;
  step: number;
  value: string | number; // Allow number as well, as it's often passed directly
  onValueChange: (value: number) => void;
  unit?: string;
  gradientColors?: string[]; // New prop for gradient colors
}

const ColorSlider: React.FC<ColorSliderProps> = ({
  label,
  min,
  max,
  step,
  value,
  onValueChange,
  unit,
  gradientColors,
}) => {
  const trackStyle: React.CSSProperties = {};
  if (gradientColors && gradientColors.length >= 2) {
    trackStyle.background = `linear-gradient(to right, ${gradientColors.join(', ')})`;
  } else {
    // Fallback to a default gray if no gradient is provided
    // This could be improved to use theme-aware grays if needed
    trackStyle.background = 'rgb(209 213 219)'; // Equivalent to bg-gray-300
    // A dark mode specific fallback would require more logic here or CSS variables
  }

  // Ensure value is a number for the input range
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;

  return (
    <div className="mb-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}: {numericValue}
        {unit}
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={numericValue}
        onChange={(e) => onValueChange(parseFloat(e.target.value))}
        style={trackStyle}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-cyan-500 dark:accent-cyan-400 p-0 m-0"
      />
    </div>
  );
};

export default ColorSlider;

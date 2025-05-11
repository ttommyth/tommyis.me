import React from 'react';

interface ImageTemplateProps {
  primaryColorCss: string;
  isPrimaryColorClipped?: boolean;
  harmonyColorsCss: string[];
  tintsPaletteCss: string[];
  shadesPaletteCss: string[];
  tonesPaletteCss: string[];
  displayColorName: string;
  fontSize: number;
}

const ImageTemplate: React.FC<ImageTemplateProps> = ({
  primaryColorCss,
  isPrimaryColorClipped,
  harmonyColorsCss,
  tintsPaletteCss,
  shadesPaletteCss,
  tonesPaletteCss,
  displayColorName,
  fontSize,
}) => {
  // Equivalent to the previous html object structure
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        height: '100%',
        backgroundColor: '#f0f0f0', // A light background for the overall image
      }}
    >
      {/* Section 1: Primary Color Block */}
      <div
        style={{
          width: '52.5%',
          height: '100%',
          backgroundColor: primaryColorCss,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          position: 'relative',
        }}
      >
        {/* Container for Nearest Color Name Text */}
        <div
          style={{
            position: 'absolute',
            bottom: '20px', // Adjust padding from bottom
            left: '20px', // Adjust padding from left
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start', // Align text to the left
            // backgroundColor: 'rgba(0,0,0,0.1)' // Optional: for debugging text area
          }}
        >
          <div
            style={{
              color: 'white',
              fontSize: `${fontSize}px`,
              lineHeight: '1.1',
            }}
          >
            {displayColorName}
          </div>
          <div
            style={{
              color: 'black',
              fontSize: `${fontSize}px`,
              lineHeight: '1.1',
            }}
          >
            {displayColorName}
          </div>
        </div>

        {isPrimaryColorClipped && (
          <div
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '48px',
              height: '48px',
              display: 'flex',
            }}
          >
            <svg
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: '100%', height: '100%' }}
            >
              <path
                d="M50 5 L95 90 L5 90 Z"
                fill="#FFCC00"
                stroke="#000000"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                rx="16px"
                ry="16px"
              />
              <rect
                x="46"
                y="30"
                width="8"
                height="35"
                fill="#000000"
                strokeLinecap="round"
                strokeLinejoin="round"
                rx="4px"
                ry="4px"
              />
              <circle cx="50" cy="75" r="5" fill="#000000" />
            </svg>
          </div>
        )}
      </div>

      {/* Section 2: Palettes (Tints, Shades, Tones) */}
      <div
        style={{
          width: '17.5%',
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
          padding: '0px',
          gap: '0px',
          boxSizing: 'border-box',
        }}
      >
        {[tonesPaletteCss, shadesPaletteCss, tintsPaletteCss].map(
          (palette, paletteIndex) => (
            <div
              key={`palette-column-${paletteIndex}`}
              style={{
                display: 'flex',
                flexDirection: 'column-reverse',
                width: '33.33%',
                height: '100%',
              }}
            >
              {palette.slice(0, 12).map((color, index) => (
                <div
                  key={`palette-${paletteIndex}-color-${index}`}
                  style={{
                    flexGrow: 1,
                    backgroundColor: color,
                    minHeight: '8.33%',
                  }}
                />
              ))}
            </div>
          ),
        )}
      </div>

      {/* Section 3: Harmony Colors Grid */}
      <div
        style={{
          width: '30%',
          height: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          padding: '0px',
          gap: '0px',
          boxSizing: 'border-box',
          overflowX: 'hidden',
        }}
      >
        {harmonyColorsCss.slice(0, 10).map((color, index) => (
          <div
            key={index}
            style={{
              width: '33.33%',
              height: '25%',
              backgroundColor: color,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageTemplate;

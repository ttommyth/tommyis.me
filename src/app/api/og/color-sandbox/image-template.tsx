import React from 'react';

interface ImageTemplateProps {
  primaryColorCss: string;
  harmonyColorsCss: string[];
  tintsPaletteCss: string[];
  shadesPaletteCss: string[];
  tonesPaletteCss: string[];
}

const ImageTemplate: React.FC<ImageTemplateProps> = ({
  primaryColorCss,
  harmonyColorsCss,
  tintsPaletteCss,
  shadesPaletteCss,
  tonesPaletteCss,
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
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />

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

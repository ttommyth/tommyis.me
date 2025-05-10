'use client';

import ColorModelPanel from '@/components/color-sandbox/ColorModelPanel';
import GlobalColorPicker from '@/components/color-sandbox/GlobalColorPicker';
import { useColorSandboxState } from '@/hooks/useColorSandboxState';
import { formatCss, type Color as CuloriColor } from 'culori';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useState } from 'react';

// Simple debounce utility function
function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<F>): Promise<ReturnType<F>> => {
    return new Promise((resolve) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        timeoutId = null;
        resolve(func(...args));
      }, waitFor);
    });
  };
}

// Helper to get CSS string from Culori color object
const getCssString = (colorObj: CuloriColor | undefined): string => {
  if (!colorObj) return 'transparent';
  const str = formatCss(colorObj);
  return str || 'transparent';
};

// Helper to generate hue gradient colors
const getHueGradientCssStrings = (
  colorConstructor: (hue: number) => CuloriColor,
  stops = 6,
): string[] => {
  const result: string[] = [];
  for (let i = 0; i <= stops; i++) {
    const hue = (i / stops) * 360;
    result.push(getCssString(colorConstructor(hue % 360)));
  }
  return result;
};

const ColorSandboxPage = () => {
  const t = useTranslations('ColorSandbox');
  const pageTranslations = useTranslations('ColorSandbox');

  const {
    globalHue,
    globalSat,
    globalLight,
    r,
    g,
    b,
    hState,
    sState,
    lState,
    okL,
    okC,
    okH,
    rgbString,
    hslString,
    oklchString,
    globalPickerColorString,
    rgbGamutNote,
    hslGamutNote,
    satLightPickerRef,
    handleSatLightPickerMouseDown,
    handleSatLightPickerTouchStart,
    handleSatLightPickerClick,
    handleGlobalHueChange,
    handleRgbRChange,
    handleRgbGChange,
    handleRgbBChange,
    handleHslHChange,
    handleHslSChange,
    handleHslLChange,
    handleOklchLChange,
    handleOklchCChange,
    handleOklchHChange,
  } = useColorSandboxState();

  const [fullScreenColor, setFullScreenColor] = useState<string | null>(null);

  const handlePreviewClick = (color: string) => {
    setFullScreenColor(color);
  };

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setFullScreenColor(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  // Debounced function to update theme color
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateThemeColorDebounced = useCallback(
    debounce((color: string) => {
      if (typeof window !== 'undefined') {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
          metaThemeColor = document.createElement('meta');
          metaThemeColor.setAttribute('name', 'theme-color');
          document.head.appendChild(metaThemeColor);
        }
        metaThemeColor.setAttribute('content', color);
      }
    }, 200),
    [],
  );

  useEffect(() => {
    if (globalPickerColorString) {
      updateThemeColorDebounced(globalPickerColorString);
    }
  }, [globalPickerColorString, updateThemeColorDebounced]);

  const oklchP3ComparisonColor = `oklch(80% 0.3 300)`;
  const displayP3Color = `color(display-p3 0.4 0.9 0.2)`;

  // Slider Configurations with Gradients
  const rgbSliderConfigs = useMemo(
    () => [
      {
        label: t('sliderRed'),
        min: 0,
        max: 255,
        step: 1,
        value: r,
        onValueChange: handleRgbRChange,
        gradientColors: [
          getCssString({
            mode: 'rgb',
            r: 0,
            g: parseFloat(g as string) / 255,
            b: parseFloat(b as string) / 255,
          }),
          getCssString({
            mode: 'rgb',
            r: 1,
            g: parseFloat(g as string) / 255,
            b: parseFloat(b as string) / 255,
          }),
        ],
      },
      {
        label: t('sliderGreen'),
        min: 0,
        max: 255,
        step: 1,
        value: g,
        onValueChange: handleRgbGChange,
        gradientColors: [
          getCssString({
            mode: 'rgb',
            r: parseFloat(r as string) / 255,
            g: 0,
            b: parseFloat(b as string) / 255,
          }),
          getCssString({
            mode: 'rgb',
            r: parseFloat(r as string) / 255,
            g: 1,
            b: parseFloat(b as string) / 255,
          }),
        ],
      },
      {
        label: t('sliderBlue'),
        min: 0,
        max: 255,
        step: 1,
        value: b,
        onValueChange: handleRgbBChange,
        gradientColors: [
          getCssString({
            mode: 'rgb',
            r: parseFloat(r as string) / 255,
            g: parseFloat(g as string) / 255,
            b: 0,
          }),
          getCssString({
            mode: 'rgb',
            r: parseFloat(r as string) / 255,
            g: parseFloat(g as string) / 255,
            b: 1,
          }),
        ],
      },
    ],
    [r, g, b, t, handleRgbRChange, handleRgbGChange, handleRgbBChange],
  );

  const hslSliderConfigs = useMemo(
    () => [
      {
        label: t('sliderHue'),
        min: 0,
        max: 360,
        step: 1,
        value: hState,
        onValueChange: handleHslHChange,
        unit: '°',
        gradientColors: getHueGradientCssStrings((hue) => ({
          mode: 'hsl',
          h: hue,
          s: parseFloat(sState as string) / 100,
          l: parseFloat(lState as string) / 100,
        })),
      },
      {
        label: t('sliderSaturation'),
        min: 0,
        max: 100,
        step: 1,
        value: sState,
        onValueChange: handleHslSChange,
        unit: '%',
        gradientColors: [
          getCssString({
            mode: 'hsl',
            h: hState,
            s: 0,
            l: parseFloat(lState as string) / 100,
          }),
          getCssString({
            mode: 'hsl',
            h: hState,
            s: 1,
            l: parseFloat(lState as string) / 100,
          }),
        ],
      },
      {
        label: t('sliderLightness'),
        min: 0,
        max: 100,
        step: 1,
        value: lState,
        onValueChange: handleHslLChange,
        unit: '%',
        gradientColors: [
          getCssString({
            mode: 'hsl',
            h: hState,
            s: parseFloat(sState as string) / 100,
            l: 0,
          }),
          getCssString({
            mode: 'hsl',
            h: hState,
            s: parseFloat(sState as string) / 100,
            l: 1,
          }),
        ],
      },
    ],
    [
      hState,
      sState,
      lState,
      t,
      handleHslHChange,
      handleHslSChange,
      handleHslLChange,
    ],
  );

  const oklchSliderConfigs = useMemo(
    () => [
      {
        label: t('sliderOklchLightness'),
        min: 0,
        max: 1,
        step: 0.01,
        value: okL,
        onValueChange: handleOklchLChange,
        gradientColors: [
          getCssString({
            mode: 'oklch',
            l: 0,
            c: okC as number,
            h: okH as number,
          }),
          getCssString({
            mode: 'oklch',
            l: 1,
            c: okC as number,
            h: okH as number,
          }),
        ],
      },
      {
        label: t('sliderOklchChroma'),
        min: 0,
        max: 0.5,
        step: 0.005,
        value: okC,
        onValueChange: handleOklchCChange,
        gradientColors: [
          getCssString({
            mode: 'oklch',
            l: okL as number,
            c: 0,
            h: okH as number,
          }),
          getCssString({
            mode: 'oklch',
            l: okL as number,
            c: 0.5,
            h: okH as number,
          }), // Max chroma for slider
        ],
      },
      {
        label: t('sliderOklchHue'),
        min: 0,
        max: 360,
        step: 1,
        value: okH,
        onValueChange: handleOklchHChange,
        unit: '°',
        gradientColors: getHueGradientCssStrings((hue) => ({
          mode: 'oklch',
          l: okL as number,
          c: okC as number,
          h: hue,
        })),
      },
    ],
    [
      okL,
      okC,
      okH,
      t,
      handleOklchLChange,
      handleOklchCChange,
      handleOklchHChange,
    ],
  );

  return (
    <>
      {fullScreenColor && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer"
          style={{ backgroundColor: fullScreenColor }}
          onClick={() => setFullScreenColor(null)}
        >
          <p className="text-white/70 text-lg bg-black/30 p-2 rounded-md select-none">
            Click or press Esc to close
          </p>
        </div>
      )}
      <div className="min-h-screen text-gray-900 dark:text-white pt-16 selection:bg-cyan-500 selection:text-black ">
        <header className="text-center mb-10">
          <h1 className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-pink-500 to-orange-500 dark:from-cyan-400 dark:via-pink-500 dark:to-orange-400 py-2">
            {pageTranslations('pageTitle')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
            {pageTranslations('pageDescription')}
          </p>
        </header>

        <div
          style={{
            boxShadow: `0px 0px 30px 10px ${globalPickerColorString}`,
            borderRadius: '0.75rem', // Matches rounded-xl from GlobalColorPicker's inner section
            transition: 'box-shadow 0.2s ease-out',
          }}
        >
          <GlobalColorPicker
            t={t}
            globalHue={globalHue}
            globalSat={globalSat}
            globalLight={globalLight}
            handleGlobalHueChange={handleGlobalHueChange}
            onPickerClick={handleSatLightPickerClick}
            handleSatLightPickerMouseDown={handleSatLightPickerMouseDown}
            handleSatLightPickerTouchStart={handleSatLightPickerTouchStart}
            satLightPickerRef={satLightPickerRef}
            globalPickerColorString={globalPickerColorString}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <ColorModelPanel
            title={t('rgbTitle')}
            colorString={rgbString}
            onPreviewClick={handlePreviewClick}
            notes={
              <>
                <p>
                  {t.rich('rgbNotes.transitions', {
                    strong: (chunks) => <strong>{chunks}</strong>,
                  })}
                </p>
                <p>
                  {t.rich('rgbNotes.gamut', {
                    strong: (chunks) => <strong>{chunks}</strong>,
                  })}
                </p>
                <p>
                  {t.rich('rgbNotes.use', {
                    strong: (chunks) => <strong>{chunks}</strong>,
                  })}
                </p>
              </>
            }
            gamutNote={rgbGamutNote}
            sliderConfigs={rgbSliderConfigs}
          />

          <ColorModelPanel
            title={t('hslTitle')}
            colorString={hslString}
            onPreviewClick={handlePreviewClick}
            notes={
              <>
                <p>
                  {t.rich('hslNotes.transitions', {
                    strong: (chunks) => <strong>{chunks}</strong>,
                  })}
                </p>
                <p>
                  {t.rich('hslNotes.gamut', {
                    strong: (chunks) => <strong>{chunks}</strong>,
                  })}
                </p>
                <p>
                  {t.rich('hslNotes.use', {
                    strong: (chunks) => <strong>{chunks}</strong>,
                  })}
                </p>
              </>
            }
            gamutNote={hslGamutNote}
            sliderConfigs={hslSliderConfigs}
          />

          <ColorModelPanel
            title={t('oklchTitle')}
            colorString={oklchString}
            onPreviewClick={handlePreviewClick}
            notes={
              <>
                <p>
                  {t.rich('oklchNotes.targetInstruction', {
                    swatch: (chunks) => (
                      <span
                        style={{
                          backgroundColor: globalPickerColorString,
                          display: 'inline-block',
                          width: '1em',
                          height: '1em',
                          border: '1px solid currentColor',
                          verticalAlign: 'middle',
                          marginLeft: '0.25em',
                          marginRight: '0.25em',
                        }}
                      >
                        {/* {chunks} // Removed chunks as it's self-closing like icon */}
                      </span>
                    ),
                  })}
                </p>
                <hr className="my-2 border-gray-300 dark:border-gray-600" />
                <p>
                  {t.rich('oklchNotes.transitions', {
                    strong: (chunks) => <strong>{chunks}</strong>,
                  })}
                </p>
                <p>
                  {t.rich('oklchNotes.gamut', {
                    strong: (chunks) => <strong>{chunks}</strong>,
                  })}
                </p>
                <p>
                  {t.rich('oklchNotes.hdrExample', {
                    strong: (chunks) => <strong>{chunks}</strong>,
                    p3PurpleSpan: (chunks) => (
                      <span
                        style={{
                          color: oklchP3ComparisonColor,
                          fontWeight: 'bold',
                        }}
                      >
                        {chunks}
                      </span>
                    ),
                    colorString: oklchP3ComparisonColor,
                  })}
                </p>
                <p>
                  {t.rich('oklchNotes.p3Example', {
                    strong: (chunks) => <strong>{chunks}</strong>,
                    p3GreenSpan: (chunks) => (
                      <span
                        style={{ color: displayP3Color, fontWeight: 'bold' }}
                      >
                        {chunks}
                      </span>
                    ),
                    code: (chunks) => <code>{chunks}</code>,
                    colorString: displayP3Color,
                  })}
                </p>
                <p>
                  {t.rich('oklchNotes.use', {
                    strong: (chunks) => <strong>{chunks}</strong>,
                  })}
                </p>
              </>
            }
            sliderConfigs={oklchSliderConfigs}
          />
        </div>

        <footer className="text-center mt-12 py-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">
            {pageTranslations('footerNote')}
          </p>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {pageTranslations('footerWarning')}
          </p>
        </footer>
      </div>
    </>
  );
};

export default ColorSandboxPage;

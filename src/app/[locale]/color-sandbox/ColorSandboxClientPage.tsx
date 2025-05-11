'use client';

import ConvertersTabPanel from '@/components/color-sandbox/ConvertersTabPanel';
import GlobalColorPicker from '@/components/color-sandbox/GlobalColorPicker';
import HarmoniesTabPanel from '@/components/color-sandbox/HarmoniesTabPanel';
import PalettesTabPanel from '@/components/color-sandbox/PalettesTabPanel';
import { useColorSandboxState } from '@/hooks/useColorSandboxState';
import {
  generateAnalogousHarmony,
  generateComplementaryHarmony,
  generateShades,
  generateSplitComplementaryHarmony,
  generateTetradicHarmony,
  generateTints,
  generateTones,
  generateTriadicHarmony,
  getCssString,
  getHueGradientCssStrings,
} from '@/utils/colorUtils';
import { Tab } from '@headlessui/react';
import { Color as CuloriColor, Oklch } from 'culori';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation'; // Keep useSearchParams for other params if needed
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// Debounced callback hook (assuming it's still used, keep it here or move to utils)
function useDebouncedCallback<A extends any[], R>(
  callback: (...args: A) => R,
  delay: number,
): (...args: A) => void {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    (...args: A) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay],
  );
}

interface ColorSandboxClientPageProps {
  initialColorFromSearch?: CuloriColor; // Prop from server component
}

const ColorSandboxClientPage = ({
  initialColorFromSearch,
}: ColorSandboxClientPageProps) => {
  const t = useTranslations('ColorSandbox');
  const pageTranslations = useTranslations('ColorSandbox'); // Assuming this is different or specific

  const router = useRouter();
  const searchParams = useSearchParams(); // Still used for non-color params like tab, steps, angles

  const initialUrlAppliedRef = useRef(false); // For URL updates

  // States for sliders that we want to persist in URL - with defaults
  const [paletteSteps, setPaletteSteps] = useState(12);
  const [analogousAngle, setAnalogousAngle] = useState(30);
  const [tetradicAngle, setTetradicAngle] = useState(60);
  const [splitComplementaryAngle, setSplitComplementaryAngle] = useState(30);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  // No longer need initialColorFromUrl state here, it comes as a prop
  const [isInitialized, setIsInitialized] = useState(false); // For other params

  // Effect to read NON-COLOR URL params on initial load
  useEffect(() => {
    // Color params (gh, gs, gl) are now handled by initialColorFromSearch prop for the hook
    // Other params are still read here:
    const psParam = searchParams.get('ps');
    if (psParam) setPaletteSteps(parseInt(psParam, 10) || 12);
    const aaParam = searchParams.get('aa');
    if (aaParam) setAnalogousAngle(parseInt(aaParam, 10) || 30);
    const taParam = searchParams.get('ta');
    if (taParam) setTetradicAngle(parseInt(taParam, 10) || 60);
    const saParam = searchParams.get('sa');
    if (saParam) setSplitComplementaryAngle(parseInt(saParam, 10) || 30);
    const tabParam = searchParams.get('tab');
    if (tabParam) setSelectedTabIndex(parseInt(tabParam, 10) || 0);

    setIsInitialized(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Runs once on mount to get non-color params

  // Pass initialColorFromSearch to the hook
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
  } = useColorSandboxState({ initialColor: initialColorFromSearch });

  const performUrlUpdate = useCallback(() => {
    if (!isInitialized || !initialUrlAppliedRef.current) {
      // initialUrlAppliedRef is now only for preventing update before client-side params are read
      return;
    }
    const queryParams = new URLSearchParams();
    // globalHue, Sat, Light will come from the hook, reflecting the store's state
    if (globalHue !== undefined) queryParams.set('gh', String(globalHue));
    if (globalSat !== undefined) queryParams.set('gs', String(globalSat)); // Assuming hook returns these as numbers
    if (globalLight !== undefined) queryParams.set('gl', String(globalLight));
    queryParams.set('ps', String(paletteSteps));
    queryParams.set('aa', String(analogousAngle));
    queryParams.set('ta', String(tetradicAngle));
    queryParams.set('sa', String(splitComplementaryAngle));
    queryParams.set('tab', String(selectedTabIndex));
    const currentPathname = window.location.pathname; // On client, window is available
    const newUrl = `${currentPathname}?${queryParams.toString()}`;
    window.history.replaceState(null, '', newUrl);
  }, [
    isInitialized,
    globalHue,
    globalSat,
    globalLight,
    paletteSteps,
    analogousAngle,
    tetradicAngle,
    splitComplementaryAngle,
    selectedTabIndex,
  ]);

  const debouncedUpdateUrl = useDebouncedCallback(performUrlUpdate, 250);

  useEffect(() => {
    // Logic to ensure URL update only happens after client-side params are processed
    if (isInitialized && !initialUrlAppliedRef.current) {
      initialUrlAppliedRef.current = true;
    }
    if (!initialUrlAppliedRef.current) {
      // Only block if initial client params haven't been applied to URL state
      return;
    }
    debouncedUpdateUrl();
  }, [
    isInitialized, // For initialUrlAppliedRef logic
    globalHue,
    globalSat,
    globalLight,
    paletteSteps,
    analogousAngle,
    tetradicAngle,
    splitComplementaryAngle,
    selectedTabIndex,
    debouncedUpdateUrl, // Added debouncedUpdateUrl
  ]);

  const [fullScreenColor, setFullScreenColor] = useState<string | null>(null);
  const handlePreviewClick = (color: string) => setFullScreenColor(color);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setFullScreenColor(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const themeUpdateCallback = useCallback((color: string) => {
    if (typeof window !== 'undefined') {
      let metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (!metaThemeColor) {
        metaThemeColor = document.createElement('meta');
        metaThemeColor.setAttribute('name', 'theme-color');
        document.head.appendChild(metaThemeColor);
      }
      metaThemeColor.setAttribute('content', color);
    }
  }, []);

  const updateThemeColorDebounced = useDebouncedCallback(
    themeUpdateCallback,
    200,
  );

  useEffect(() => {
    if (globalPickerColorString) {
      updateThemeColorDebounced(globalPickerColorString);
    }
  }, [globalPickerColorString, updateThemeColorDebounced]);

  const oklchP3ComparisonColor = `oklch(80% 0.3 300)`;
  const displayP3Color = `color(display-p3 0.4 0.9 0.2)`;

  const rgbSliderConfigs = useMemo(
    () => [
      {
        label: t('sliderRed'),
        min: 0,
        max: 255,
        step: 1,
        value: r, // This now comes from useColorSandboxState
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
            h: parseFloat(hState as string),
            s: 0,
            l: parseFloat(lState as string) / 100,
          }),
          getCssString({
            mode: 'hsl',
            h: parseFloat(hState as string),
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
            h: parseFloat(hState as string),
            s: parseFloat(sState as string) / 100,
            l: 0,
          }),
          getCssString({
            mode: 'hsl',
            h: parseFloat(hState as string),
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
            c: parseFloat(okC as string),
            h: parseFloat(okH as string),
          }),
          getCssString({
            mode: 'oklch',
            l: 1,
            c: parseFloat(okC as string),
            h: parseFloat(okH as string),
          }),
        ],
      },
      {
        label: t('sliderOklchChroma'),
        min: 0,
        max: 0.5, // Consider if this max is always appropriate
        step: 0.005,
        value: okC,
        onValueChange: handleOklchCChange,
        gradientColors: [
          getCssString({
            mode: 'oklch',
            l: parseFloat(okL as string),
            c: 0,
            h: parseFloat(okH as string),
          }),
          getCssString({
            mode: 'oklch',
            l: parseFloat(okL as string),
            c: 0.5,
            h: parseFloat(okH as string),
          }),
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
          l: parseFloat(okL as string),
          c: parseFloat(okC as string),
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

  const globalHueSliderGradient = useMemo(
    () =>
      getHueGradientCssStrings((hue) => ({
        mode: 'hsl',
        h: hue,
        s: 1,
        l: 0.5,
      })),
    [],
  );

  const tabCategories = [
    t('tabs.converters'),
    t('tabs.palettes'),
    t('tabs.harmonies'),
  ];

  const baseOklchForPalettes: Oklch = useMemo(
    () => ({
      mode: 'oklch',
      l: typeof okL === 'string' ? parseFloat(okL) : okL,
      c: typeof okC === 'string' ? parseFloat(okC) : okC,
      h: typeof okH === 'string' ? parseFloat(okH) : okH,
    }),
    [okL, okC, okH],
  );

  const tints = useMemo(
    () => generateTints(baseOklchForPalettes, paletteSteps),
    [baseOklchForPalettes, paletteSteps],
  );
  const shades = useMemo(
    () => generateShades(baseOklchForPalettes, paletteSteps),
    [baseOklchForPalettes, paletteSteps],
  );
  const tones = useMemo(
    () => generateTones(baseOklchForPalettes, paletteSteps),
    [baseOklchForPalettes, paletteSteps],
  );

  const complementaryHarmony = useMemo(
    () => generateComplementaryHarmony(baseOklchForPalettes),
    [baseOklchForPalettes],
  );
  const analogousHarmony = useMemo(
    () => generateAnalogousHarmony(baseOklchForPalettes, analogousAngle),
    [baseOklchForPalettes, analogousAngle],
  );
  const triadicHarmony = useMemo(
    () => generateTriadicHarmony(baseOklchForPalettes),
    [baseOklchForPalettes],
  );
  const tetradicHarmony = useMemo(
    () => generateTetradicHarmony(baseOklchForPalettes, tetradicAngle),
    [baseOklchForPalettes, tetradicAngle],
  );
  const splitComplementaryHarmony = useMemo(
    () =>
      generateSplitComplementaryHarmony(
        baseOklchForPalettes,
        splitComplementaryAngle,
      ),
    [baseOklchForPalettes, splitComplementaryAngle],
  );

  // --- JSX Structure ---
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
      {/* Assuming pt-16 was for a global header, if that's in LocaleLayout, this might not be needed */}
      <div className="min-h-screen text-gray-900 dark:text-white pt-16 selection:bg-cyan-500 selection:text-black ">
        <header className="text-center mb-10">
          <h1 className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-pink-500 to-orange-500 dark:from-cyan-400 dark:via-pink-500 dark:to-orange-400 py-2">
            {pageTranslations('pageTitle')}
          </h1>
        </header>

        <div
          style={{
            boxShadow: `0px 0px 30px 10px ${globalPickerColorString}`, // Ensure globalPickerColorString is valid
            borderRadius: '0.75rem',
            transition: 'box-shadow 0.2s ease-out',
          }}
        >
          <GlobalColorPicker
            t={t} // Pass t
            globalHue={globalHue} // from hook
            globalSat={globalSat} // from hook
            globalLight={globalLight} // from hook
            handleGlobalHueChange={handleGlobalHueChange}
            onPickerClick={handleSatLightPickerClick}
            handleSatLightPickerMouseDown={handleSatLightPickerMouseDown}
            handleSatLightPickerTouchStart={handleSatLightPickerTouchStart}
            satLightPickerRef={satLightPickerRef}
            globalPickerColorString={globalPickerColorString} // from hook
            hueGradientColors={globalHueSliderGradient}
          />
        </div>

        {isInitialized && (
          <>
            <div className="w-full mt-6">
              {/* Added mt-6 for spacing after picker */}
              <Tab.Group
                selectedIndex={selectedTabIndex}
                onChange={setSelectedTabIndex}
              >
                <Tab.List className="flex space-x-1 rounded-xl">
                  {tabCategories.map((category) => (
                    <Tab
                      key={category}
                      className={({ selected }) =>
                        `w-full rounded-t-lg py-2.5 text-sm font-medium leading-5 focus:outline-none  border-transparent border-t-2 border-x-2
                    ${selected ? '  border-dashed  border-default' : ''}`
                      }
                    >
                      {category}
                    </Tab>
                  ))}
                </Tab.List>
                <Tab.Panels className="">
                  <Tab.Panel className="rounded-xl p-3 focus:outline-none bg-dotted border-default border-dashed border-2">
                    <ConvertersTabPanel
                      t={t}
                      rgbString={rgbString}
                      hslString={hslString}
                      oklchString={oklchString}
                      handlePreviewClick={handlePreviewClick}
                      rgbGamutNote={rgbGamutNote}
                      hslGamutNote={hslGamutNote}
                      rgbSliderConfigs={rgbSliderConfigs}
                      hslSliderConfigs={hslSliderConfigs}
                      oklchSliderConfigs={oklchSliderConfigs}
                      globalPickerColorString={globalPickerColorString}
                      oklchP3ComparisonColor={oklchP3ComparisonColor}
                      displayP3Color={displayP3Color}
                    />
                  </Tab.Panel>
                  <Tab.Panel className="rounded-xl p-6 focus:outline-none bg-dotted border-default border-dashed border-2">
                    <PalettesTabPanel
                      t={t}
                      paletteSteps={paletteSteps}
                      setPaletteSteps={setPaletteSteps}
                      tints={tints}
                      shades={shades}
                      tones={tones}
                      handlePreviewClick={handlePreviewClick}
                    />
                  </Tab.Panel>
                  <Tab.Panel className="rounded-xl p-6 focus:outline-none bg-dotted border-default border-dashed border-2">
                    <HarmoniesTabPanel
                      t={t}
                      complementaryHarmony={complementaryHarmony}
                      triadicHarmony={triadicHarmony}
                      analogousHarmony={analogousHarmony}
                      tetradicHarmony={tetradicHarmony}
                      splitComplementaryHarmony={splitComplementaryHarmony}
                      handlePreviewClick={handlePreviewClick}
                      analogousAngle={analogousAngle}
                      setAnalogousAngle={setAnalogousAngle}
                      tetradicAngle={tetradicAngle}
                      setTetradicAngle={setTetradicAngle}
                      splitComplementaryAngle={splitComplementaryAngle}
                      setSplitComplementaryAngle={setSplitComplementaryAngle}
                    />
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </div>

            <footer className="text-center mt-12 py-6 border-t border-gray-200 dark:border-gray-700"></footer>
          </>
        )}
      </div>
    </>
  );
};

export default ColorSandboxClientPage;

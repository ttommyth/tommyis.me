'use client'; // If any part of it might be used in client components directly, or if it uses client-only hooks like useState/useEffect

import { converter, inGamut, type Color as CuloriColor } from 'culori';
import { useTranslations } from 'next-intl'; // For gamut notes
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';

// --- Formatting Utility ---
type PrecisionType = 'oklchLC' | 'integer' | 'percent' | 'degree';

function formatNumber(value: number, type: PrecisionType): string {
  switch (type) {
    case 'oklchLC':
      return value.toFixed(4); // For Oklch L and C
    case 'integer':
      return Math.round(value).toString(); // For RGB, Oklch H
    case 'percent': // For HSL S and L
    case 'degree': // For HSL H
      return Math.round(value).toString();
    default:
      return value.toString();
  }
}
// --- End Formatting Utility ---

// --- Color Store Definition ---
let currentMasterColorState: CuloriColor = {
  mode: 'hsl',
  h: 210,
  s: 0.6,
  l: 0.6,
}; // Default
const listeners = new Set<() => void>();

const colorStore = {
  setColor: (newColor: CuloriColor) => {
    currentMasterColorState = newColor;
    listeners.forEach((listener) => listener());
  },
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot: (): CuloriColor => {
    return currentMasterColorState;
  },
  initialize: (initialColor?: CuloriColor) => {
    if (initialColor) {
      currentMasterColorState = initialColor;
    }
  },
};
// --- End Color Store Definition ---

export interface UseColorSandboxStateProps {
  initialColor?: CuloriColor;
}

// Initialize store once with prop if provided. This effect runs once on mount.
let storeInitialized = false;

export function useColorSandboxState(props?: UseColorSandboxStateProps) {
  if (!storeInitialized) {
    colorStore.initialize(props?.initialColor);
    storeInitialized = true;
  }

  const masterColor = useSyncExternalStore(
    colorStore.subscribe,
    colorStore.getSnapshot,
  );

  const t = useTranslations('ColorSandbox.gamutNotes');

  const [rgbGamutNote, setRgbGamutNote] = useState<string | null>(null);
  const [hslGamutNote, setHslGamutNote] = useState<string | null>(null);

  // Derived values (these remain the same, depending on masterColor from the store)
  const masterColorHsl = useMemo(
    () => converter('hsl')(masterColor),
    [masterColor],
  );
  const masterColorRgb = useMemo(
    () => converter('rgb')(masterColor),
    [masterColor],
  );
  const masterColorOklch = useMemo(
    () => converter('oklch')(masterColor),
    [masterColor],
  );

  // Formatted values for display
  const globalHue = useMemo(
    () => formatNumber(masterColorHsl.h || 0, 'degree'),
    [masterColorHsl.h],
  );
  // globalSat and globalLight are used for internal calculations for the picker, keep as numbers
  const internalGlobalSat = masterColorHsl.s * 100;
  const internalGlobalLight = masterColorHsl.l * 100;

  const r = useMemo(
    () => formatNumber(masterColorRgb.r * 255, 'integer'),
    [masterColorRgb.r],
  );
  const g = useMemo(
    () => formatNumber(masterColorRgb.g * 255, 'integer'),
    [masterColorRgb.g],
  );
  const b = useMemo(
    () => formatNumber(masterColorRgb.b * 255, 'integer'),
    [masterColorRgb.b],
  );

  const hState = useMemo(
    () => formatNumber(masterColorHsl.h || 0, 'degree'),
    [masterColorHsl.h],
  );
  const sState = useMemo(
    () => formatNumber(masterColorHsl.s * 100, 'percent'),
    [masterColorHsl.s],
  );
  const lState = useMemo(
    () => formatNumber(masterColorHsl.l * 100, 'percent'),
    [masterColorHsl.l],
  );

  const okL = useMemo(
    () => formatNumber(masterColorOklch.l, 'oklchLC'),
    [masterColorOklch.l],
  );
  const okC = useMemo(
    () => formatNumber(masterColorOklch.c, 'oklchLC'),
    [masterColorOklch.c],
  );
  const okH = useMemo(
    () => formatNumber(masterColorOklch.h || 0, 'integer'),
    [masterColorOklch.h],
  );

  const rgbString = useMemo(() => `rgb(${r}, ${g}, ${b})`, [r, g, b]);
  const hslString = useMemo(
    () => `hsl(${hState}, ${sState}%, ${lState}%)`,
    [hState, sState, lState],
  );
  const oklchString = useMemo(
    () => `oklch(${okL} ${okC} ${okH})`, // Manually construct for precision
    [okL, okC, okH],
  );
  const globalPickerColorString = hslString;

  useEffect(() => {
    const sourceIsP3Like =
      masterColor.mode === 'oklch' ||
      masterColor.mode === 'p3' ||
      masterColor.mode === 'rec2020';
    const isMasterColorInSrgb = inGamut('rgb')(masterColor);

    if (sourceIsP3Like && !isMasterColorInSrgb) {
      setRgbGamutNote(t('sRgbClipped'));
      setHslGamutNote(t('sRgbClippedHsl'));
    } else {
      setRgbGamutNote(null);
      setHslGamutNote(null);
    }
  }, [masterColor, t]);

  const satLightPickerRef = useRef<HTMLDivElement>(null);
  const [isDraggingSatLight, setIsDraggingSatLight] = useState(false);

  const updateSatLightFromEvent = useCallback(
    (
      event:
        | React.MouseEvent<HTMLDivElement>
        | MouseEvent
        | React.TouchEvent<HTMLDivElement>
        | TouchEvent,
    ) => {
      if (!satLightPickerRef.current) return;
      const pickerDiv = satLightPickerRef.current;
      const rect = pickerDiv.getBoundingClientRect();
      let clientX, clientY;
      if ('touches' in event) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
      } else {
        clientX = event.clientX;
        clientY = event.clientY;
      }
      const clickXrelativeToBorderBox = clientX - rect.left;
      const clickYrelativeToBorderBox = clientY - rect.top;
      const clickX = clickXrelativeToBorderBox - pickerDiv.clientLeft;
      const clickY = clickYrelativeToBorderBox - pickerDiv.clientTop;
      const boundedX = Math.min(Math.max(0, clickX), pickerDiv.clientWidth);
      const boundedY = Math.min(Math.max(0, clickY), pickerDiv.clientHeight);
      const newSat =
        pickerDiv.clientWidth > 0
          ? (boundedX / pickerDiv.clientWidth) * 100
          : 0;
      const newLight =
        pickerDiv.clientHeight > 0
          ? 100 - (boundedY / pickerDiv.clientHeight) * 100
          : 50;

      colorStore.setColor({
        mode: 'hsl',
        h: parseFloat(globalHue),
        s: newSat / 100,
        l: newLight / 100,
      });
    },
    [globalHue],
  );

  const handleSatLightPickerMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      setIsDraggingSatLight(true);
      updateSatLightFromEvent(event);
      event.preventDefault();
    },
    [updateSatLightFromEvent],
  );

  const handleSatLightPickerTouchStart = useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      setIsDraggingSatLight(true);
      updateSatLightFromEvent(event);
    },
    [updateSatLightFromEvent],
  );

  // Effect for mouse move/up listeners for dragging Sat/Light picker
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (isDraggingSatLight) updateSatLightFromEvent(event);
    };
    const handleMouseUp = () => {
      if (isDraggingSatLight) setIsDraggingSatLight(false);
    };
    if (isDraggingSatLight) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingSatLight, updateSatLightFromEvent]);

  // Effect for touch move/end listeners for dragging Sat/Light picker
  useEffect(() => {
    const handleTouchMove = (event: TouchEvent) => {
      if (isDraggingSatLight) updateSatLightFromEvent(event);
    };
    const handleTouchEnd = () => {
      if (isDraggingSatLight) setIsDraggingSatLight(false);
    };
    if (isDraggingSatLight) {
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);
      window.addEventListener('touchcancel', handleTouchEnd);
    }
    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [isDraggingSatLight, updateSatLightFromEvent]);

  // Click handler for Sat/Light picker (for non-drag interactions)
  const handleSatLightPickerClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!satLightPickerRef.current) return;
      updateSatLightFromEvent(event);
    },
    [updateSatLightFromEvent],
  );

  // Slider Handlers: Correct dependency arrays
  const handleGlobalHueChange = useCallback(
    (newHue: number) =>
      colorStore.setColor({
        mode: 'hsl',
        h: newHue,
        s: masterColorHsl.s,
        l: masterColorHsl.l,
      }),
    [masterColorHsl],
  ); // Depends on masterColorHsl

  const handleRgbRChange = useCallback(
    (newR: number) =>
      colorStore.setColor({
        mode: 'rgb',
        r: newR / 255,
        g: masterColorRgb.g,
        b: masterColorRgb.b,
      }),
    [masterColorRgb],
  ); // Depends on masterColorRgb
  const handleRgbGChange = useCallback(
    (newG: number) =>
      colorStore.setColor({
        mode: 'rgb',
        r: masterColorRgb.r,
        g: newG / 255,
        b: masterColorRgb.b,
      }),
    [masterColorRgb],
  );
  const handleRgbBChange = useCallback(
    (newB: number) =>
      colorStore.setColor({
        mode: 'rgb',
        r: masterColorRgb.r,
        g: masterColorRgb.g,
        b: newB / 255,
      }),
    [masterColorRgb],
  );

  const handleHslHChange = useCallback(
    (newH: number) =>
      colorStore.setColor({
        mode: 'hsl',
        h: newH,
        s: masterColorHsl.s,
        l: masterColorHsl.l,
      }),
    [masterColorHsl],
  );
  const handleHslSChange = useCallback(
    (newS: number) =>
      colorStore.setColor({
        mode: 'hsl',
        h: masterColorHsl.h,
        s: newS / 100,
        l: masterColorHsl.l,
      }),
    [masterColorHsl],
  );
  const handleHslLChange = useCallback(
    (newL: number) =>
      colorStore.setColor({
        mode: 'hsl',
        h: masterColorHsl.h,
        s: masterColorHsl.s,
        l: newL / 100,
      }),
    [masterColorHsl],
  );

  const handleOklchLChange = useCallback(
    (newL: number) => {
      colorStore.setColor({
        mode: 'oklch',
        l: newL,
        c: masterColorOklch.c,
        h: masterColorOklch.h,
      });
    },
    [masterColorOklch],
  );

  const handleOklchCChange = useCallback(
    (newC: number) => {
      colorStore.setColor({
        mode: 'oklch',
        l: masterColorOklch.l,
        c: newC,
        h: masterColorOklch.h,
      });
    },
    [masterColorOklch],
  );

  const handleOklchHChange = useCallback(
    (newH: number) => {
      colorStore.setColor({
        mode: 'oklch',
        l: masterColorOklch.l,
        c: masterColorOklch.c,
        h: newH,
      });
    },
    [masterColorOklch],
  );

  return {
    masterColor,
    globalHue: parseFloat(globalHue),
    globalSat: internalGlobalSat,
    globalLight: internalGlobalLight,
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
    isDraggingSatLight,
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
  };
}

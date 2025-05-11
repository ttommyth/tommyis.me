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
// currentMasterColorState is the module-level store state, initialized to a default.
// This will be updated by the hook's useEffect on the client if initialColorFromProps is provided.
let currentMasterColorState: CuloriColor = {
  mode: 'hsl',
  h: 210,
  s: 0.6,
  l: 0.6,
};
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
  // initialize and the original getServerSnapshot on colorStore are no longer directly used by useSyncExternalStore in the hook.
  // The hook will provide its own getServerSnapshot.
};
// --- End Color Store Definition ---

export interface UseColorSandboxStateProps {
  initialColor?: CuloriColor; // This prop will come from the server-rendered page
}

export function useColorSandboxState(props?: UseColorSandboxStateProps) {
  const initialColorFromProps = props?.initialColor;
  // Ref to track if the initial prop has been applied to the store,
  // to prevent re-applying if the prop reference changes but value is same,
  // or to ensure it's only applied once if that's the desired logic.
  const initialColorAppliedToStoreRef = useRef(false);

  useEffect(() => {
    // This effect runs on the client.
    // If initialColorFromProps is provided (e.g., from server via props),
    // it updates the client-side store to match.
    if (initialColorFromProps && !initialColorAppliedToStoreRef.current) {
      // Compare to avoid unnecessary updates if store already matches, or simply set.
      // For simplicity here, we set it if ref is false.
      colorStore.setColor(initialColorFromProps);
      initialColorAppliedToStoreRef.current = true;
    }
    // If `initialColorFromProps` itself can change over time (e.g. parent component re-renders with new initialColor),
    // and the store should reflect that, this effect's dependency array and logic would need adjustment.
    // For now, this focuses on the initial hydration scenario.
  }, [initialColorFromProps]);

  const masterColor = useSyncExternalStore(
    colorStore.subscribe,
    colorStore.getSnapshot, // For client-side, reads from the (potentially updated) currentMasterColorState
    // For server-side snapshot:
    // Use initialColorFromProps if it's provided (meaning we are on the server and got it from page.tsx).
    // Otherwise, fall back to the module-level default currentMasterColorState.
    () => initialColorFromProps || currentMasterColorState,
  );

  const t = useTranslations('ColorSandbox.gamutNotes'); // For gamut notes

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
    () => `oklch(${okL} ${okC} ${okH})`,
    [okL, okC, okH],
  );
  const globalPickerColorString = hslString;

  const rgbGamutNote = useMemo(() => {
    const isMasterColorInSrgb = inGamut('rgb')(masterColor);

    if (!isMasterColorInSrgb) {
      return t('sRgbClipped');
    }
    return null;
  }, [masterColor, t]);

  const hslGamutNote = useMemo(() => {
    const isMasterColorInSrgb = inGamut('rgb')(masterColor);

    if (!isMasterColorInSrgb) {
      return t('sRgbClippedHsl');
    }
    return null;
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
      const clickX = Math.min(
        Math.max(0, clickXrelativeToBorderBox - pickerDiv.clientLeft),
        pickerDiv.clientWidth,
      );
      const clickY = Math.min(
        Math.max(0, clickYrelativeToBorderBox - pickerDiv.clientTop),
        pickerDiv.clientHeight,
      );
      const newSat =
        pickerDiv.clientWidth > 0 ? (clickX / pickerDiv.clientWidth) * 100 : 0;
      const newLight =
        pickerDiv.clientHeight > 0
          ? 100 - (clickY / pickerDiv.clientHeight) * 100
          : 50;

      colorStore.setColor({
        mode: 'hsl',
        h: parseFloat(globalHue), // globalHue is derived from masterColorHsl
        s: newSat / 100,
        l: newLight / 100,
      });
    },
    [globalHue], // Depends on globalHue from derived state
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
    [masterColorHsl], // Depends on masterColorHsl from derived state
  );

  const handleRgbRChange = useCallback(
    (newR: number) =>
      colorStore.setColor({
        mode: 'rgb',
        r: newR / 255,
        g: masterColorRgb.g,
        b: masterColorRgb.b,
      }),
    [masterColorRgb], // Depends on masterColorRgb from derived state
  );
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

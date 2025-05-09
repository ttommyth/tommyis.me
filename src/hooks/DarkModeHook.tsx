'use client';
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';
import { Variants, motion } from 'framer-motion';
import { delay } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { useLocalForage } from './LocalForageHook';

export const useDarkMode: () => [
  string | undefined,
  (value: string | undefined) => void,
] = () => {
  const [theme, setTheme, removeTheme, isLoaded] = useLocalForage<
    string | undefined
  >('theme', undefined);
  useEffect(() => {
    if (!isLoaded) return;
    // On page load or when changing themes, best to add inline in `head` to avoid FOUC
    if (
      theme === 'dark' ||
      (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isLoaded, theme]);
  useEffect(() => {
    if (!isLoaded) return;
    if (
      theme == undefined &&
      window?.matchMedia('(prefers-color-scheme: dark)')?.matches
    ) {
      setTheme('dark');
    }
  }, [isLoaded, theme]);
  return [theme ?? undefined, setTheme];
};

export const DarkModeHelper = () => {
  useDarkMode();
  return <></>;
};

const sunVariants = {
  light: {
    opacity: 1,
    rotate: 0,
    scale: 1,
    transition: {
      rotate: {
        duration: 0.4,
        delay: 0.4,
        type: 'spring',
        stiffness: 500,
        mass: 3,
      },
      scale: {
        duration: 0.4,
        delay: 0.4,
        type: 'spring',
        stiffness: 200,
        mass: 1.2,
      },
      opacity: { duration: 0, delay: 0.5 },
    },
  },
  dark: {
    opacity: 0,
    rotate: -45,
    scale: 2.5,
    transition: {
      rotate: { duration: 0, delay: 0.4 },
      scale: { duration: 0.4, type: 'spring', stiffness: 80 },
      opacity: { duration: 0, delay: 0.4 },
    },
  },
};

const moonVariants = {
  dark: {
    opacity: 1,
    rotate: 0,
    skewX: 0,
    skewY: 0,
    y: 0,
    transition: {
      rotate: { duration: 0.3, delay: 0.6, type: 'spring', stiffness: 200 },
      y: { duration: 0.2, delay: 0.5, type: 'spring', stiffness: 200 },
      skewX: { duration: 0.3, delay: 0.6, type: 'spring', stiffness: 200 },
      skewY: { duration: 0.3, delay: 0.6, type: 'spring', stiffness: 200 },
      opacity: { duration: 0 },
    },
  },
  light: {
    opacity: 0,
    rotate: -25,
    skewX: 10,
    skewY: 10,
    y: 25,
    transition: {
      rotate: { duration: 0.3, type: 'spring', stiffness: 200 },
      y: { duration: 0.2, delay: 0.1 },
      skewX: { duration: 0.3, type: 'spring', stiffness: 200 },
      skewY: { duration: 0.3, type: 'spring', stiffness: 200 },
      opacity: { duration: 0, delay: 0.3 },
    },
  },
} satisfies Variants;

export const DarkModeSwitch = () => {
  const [theme, setTheme] = useDarkMode();
  const [targetTheme, setTargetTheme] = useState<string | undefined>(
    theme === 'dark' ? 'light' : 'dark',
  );
  const delayedJob = useRef<ReturnType<typeof delay> | null>(null);

  useEffect(() => {
    setTargetTheme(theme);
  }, [theme]);

  const delayedSetTheme = (value: string | undefined) => {
    if (delayedJob.current) {
      clearTimeout(delayedJob.current);
    }
    setTargetTheme(value);
    delayedJob.current = delay(() => {
      setTheme(value);
    }, 400);
  };
  return (
    <button
      onClick={() => delayedSetTheme(targetTheme == 'light' ? 'dark' : 'light')}
      type="button"
      className="interact relative w-8 h-8 p-0 overflow-hidden rounded-full flex-shrink-0"
    >
      <motion.span
        variants={sunVariants}
        initial={false}
        animate={targetTheme === 'dark' ? 'dark' : 'light'}
        className="absolute left-0 top-0 inset-0 flex items-center justify-center bg-transparent"
      >
        <SunIcon className="w-8 h-8" />
      </motion.span>
      <motion.span
        variants={moonVariants}
        initial={false}
        animate={targetTheme === 'dark' ? 'dark' : 'light'}
        className="absolute left-0 top-0 inset-0 flex items-center justify-center bg-transparent"
      >
        <MoonIcon className="w-8 h-8" />
      </motion.span>
    </button>
  );
};

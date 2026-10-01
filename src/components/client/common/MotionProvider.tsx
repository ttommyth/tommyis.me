'use client';
import { MotionConfig } from 'framer-motion';
import { FC, PropsWithChildren } from 'react';

// Makes every framer-motion animation respect the user's system
// `prefers-reduced-motion` setting: transform/layout animations are
// disabled, opacity fades are kept (per the a11y guidance).
export const MotionProvider: FC<PropsWithChildren> = ({ children }) => {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
};

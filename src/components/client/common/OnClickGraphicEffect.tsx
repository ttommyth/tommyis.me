'use client';
import { motion } from 'framer-motion';
import ClickEffect from 'public/icon/click.svg';
import { useEffect, useState } from 'react';

export const OnClickGraphicEffect = () => {
  const [click, setClick] = useState<{ x: number; y: number } | null>(null);
  useEffect(() => {
    const onClick = (ev: MouseEvent) => {
      setClick({ x: ev.clientX, y: ev.clientY });
    };
    window.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('click', onClick);
    };
  }, []);
  return (
    <>
      {click ? (
        <motion.div
          className="fixed z-50  pointer-events-none origin-center text-default-inverted"
          style={{ left: click?.x, top: click?.y }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: [1, 0], scale: [1.0, 1.35] }}
          exit={{ opacity: 0, scale: 2 }}
          transition={{ ease: 'easeOut', duration: 0.35 }}
          onAnimationComplete={() => setClick(null)}
        >
          <ClickEffect className="w-icon h-icon -translate-x-1/2 -translate-y-1/2 origin-center" />
        </motion.div>
      ) : (
        <></>
      )}
    </>
  );
};

'use client';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/solid';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FC, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

const ImageCarousel: FC<{ images: string[] }> = ({ images }) => {
  const container = useRef<HTMLDivElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<null | 'left' | 'right'>(null);

  const slideVariants = {
    hiddenRight: {
      x: '100%',
      opacity: 0.5,
    },
    hiddenLeft: {
      x: '-100%',
      opacity: 0.5,
    },
    visible: {
      x: '0',
      opacity: 1,
      transition: {
        type: 'spring',
        duration: 1,
      },
    },
    exit: {
      opacity: 0,
      // scale: 0.8,
      transition: {
        duration: 0.5,
      },
    },
  };
  const slidersVariants = {
    hover: {
      scale: 1.2,
      backgroundColor: '#ff00008e',
    },
  };
  const dotsVariants = {
    initial: {
      borderRadius: '0.8rem',
    },
    animate: {
      borderRadius: '0.375rem',
      transition: { duration: 0.35 },
    },
  };

  const dotsContentVariants = {
    initial: {
      y: 5,
      opacity: 0,
      scale: 0,
    },
    animate: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.35 },
    },
  };

  const handleNext = () => {
    setDirection('right');
    setCurrentIndex((prevIndex) =>
      prevIndex + 1 === images.length ? 0 : prevIndex + 1,
    );
  };

  const handlePrevious = () => {
    setDirection('left');

    setCurrentIndex((prevIndex) =>
      prevIndex - 1 < 0 ? images.length - 1 : prevIndex - 1,
    );
  };

  const handleDotClick = (index: number) => {
    setDirection(index > currentIndex ? 'right' : 'left');
    setCurrentIndex(index);
  };

  return (
    <div className="carousel w-full h-full relative" ref={container}>
      <div className="carousel-images relative  overflow-hidden w-full h-full">
        <AnimatePresence>
          <motion.div
            key={currentIndex}
            initial={direction === 'right' ? 'hiddenRight' : 'hiddenLeft'}
            animate="visible"
            exit="exit"
            variants={slideVariants}
            className="absolute w-full h-full"
          >
            {images.map((_, idx) => (
              <Image
                src={images[idx]}
                fill
                alt={'image-' + (idx + 1)}
                key={idx}
                sizes="(max-width: 896px) 100vw, 896px"
                className={twMerge(
                  currentIndex == idx ? 'opacity-100' : 'opacity-0',
                  'object-cover',
                )}
                quality={75}
                placeholder="blur"
                blurDataURL={`/_next/image?url=${images[idx]}&w=64&q=1`}
              />
            ))}
          </motion.div>
        </AnimatePresence>
        <Link
          href={images[currentIndex]}
          target="_blank"
          aria-label="Open image in a new tab"
          className="absolute top-0 right-0 p-2 m-2 bg-default text-default-invert rounded-md !bg-opacity-50 backdrop-blur-md "
        >
          <ArrowTopRightOnSquareIcon className="w-icon h-icon" />
        </Link>
      </div>
      <div className="carousel-indicator absolute bottom-0 flex justify-center left-1/2 -translate-x-1/2 p-1 mb-1 rounded-full gap-2  bg-default text-default-invert">
        <button
          type="button"
          className="cursor-pointer active:scale-95 transition-transform"
          aria-label="Previous image"
          onClick={handlePrevious}
        >
          <ChevronLeftIcon className="w-icon h-icon" />
        </button>
        {images.map((_, index) => (
          <motion.button
            key={index}
            type="button"
            aria-label={`Show image ${index + 1}`}
            aria-current={currentIndex === index ? 'true' : undefined}
            className={`w-icon h-icon bg-default border-default-invert border-2 cursor-pointer flex justify-center items-center`}
            onClick={() => handleDotClick(index)}
            initial="initial"
            animate={currentIndex === index ? 'animate' : 'initial'}
            whileHover="hover"
            variants={dotsVariants}
          >
            <motion.div
              initial="initial"
              animate={currentIndex === index ? 'animate' : 'initial'}
              whileHover="hover"
              variants={dotsContentVariants}
            >
              <ChevronUpIcon className="w-icon h-icon " />
            </motion.div>
          </motion.button>
        ))}

        <button
          type="button"
          className="cursor-pointer active:scale-95 transition-transform"
          aria-label="Next image"
          onClick={handleNext}
        >
          <ChevronRightIcon className="w-icon h-icon" />
        </button>
      </div>
    </div>
  );
};
export default ImageCarousel;

"use client";
import { FC, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon } from "@heroicons/react/24/solid";

const ImageCarousel: FC<{images: string[]}> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<null|"left"|"right">(null);

  const slideVariants = {
    hiddenRight: {
      x: "100%",
      opacity: 0.5,
    },
    hiddenLeft: {
      x: "-100%",
      opacity: 0.5,
    },
    visible: {
      x: "0",
      opacity: 1,
      transition: {
        type:"spring",
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
      backgroundColor: "#ff00008e",
    },
  };
  const dotsVariants = {
    initial: {
      borderRadius: "0.7rem",
    },
    animate: {
      borderRadius: "0.375rem",
      transition: { duration: 0.2 },
    },
  };

  const dotsContentVariants = {
    initial: {
      y:5,
      opacity:0,
      scale:0,
    },
    animate: {
      y:0,
      opacity:1,
      scale:1,
      transition: { duration: 0.2 },
    },
  };

  const handleNext = () => {
    setDirection("right");
    setCurrentIndex((prevIndex) =>
      prevIndex + 1 === images.length ? 0 : prevIndex + 1
    );
  };

  const handlePrevious = () => {
    setDirection("left");

    setCurrentIndex((prevIndex) =>
      prevIndex - 1 < 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleDotClick = (index:number) => {
    setDirection(index > currentIndex ? "right" : "left");
    setCurrentIndex(index);
  };

  return (
    <div className="carousel w-full h-full relative" >
      <div className="carousel-images relative  overflow-hidden w-full h-full">
        <AnimatePresence>
          <motion.div
            key={currentIndex}
            initial={direction === "right" ? "hiddenRight" : "hiddenLeft"}
            animate="visible"
            exit="exit"
            variants={slideVariants}
            className="absolute w-full h-full"
          >
            <Image src={images[currentIndex]} fill alt="" objectFit="contain"/>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="carousel-indicator absolute bottom-0 flex justify-center left-1/2 -translate-x-1/2 p-1 mb-1 rounded-full gap-2  bg-default text-default-invert">
        <div
          className="cursor-pointer"
          onClick={handlePrevious}
        >
          <ChevronLeftIcon className="w-icon h-icon"/>
        </div>
        {images.map((_, index) => (
          <motion.div
            key={index}
            className={`w-icon h-icon bg-default border-default-invert border-2 cursor-pointer flex justify-center items-center`}
            onClick={() => handleDotClick(index)}
            initial="initial"
            animate={currentIndex === index ? "animate" : ""}
            whileHover="hover"
            variants={dotsVariants}
          >
            <motion.div
              key={index}
              onClick={() => handleDotClick(index)}
              initial="initial"
              animate={currentIndex === index ? "animate" : ""}
              whileHover="hover"
              variants={dotsContentVariants}
            >
              <ChevronUpIcon className="w-icon h-icon "/>
            </motion.div>
          </motion.div>
        ))}

        <div
          className="cursor-pointer"
          onClick={handleNext}
        >
          <ChevronRightIcon className="w-icon h-icon"/>
        </div>
      </div>
    </div>
  );
};
export default ImageCarousel;
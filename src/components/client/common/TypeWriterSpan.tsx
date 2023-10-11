import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useState, useEffect, FC, useRef } from "react";

const BlinkingCursor = ()=>{
  return (
    <motion.div
      animate={{
        opacity: [0, 0, 1, 1],
        transition: {
          duration: 1,
          repeat: Infinity,
          repeatDelay: 0,
          ease: "linear",
          times: [0, 0.5, 0.5, 1]
        }
      }}
      className="inline-block h-[1rem] w-[1px] bg-default-invert ml-1"
    />
  );
}

export const TypeWriterSpan: FC<{children: string, showCursor: boolean, onEvent?:(ref: HTMLSpanElement, event:"play"|"complete")=>void}>=({ children, showCursor, onEvent })=>{
  const spanRef = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const displayText = useTransform(rounded, (latest) =>
    children.slice(0, latest)
  );

  useEffect(() => {
    const controls = animate(count, children.length, {
      type: "tween",
      duration: children.length * 0.035,
      ease: "easeInOut",
      onPlay:()=>{
        if(spanRef.current)
          onEvent?.(spanRef.current, "play")
      },
      onComplete: () => {
        if(spanRef.current)
          onEvent?.(spanRef.current, "complete")
        setDone(true);
      }
    });
    return controls.stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <span className="" ref={spanRef}>
      <motion.span>{displayText}</motion.span>
      {showCursor?<BlinkingCursor />:<></>}
    </span>
  );
}

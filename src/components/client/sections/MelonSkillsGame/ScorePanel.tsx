import { animate, useMotionValue, useTransform } from "framer-motion"
import { useEffect, useRef } from "react"

export const ScorePanel = ({ score, bestScore }: { score: number, bestScore?:number }) => {
  
  const nodeRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = nodeRef.current;
    if(!node)
      return;
    const controls = animate(Number.parseInt(node.textContent??"0"), score, {
      duration: 0.35,
      onUpdate(value) {
        node.textContent = value.toFixed(0);
      },
    });

    return () => controls.stop();
  }, [score]);
  return <div className="flex flex-col w-full justify-center items-center border-2 border-default rounded-xl p-2 sm:p-4 relative bg-dotted">
    <span className="absolute top-0 -translate-y-1/2 bg-default px-2 leading-none">Score</span>
    <div className="text-xl sm:text-4xl mt-2 bg-default" ref={nodeRef}>0</div>
    {
      bestScore==undefined?<>
      </>:<>
        <span>Best Score</span>
        <div className="w-full text-center">{bestScore}</div>
      </>
    }
  </div>
}
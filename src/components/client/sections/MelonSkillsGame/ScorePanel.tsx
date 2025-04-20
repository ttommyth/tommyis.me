import { animate } from 'framer-motion';
import { useEffect, useRef } from 'react';

export const ScorePanel = ({
  score,
  bestScore,
}: {
  score: number;
  bestScore?: number;
}) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;
    const currentScore = Number.parseInt(node.textContent ?? '0');
    const scoreDiff = currentScore - score;
    const controls = animate(currentScore, score, {
      duration: 0.35,
      onUpdate(value) {
        node.textContent = value.toFixed(0);
      },
    });
    animate(
      node,
      { scale: [Math.max(Math.min(1.35, (scoreDiff / 50) * 1.1), 1.1), 1] },
      { type: 'spring' },
    );

    return () => controls.stop();
  }, [score]);
  return (
    <div className="flex flex-col w-full justify-center items-center border-2 border-default rounded-xl p-2 sm:p-4 relative bg-dotted">
      <span className="absolute top-0 -translate-y-1/2 bg-default px-2 leading-none">
        Score
      </span>
      <div
        className="text-xl sm:text-4xl mt-2 bg-default"
        ref={nodeRef}
        style={{ scale: 1 }}
      >
        0
      </div>
      {bestScore == undefined ? (
        <></>
      ) : (
        <>
          <span>Best Score</span>
          <div className="w-full text-center">{bestScore}</div>
        </>
      )}
    </div>
  );
};

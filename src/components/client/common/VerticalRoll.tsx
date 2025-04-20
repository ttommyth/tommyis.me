'use client';
import { motion } from 'framer-motion';
import { maxBy } from 'lodash';
import { FC } from 'react';

export const VerticalRoll: FC<{
  messages: string[];
}> = (props) => {
  const { messages } = props;

  return (
    <span className="relative inline-block overflow-hidden">
      <motion.div
        animate={{
          translateY: [
            ...messages.map((_, idx) => `-${100 * idx}%`),
            `-${100 * messages.length}%`,
          ],
        }}
        transition={{
          repeat: Infinity,
          duration: 4 * messages.length,
          ease: 'anticipate',
        }}
        className="h-auto"
      >
        <span className="invisible">{maxBy(messages, (it) => it.length)}</span>
        {messages.map((it, idx) => (
          <span
            className="absolute block"
            style={{ top: `${100 * idx}%` }}
            key={idx}
          >
            {it + ' '}
          </span>
        ))}
        <span
          className="absolute block"
          style={{ top: `${100 * messages.length}%` }}
        >
          {messages[0]}
        </span>
      </motion.div>
    </span>
  );
};

'use client';

import { createSeededRandomMachine, getDistance } from '@/helper/maths';
import Image from 'next/image';
import { FC, useMemo } from 'react';
import { skills, skillsDict } from '../../../data/skills';

export const SkillsPile: FC<{ skills: (typeof skills)[number]['name'][] }> = ({
  skills,
}) => {
  const pileStyles = useMemo(() => {
    const styles: { left: number; top: number }[] = [];
    const generateLocation: (recur?: number) => any = (recur) => {
      const random = createSeededRandomMachine(
        'skills-pile-' + skills.join('-') + recur,
      );
      const target = {
        left: random.next() * 80 + 10,
        top: random.next() * 80 + 10,
      };
      if (
        (recur ?? 0) < 3 &&
        styles.find(
          (it) =>
            getDistance(
              { x: target.left, y: target.top },
              { x: it.left, y: it.top },
            ) < 10,
        )
      ) {
        return generateLocation((recur ?? 0) + 1);
      }
      return target;
    };
    skills.forEach((skill, idx) => {
      styles[idx] = generateLocation();
    });
    return styles.map((it, idx) => ({
      left: it.left + '%',
      top: it.top + '%',
      scale: skillsDict[skills[idx]].weight ?? 1,
    }));
  }, [skills]);
  return (
    <div className="relative w-full h-96 sm:h-64 select-none p-2">
      {skills.map((skill, idx) => (
        <div
          className="absolute bg-default rounded-md p-2 -translate-x-1/2 -translate-y-1/2 hover:z-10 dui-tooltip"
          data-tip={skill}
          key={idx}
          style={pileStyles[idx]}
        >
          <Image
            src={skillsDict[skill].image}
            width={80}
            height={80}
            key={idx}
            alt={skill}
          />
        </div>
      ))}
    </div>
  );
};

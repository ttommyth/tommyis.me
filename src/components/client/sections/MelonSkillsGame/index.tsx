'use client';
import { skills, skillsDict } from '@/data/skills';
import { ArrowRightIcon, FireIcon } from '@heroicons/react/20/solid';
import {
  delay,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
} from 'framer-motion';
import { debounce } from 'lodash';
import Matter, { Bodies, Engine, World } from 'matter-js';
import Image from 'next/image';
import {
  FC,
  Fragment,
  MouseEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ScorePanel } from './ScorePanel';
import { ScoreRecord } from './ScoreRecord';

//sort by interest level desc
const playableSkillNames: (typeof skills)[number]['name'][] = [
  'Raspberry PI',
  'Kotlin',
  'Elastic Search',
  'Cura',
  '.net core',
  'Docker',
  'AWS',
  'Tailwind CSS',
  'React.js',
  'Storybook',
  'Typescript',
];
const collisionCategories = {
  base: 0x0002,
  ghost: 0x0004,
};
const scores = [1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 66];
const ballScale = [0, 6, 12, 20, 28, 36, 46, 56, 66, 78, 90];
const randomFirstNIndex = 5;
const playableSkills = playableSkillNames.map((it, idx) => ({
  ...skillsDict[it],
  gameScoreWeight: idx,
  score: scores[idx],
  createBody: (x: number, y: number, notInGame?: boolean) => {
    return Bodies.circle(x, y, 20 + (ballScale[idx] ?? 0), {
      render: {
        sprite: {
          texture: skillsDict[it].image,
          xScale: 1 / 4 + ((ballScale[idx] ?? 0) * 1) / 40,
          yScale: 1 / 4 + ((ballScale[idx] ?? 0) * 1) / 40,
        },
      },
      isStatic: notInGame ? true : false,
      collisionFilter: {
        category: notInGame
          ? collisionCategories.ghost
          : collisionCategories.base,
      },
      friction: 0.001,
      restitution: 0.8,
      label: '' + idx!,
      mass: 10 + idx! * 4,
    });
  },
}));
export const WatermelonSkillsGame: FC = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const nextSkillBodyRef = useRef<Matter.Body | null>(null);
  const engineRef = useRef<Engine | null>(null);
  const worldRef = useRef<World | null>(null);
  const mouseX = useMotionValue(0);
  const springMouseX = useSpring(mouseX);
  const [disableSpawn, setDisableSpawn] = useState(false);
  const [nextBallIndex, setNextBallIndex] = useState(
    Math.floor(Math.random() * randomFirstNIndex),
  );
  const [nextSecondBallIndex, setNextSecondBallIndex] = useState(
    Math.floor(Math.random() * randomFirstNIndex),
  );
  const nextBallScale = useMotionValue(
    1 / 4 + ((ballScale[nextBallIndex] ?? 0) * 1) / 40,
  );
  const springNextBallScale = useSpring(nextBallScale);
  const [score, setScore] = useState(0);
  const [reset, setReset] = useState(0);
  useScroll({ target: ref });

  useEffect(() => {
    if (!ref) return;
    setScore(0);
    const playableItems = playableSkills.filter(
      (it) => it.gameScoreWeight != undefined,
    );
    const playableItemDict = Object.fromEntries(
      playableItems.map((it) => [it.gameScoreWeight, it]),
    );
    rectRef.current = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      y: 0,
      height: 0,
      width: 0,
      bottom: 0,
      left: 0,
      right: 0,
      top: 0,
      toJSON: () => ({}),
    };
    const rect = rectRef.current;
    // module aliases
    const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite;

    // create an engine
    const engine = Engine.create();

    // create a renderer
    const render = Render.create({
      element: ref.current as HTMLElement,
      engine: engine,
      options: {
        background: 'transparent',
        width: rect.width,
        height: rect.height,
        hasBounds: false,
        wireframes: false,
      },
    });

    // create two boxes and a ground
    const ground = Bodies.rectangle(
      rect.width / 2 + 160,
      rect.height + 80,
      rect.width + 320,
      160,
      {
        render: { opacity: 0 },
        isStatic: true,
        friction: 0.05,
        collisionFilter: { category: collisionCategories.base },
      },
    );
    const wallLeft = Bodies.rectangle(-80, rect.height / 2, 160, rect.height, {
      isStatic: true,
      render: { opacity: 0 },
      collisionFilter: { category: collisionCategories.base },
    });
    const wallRight = Bodies.rectangle(
      rect.width + 80,
      rect.height / 2,
      160,
      1200,
      {
        isStatic: true,
        render: { opacity: 0 },
        collisionFilter: { category: collisionCategories.base },
      },
    );
    // add all of the bodies to the world
    Composite.add(engine.world, [
      ground,
      wallLeft,
      wallRight, //, roof
    ]);

    Matter.Events.on(engine, 'collisionStart', function (event) {
      event.pairs.forEach((pair) => {
        if (pair.bodyA.label == pair.bodyB.label) {
          const higher =
            pair.bodyA.position.y < pair.bodyB.position.y
              ? pair.bodyA
              : pair.bodyB;
          if (
            !Matter.Composite.get(
              engine.world,
              pair.bodyA.id,
              pair.bodyA.type,
            ) ||
            !Matter.Composite.get(engine.world, pair.bodyB.id, pair.bodyB.type)
          )
            return;
          Matter.Composite.remove(engine.world, [pair.bodyA, pair.bodyB]);
          const skill = playableItemDict[parseInt(higher.label) + 1];
          if (skill) {
            delay(() => {
              setScore((s) => s + skill.score);
              const newBody = skill.createBody(
                (pair.bodyA.position.x + pair.bodyB.position.x) / 2,
                (pair.bodyA.position.y + pair.bodyB.position.y) / 2,
              );
              Matter.Body.setVelocity(newBody, {
                x: Math.random() * 5 - 2.5,
                y: -2,
              });
              Matter.Composite.add(engine.world, newBody);
            }, 250);
          }
        }
      });
    });

    // run the renderer
    Render.run(render);

    // create runner
    const runner = Runner.create({
      delta: 1000 / 120, // fixed time step (~16.67ms)
      isFixed: true, // ignore real elapsed time
    });

    // run the engine with fixed-step updates
    Runner.run(runner, engine);

    worldRef.current = engine.world;
    engineRef.current = engine;
    return () => {
      Render.stop(render);
      World.clear(engine.world, false);
      Engine.clear(engine);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (render as any).canvas = null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (render as any).context = null;
      render.textures = {};
    };
  }, [reset, mouseX]);
  useEffect(() => {
    const debouncedCallback = debounce(() => {
      const newRect = ref.current?.getBoundingClientRect();
      if (
        rectRef.current?.width != newRect?.width ||
        rectRef.current?.height != newRect?.height
      )
        setReset(Math.random());
    }, 1000);
    window.addEventListener('resize', debouncedCallback);
    return () => {
      window.removeEventListener('resize', debouncedCallback);
    };
  }, []);
  const handleMouseMove = useCallback<MouseEventHandler>(
    (ev) => {
      const bound = ev.currentTarget.getBoundingClientRect();
      mouseX.set(Math.min(bound.width, ev.clientX - bound.left));
    },
    [mouseX],
  );
  const handleMouseClick = useCallback<MouseEventHandler>(
    (ev) => {
      if (!worldRef.current || disableSpawn) return;
      const bound = ev.currentTarget.getBoundingClientRect();
      const nextSkill = playableSkills[nextBallIndex ?? 0];
      nextSkillBodyRef.current = nextSkill.createBody(
        'ontouchstart' in window ? ev.clientX - bound.left : springMouseX.get(),
        0,
      );

      Matter.Body.setVelocity(nextSkillBodyRef.current, {
        x: springMouseX.getVelocity() / 200,
        y: 0,
      });
      Matter.Composite.add(engineRef.current!.world, nextSkillBodyRef.current);
      setNextBallIndex(nextSecondBallIndex);
      nextBallScale.set(
        1 / 4 + ((ballScale[nextSecondBallIndex] ?? 0) * 1) / 40,
      );
      const randNextBallIndex = Math.floor(Math.random() * randomFirstNIndex);
      setNextSecondBallIndex(randNextBallIndex);
      setDisableSpawn(true);
      delay(() => {
        setDisableSpawn(false);
      }, 350);
    },
    [
      nextBallIndex,
      nextSecondBallIndex,
      disableSpawn,
      nextBallScale,
      springMouseX,
    ],
  );
  return (
    <div className="w-full flex flex-col pt-appbar sm:pt-24 h-[100dvh] sm:h-[90dvh] gap-2">
      <div className="flex flex-col sm:flex-row w-full grow gap-2">
        <div className="flex flex-row sm:flex-col w-full sm:w-64 gap-2 pt-4">
          <ScorePanel score={score} />
          <ScoreRecord />
          <span className="text-xs text-center">
            ⚠️ Resize window will cause game reset ⚠️
          </span>
        </div>
        <div
          className="grow relative mt-12 select-none overflow-visible"
          onMouseMove={handleMouseMove}
          onClick={handleMouseClick}
        >
          <motion.div
            className="absolute -top-12 w-[80px] h-[80px]"
            style={{
              left: springMouseX,
              scale: springNextBallScale,
              translateX: '-50%',
              opacity: disableSpawn ? '50%' : '100%',
            }}
          >
            <Image
              src={playableSkills[nextBallIndex].image}
              alt={playableSkillNames[nextBallIndex]}
              width={80}
              height={80}
              className="object-cover w-[80px] h-[80px]"
            />
          </motion.div>
          <div
            ref={ref}
            className="w-full h-full border-b-2 border-x-2 border-default bg-dotted rounded-b-3xl"
          />
        </div>
      </div>
      <div className="overflow-x-auto overflow-y-clip py-2 h-auto">
        <div className="flex flex-row items-center">
          {playableSkills.map((it, idx) => {
            return (
              <Fragment key={idx}>
                <Image
                  src={it.image}
                  alt={it.name}
                  width={40}
                  height={40}
                  className="object-contain data-[future-ball=true]:border-2 data-[next-ball=true]:border-primary-500 border-default rounded-md p-1 data-[next-second-ball=true]:border-dashed"
                  data-future-ball={
                    nextBallIndex == idx || nextSecondBallIndex == idx
                  }
                  data-next-ball={nextBallIndex == idx}
                  data-next-second-ball={nextSecondBallIndex == idx}
                />
                <ArrowRightIcon className="w-icon h-icon" />
              </Fragment>
            );
          })}
          <FireIcon className="w-icon h-icon" />
        </div>
      </div>
    </div>
  );
};
export default WatermelonSkillsGame;

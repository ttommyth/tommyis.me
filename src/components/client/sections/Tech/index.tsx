'use client';
import {
  ArrowPathIcon,
  FunnelIcon,
  LockClosedIcon,
  LockOpenIcon,
} from '@heroicons/react/24/solid';
import {
  motion,
  useAnimationControls,
  useScroll,
  useVelocity,
} from 'framer-motion';
import { debounce, delay, throttle } from 'lodash';
import Matter, { Mouse, MouseConstraint, World } from 'matter-js';
import MiniSearch from 'minisearch';
import Image from 'next/image';
import Link from 'next/link';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { HiChip, HiViewGrid } from 'react-icons/hi';
import { twMerge } from 'tailwind-merge';
import { readonlySkills, skills } from '../../../../data/skills';

const TechGrid: FC<{
  highlightItems?: string[];
  className?: string;
}> = (props) => {
  const { highlightItems, className } = props;
  const sortedSkills = useMemo(() => {
    const sortedSkills = Object.values(readonlySkills).sort(
      (a, b) => (b.weight ?? 1) - (a.weight ?? 1),
    );
    if (highlightItems) {
      return [
        ...sortedSkills.filter((it) => highlightItems.includes(it.name)),
        ...sortedSkills.filter((it) => !highlightItems.includes(it.name)),
      ];
    }
    return sortedSkills;
  }, [highlightItems]);
  return (
    <div
      className={twMerge(
        'grid pt-16 sm:pt-1 grid-cols-3 sm:grid-cols-2 md:grid-cols-3 items-center justify-center p-1 gap-2 overflow-y-auto max-h-full',
        className,
      )}
    >
      {sortedSkills.map((it, idx) => (
        <motion.div
          layoutId={`tech-grid-${it.name}-${idx}`}
          animate={{
            opacity: highlightItems
              ? highlightItems.includes(it.name)
                ? 1
                : 0.2
              : 1,
          }}
          className={twMerge('flex flex-col justify-end items-center')}
          key={it.name}
        >
          <div className="relative" style={{ width: '50px', height: '50px' }}>
            <Image
              src={it.image}
              alt={it.name}
              fill
              className="object-contain"
              priority={true}
            />
          </div>
          <span className="text-xs">{it.name}</span>
        </motion.div>
      ))}
    </div>
  );
};
const TechPlayground: FC<{
  highlightItems?: string[];
}> = (props) => {
  const { highlightItems } = props;

  const ref = useRef<HTMLDivElement | null>(null);
  const bodyRef = useRef<{ [key: string]: Matter.Body }>({});
  const rectRef = useRef<DOMRect | null>(null);
  const [locked, setLocked] = useState(true);
  const [reset, setReset] = useState(0);
  const { scrollY } = useScroll({
    target: ref,
  });
  const scrollYVelocity = useVelocity(scrollY);
  useEffect(() => {
    if (!ref) return;
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
        wireframes: false,
      },
    });

    // create two boxes and a ground
    const ground = Bodies.rectangle(
      rect.width / 2 + 160,
      rect.height + 80,
      rect.width + 320,
      160,
      { render: { opacity: 0 }, isStatic: true },
    );
    const wallLeft = Bodies.rectangle(-80, rect.height / 2, 160, rect.height, {
      isStatic: true,
      render: { opacity: 0 },
    });
    const wallRight = Bodies.rectangle(
      rect.width + 80,
      rect.height / 2,
      160,
      1200,
      { isStatic: true, render: { opacity: 0 } },
    );
    const roof = Bodies.rectangle(
      rect.width / 2 + 160,
      -80,
      rect.width + 320,
      160,
      { isStatic: true, render: { opacity: 0 } },
    );
    // add all of the bodies to the world
    Composite.add(engine.world, [ground, wallLeft, wallRight, roof]);

    const boxes = readonlySkills.map((skill, idx) =>
      Bodies.rectangle(
        80 + (Math.random() * rect.width) / 2,
        100 + 20 + 40 * Math.random(),
        80 * (skill.weight ?? 1),
        80 * (skill.weight ?? 1),
        {
          render: {
            sprite: {
              texture: skill.image,
              xScale: 1 * (skill.weight ?? 1),
              yScale: 1 * (skill.weight ?? 1),
            },
          },
          mass: 10,
        },
      ),
    );
    bodyRef.current = Object.fromEntries(
      boxes.map((box, idx) => [readonlySkills[idx].name, box]),
    );
    Composite.add(engine.world, boxes);

    // add mouse control
    const mouse = Mouse.create(render.canvas),
      mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.1,
          render: {
            visible: false,
          },
        },
      });

    World.add(engine.world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;
    // run the renderer
    Render.run(render);

    // create runner
    const runner = Runner.create({
      delta: 1000 / 120, // fixed time step (~16.67ms)
      isFixed: true, // ignore real elapsed time
    });

    // run the engine
    Runner.run(runner, engine);
    return () => {
      Render.stop(render);
      World.clear(engine.world, false);
      Engine.clear(engine);
      render.canvas.remove();
      (render as any).canvas = null;
      (render as any).context = null;
      render.textures = {};
    };
  }, [reset]);
  useEffect(() => {
    if (bodyRef.current) {
      Object.entries(bodyRef.current).forEach(([key, body]) => {
        body.render.opacity = highlightItems
          ? highlightItems.includes(key)
            ? 1
            : 0.2
          : 1;
        if (highlightItems?.length == 1 && highlightItems.includes(key)) {
          Matter.Body.rotate(body, -body.angle);
          Matter.Body.setMass(body, 1000);
          Matter.Body.setVelocity(body, { x: 0, y: -50 });
          delay(() => {
            body.frictionAir = 1;
          }, 500);
          delay(() => {
            body.frictionAir = 0.01;
            Matter.Body.setMass(body, 10);
          }, 2000);
        }
      });
    }
  }, [highlightItems]);
  useEffect(() => {
    const debouncedCallback = debounce(() => {
      const newRect = ref.current?.getBoundingClientRect();
      if (
        rectRef.current?.width != newRect?.width ||
        rectRef.current?.height != newRect?.height
      )
        setReset(Math.random());
    }, 500);
    window.addEventListener('resize', debouncedCallback);
    return () => {
      window.removeEventListener('resize', debouncedCallback);
    };
  }, []);
  useEffect(() => {
    const debouncedCallback = throttle((ev) => {
      const velocity = scrollYVelocity.get();
      Object.entries(bodyRef.current).forEach(([key, body]) => {
        Matter.Body.setVelocity(body, {
          x: 0,
          y: Math.min(20, Math.abs(velocity) / 200) * (velocity > 0 ? -1 : 1),
        });
      });
    }, 10);
    window.addEventListener('scroll', debouncedCallback);
    return () => {
      window.removeEventListener('scroll', debouncedCallback);
    };
  }, [scrollYVelocity]);
  return (
    <>
      <div ref={ref} className="w-full h-full"></div>
      <button
        className="absolute top-32 sm:top-2 right-2"
        onClick={(ev) => setReset(Math.random())}
      >
        <ArrowPathIcon className=" w-8 h-8" />
      </button>
      <Link
        href="/melongame"
        className="absolute top-32 block sm:hidden left-2 z-20"
      >
        <span className=" text-xl p-2 text-gray-500">🍉 GAME</span>
      </Link>
      <div
        className={twMerge(
          locked ? 'block' : 'hidden',
          'absolute sm:hidden left-0 top-0 bottom-0 right-0  z-10 bg-dotted-glass opacity-50 transition',
        )}
      />
      <button
        className="absolute right-2 bottom-2 z-10 block sm:hidden rounded-full bg-primary-500/80 p-2"
        onClick={(ev) => setLocked((v) => !v)}
      >
        {locked ? (
          <LockClosedIcon className=" w-8 h-8" />
        ) : (
          <LockOpenIcon className=" w-8 h-8" />
        )}
      </button>
    </>
  );
};

const FilterInput: FC<{
  value: string;
  setValue: (v: string) => void;
  layoutFormat: 'playground' | 'grid';
  setLayoutFormat: (v: 'playground' | 'grid') => void;
}> = ({ value, setValue, layoutFormat, setLayoutFormat }) => {
  const controls = useAnimationControls();

  return (
    <span className="relative">
      <input
        className=" w-full text-xl pl-10 pr-10"
        type="text"
        value={value}
        onChange={(ev) => setValue(ev.target.value)}
        placeholder="Filter..."
        onInput={(ev) => controls.start('play')}
      />
      <motion.div
        className="absolute left-2 top-0 bottom-0 flex justify-center items-center"
        animate={controls}
        variants={{
          play: {
            scaleX: [0.8, 1],
            scaleY: [1.2, 1],
            transition: { ease: 'anticipate', duration: 0.35 },
          },
        }}
      >
        <FunnelIcon className="w-icon h-icon" />
      </motion.div>
      <button
        type="button"
        className="right-4 top-1/2  -translate-y-1/2 absolute"
        onClick={(ev) =>
          setLayoutFormat(layoutFormat == 'playground' ? 'grid' : 'playground')
        }
      >
        <div className="interact">
          {layoutFormat == 'playground' ? (
            <HiChip className="w-icon h-icon" />
          ) : (
            <HiViewGrid className="w-icon h-icon" />
          )}
        </div>
      </button>
    </span>
  );
};
export const Tech: FC<{}> = (props) => {
  const [layoutFormat, setLayoutFormat] = useState<'playground' | 'grid'>(
    'playground',
  );

  const minisearch = useMemo(() => {
    const ms = new MiniSearch({
      idField: 'name',
      fields: ['name', 'description', 'alias'], // fields to index for full-text search
      storeFields: ['name', 'description', 'alias'], // fields to return with search results
    });
    ms.addAll(skills);
    return ms;
  }, []);
  const [searchText, setSearchText] = useState('');
  const matchTarget = useMemo(() => {
    return minisearch.search(searchText, {
      prefix: true,
      fuzzy: 0.2,
    });
  }, [minisearch, searchText]);
  // console.log(matchTarget);
  // const scroll = useScroll({target: ref,
  //   offset: ["end end", "start start"]});
  // const rotateY = useTransform(scroll.scrollYProgress, [0,1], ['-350px', '350px']);

  return (
    <div className="flex flex-col sm:flex-row justify-center items-center h-full">
      <div className="w-[320px] h-[100dvh] sm:h-[80dvh] bg-dotted border-2 border-default rounded-xl overflow-hidden relative pt-appbar sm:pt-0">
        {layoutFormat == 'playground' ? (
          <TechPlayground
            highlightItems={
              searchText ? matchTarget.map((it) => it.name) : undefined
            }
          />
        ) : (
          <></>
        )}
        <TechGrid
          highlightItems={
            searchText ? matchTarget.map((it) => it.name) : undefined
          }
          className={twMerge(
            'pt-appbar sm:pt-0',
            layoutFormat == 'playground' ? 'hidden' : '',
          )}
        />

        <div className="block sm:hidden grow w-full px-2 py-2 absolute top-appbar z-10">
          <FilterInput
            value={searchText}
            setValue={setSearchText}
            layoutFormat={layoutFormat}
            setLayoutFormat={setLayoutFormat}
          />
        </div>
      </div>
      <div className="hidden sm:flex grow flex-col p-8 gap-8">
        <h2 className="text-4xl font-extrabold flex items-center">
          <span className="mr-2">⬅️ My Skill set </span>
          <Link href="/melongame">
            <span className=" text-xl p-2 text-gray-500">🍉 GAME</span>
          </Link>
        </h2>
        <FilterInput
          value={searchText}
          setValue={setSearchText}
          layoutFormat={layoutFormat}
          setLayoutFormat={setLayoutFormat}
        />
      </div>
    </div>
  );
};

export default Tech;

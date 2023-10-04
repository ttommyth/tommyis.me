"use client";
import styles from "@/styles/box.module.scss";
import { ArrowPathIcon, LockClosedIcon, LockOpenIcon } from "@heroicons/react/24/solid";
import { motion, useDragControls, useScroll, useTransform } from "framer-motion";
import Matter, { Composites, Mouse, MouseConstraint, World } from "matter-js";
import { FC, useEffect, useRef, useState } from "react"
import { twMerge } from "tailwind-merge";

const skills: {name:string, image:string, weight?:number}[]=[
  {
    name: "React.js",
    image: "/image/skill/react.png",
  },
  {
    name: "Next.js",
    image: "/image/skill/nextjs.png"
  },
  {
    name: "Tailwind CSS",
    image: "/image/skill/tailwindcss.png"
  },
  {
    name: "Expo",
    image: "/image/skill/expo.png"
  },
  {
    name: "AWS",
    image: "/image/skill/aws.png",
    weight: 0.7
  },
  {
    name: "React Native",
    image: "/image/skill/react.png",
    weight: 0.5
  },
  {
    name: "Docker",
    image: "/image/skill/docker.png"
  },
  {
    name: "Cloudflare",
    image: "/image/skill/cloudflare.png",
    weight: 0.7
  },
  {
    name: "C#",
    image: "/image/skill/csharp.png"
  },
  {
    name: "Typescript",
    image: "/image/skill/typescript.png"
  },
  {
    name: "Jest",
    image: "/image/skill/jest.png",
    weight: 0.5
  },
  {
    name: ".net core",
    image: "/image/skill/dotnetcore.png",
    weight: 0.5
  },
  {
    name: "Kotlin",
    image: "/image/skill/kotlin.png",
    weight: 0.5
  },
  {
    name: "Playwright",
    image: "/image/skill/playwright.png"
  },
  {
    name: "Raspberry PI",
    image: "/image/skill/rpi.png",
    weight: 0.5
  },
  {
    name: "Storybook",
    image: "/image/skill/storybook.png",
    weight: 0.7
  },
  {
    name: "Nx",
    image: "/image/skill/nx.png"
  },
  {
    name: "Cura",
    image: "/image/skill/cura.png",
    weight: 0.5
  },
]

const TechPlayground = ()=>{
  const ref = useRef<HTMLDivElement | null>(null);
  const [locked, setLocked] = useState(true);
  const [reset, setReset] = useState(0);
  useEffect(()=>{
    if(!ref)
      return;
    const rect = ref.current?.getBoundingClientRect()??{x:0,y:0,height:0,width:0};
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
      options:{
        background: "transparent",
        width: rect.width,
        height: rect.height,
        wireframes: false
      }
    });

    // create two boxes and a ground
    const ground = Bodies.rectangle(
      (rect.width / 2) + 160, rect.height + 80, rect.width + 320, 160,{render: { fillStyle: '#080808'}, isStatic: true });
    const wallLeft = Bodies.rectangle( -80, rect.height / 2, 160,   rect.height, { isStatic: true });
    const wallRight = Bodies.rectangle(rect.width + 80, rect.height / 2, 160, 1200, { isStatic: true })
    const roof = Bodies.rectangle(
      (rect.width / 2) + 160, -80, rect.width + 320, 160, { isStatic: true })
    // add all of the bodies to the world
    Composite.add(engine.world, [
      ground, wallLeft, wallRight, roof
    ]);

    Composite.add(engine.world,      
      skills.map((skill,idx)=>Bodies.rectangle(40+idx,100 + 20*Math.random(), 80*(skill.weight??1), 80*(skill.weight??1), {
        render: {
          sprite: {
            texture: skill.image,
            xScale: 1*(skill.weight??1),
            yScale: 1*(skill.weight??1)
          }
        }
      })),
    )

    // add mouse control
    const mouse = Mouse.create(render.canvas),
      mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.1,
          render: {
            visible: false
          }
        }
      });

    World.add(engine.world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;
    // run the renderer
    Render.run(render);

    // create runner
    const runner = Runner.create();

    // run the engine
    Runner.run(runner, engine);
    return ()=>{
      Render.stop(render);
      Runner.stop(runner);
      Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
    }
  }, [reset])
  return <>
    <div ref={ref} className="w-full h-full">

    </div>
    <button className="absolute top-2 right-2" onClick={ev=>setReset(Math.random())}><ArrowPathIcon className=" w-8 h-8" /></button>
    <div className={twMerge(locked?"block": "hidden", "absolute sm:hidden left-0 top-0 bottom-0 right-0  z-10 bg-dotted-glass opacity-50 transition")} />
    <button className="absolute right-2 bottom-2 z-10 block sm:hidden rounded-full bg-primary-500 p-2" onClick={ev=>setLocked(v=>!v)}>{locked?<LockOpenIcon className=" w-8 h-8"  />:<LockClosedIcon className=" w-8 h-8" />}</button>
  </>
}

export const Tech:FC<{}> = (props)=>{
  const controls = useDragControls()
  // const scroll = useScroll({target: ref,
  //   offset: ["end end", "start start"]});
  // const rotateY = useTransform(scroll.scrollYProgress, [0,1], ['-350px', '350px']);
  return <div className="flex flex-col sm:flex-row justify-center items-center h-full pt-8 sm:pt-0">
    <div className="w-[320px] h-[80dvh] bg-dotted border-2 border-base-300 dark:border-base-900 rounded-xl overflow-hidden relative">
      <TechPlayground />
    </div>
    <div className="hidden sm:flex grow flex-col p-8 gap-8">
      <h2 className="text-4xl font-extrabold">⬅️ My Skill set</h2>
      <input className=" w-full text-xl" type="text" placeholder="search" />
    </div>
    <div className="block sm:hidden grow w-full px-2 py-2">
      <input className=" w-full" type="text"  placeholder="search"  />
    </div>
  </div>
}
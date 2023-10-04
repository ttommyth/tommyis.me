"use client";
import styles from "@/styles/box.module.scss";
import { motion, useDragControls, useScroll, useTransform } from "framer-motion";
import Matter, { Composites, Mouse, MouseConstraint, World } from "matter-js";
import { FC, useEffect, useRef } from "react"
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
]

const TechPlayground = ()=>{
  const ref = useRef<HTMLDivElement | null>(null);
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
      skills.map((skill,idx)=>Bodies.rectangle(40+idx,100, 80*(skill.weight??1), 80*(skill.weight??1), {
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
  }, [])
  return <div ref={ref} className="w-full h-full">

  </div>
}

export const Tech:FC<{}> = (props)=>{
  const controls = useDragControls()
  // const scroll = useScroll({target: ref,
  //   offset: ["end end", "start start"]});
  // const rotateY = useTransform(scroll.scrollYProgress, [0,1], ['-350px', '350px']);
  return <div className="flex flex-col sm:flex-row justify-center items-center h-full">
    <div className="w-[320px] h-[80dvh] bg-dotted border-2 border-base-300 dark:border-base-900 rounded-xl overflow-hidden">
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
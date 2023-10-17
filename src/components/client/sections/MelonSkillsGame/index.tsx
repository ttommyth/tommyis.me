"use client";
import { skills, skillsDict } from "@/data/skills";
import { ArrowPathIcon, LockClosedIcon, LockOpenIcon } from "@heroicons/react/24/solid";
import { useScroll, useVelocity, delay } from "framer-motion";
import { debounce, throttle } from "lodash";
import Matter, { Bodies, Body, Mouse, MouseConstraint, World } from "matter-js";
import next from "next";
import { FC, useRef, useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";

//sort by interest level desc
const playableSkillNames: ((typeof skills[number])["name"])[] = [
  "Raspberry PI",
  "Kotlin",
  "Elastic Search",
  "C#",
  ".net core",
  "Docker",
  "AWS",  
  "Tailwind CSS",
  "React.js",
  "Next.js",
  "Typescript"
]
const ballScale = [0, 6, 12, 20, 28, 36, 46, 56, 66, 78, 90];
const playableSkills = playableSkillNames.map((it,idx)=>({...skillsDict[it], gameScoreWeight: idx,
  createBody: (x:number, y: number)=>{
    return Bodies.circle(x,y, 20+(ballScale[idx]??0), {
      render: {
        sprite: {
          texture: skillsDict[it].image,
          xScale: 1/4 + (ballScale[idx]??0) * 1/40,
          yScale: 1/4 + (ballScale[idx]??0) * 1/40
        }
      },
      label: ""+idx!,
      mass: 10+(idx!*4),
    })
  }}));
export const WatermelonSkillsGame:FC<{
  highlightItems?: string[]
}> = (props)=>{
  const {highlightItems} = props;
  
  const ref = useRef<HTMLDivElement | null>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const [locked, setLocked] = useState(true);
  const [reset, setReset] = useState(0);
  const { scrollY } = useScroll({
    target: ref,
  });
  const scrollYVelocity = useVelocity(scrollY);
  useEffect(()=>{
    if(!ref)
      return;
    const playableItems = playableSkills.filter(it=>it.gameScoreWeight!=undefined);
    const playableItemDict = Object.fromEntries(playableItems.map(it=>[it.gameScoreWeight, it]));
    rectRef.current = ref.current?.getBoundingClientRect()??{x:0,y:0,height:0,width:0, bottom:0, left:0, right:0, top:0, toJSON:()=>({})};
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
      options:{
        background: "transparent",
        width: rect.width,
        height: rect.height,
        wireframes: false,
      }
    });

    // create two boxes and a ground
    const ground = Bodies.rectangle(
      (rect.width / 2) + 160, rect.height + 80, rect.width + 320, 160,{render: { opacity: 0 }, isStatic: true, friction:0.05 });
    const wallLeft = Bodies.rectangle( -80, rect.height / 2, 160,   rect.height, { isStatic: true, render: { opacity: 0 } });
    const wallRight = Bodies.rectangle(rect.width + 80, rect.height / 2, 160, 1200, { isStatic: true, render: { opacity: 0 } })
    const roof = Bodies.rectangle(
      (rect.width / 2) + 160, -80, rect.width + 320, 160, { isStatic: true, render: { opacity: 0 }, collisionFilter: { group: -1 } })
    // add all of the bodies to the world
    Composite.add(engine.world, [
      ground, wallLeft, wallRight, roof
    ]);

    const boxes = [...playableItems, ...playableItems, ...playableItems]
      .map((skill,idx)=>skill.createBody(40+ (Math.random()*rect.width),100 + 20+ 40*Math.random()));
    Composite.add(engine.world,      
      boxes
    )
    Matter.Events.on(engine, "collisionActive", function (event) {
      console.log(event, [...event.pairs]);
      event.pairs.forEach(pair=>{
        if(pair.bodyA.label == pair.bodyB.label){
          const higher = pair.bodyA.position.y < pair.bodyB.position.y?pair.bodyA:pair.bodyB;
          Matter.Composite.remove(engine.world, [pair.bodyA, pair.bodyB]);
          const skill = playableItemDict[parseInt(higher.label)+1];
          if(skill){
            delay(()=>{
              Matter.Composite.add(engine.world, skill.createBody((pair.bodyA.position.x + pair.bodyB.position.x )/2, (pair.bodyA.position.y + pair.bodyB.position.y )/2));
            }, 150);
          }
        }
      })
    });
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
      World.clear(engine.world, false);
      Engine.clear(engine);
      render.canvas.remove();
      (render as any).canvas = null;
      (render as any).context = null;
      render.textures = {};
    }
  }, [reset]);
  useEffect(()=>{
    const debouncedCallback = debounce(()=>{
      const newRect = ref.current?.getBoundingClientRect()
      if(rectRef.current?.width != newRect?.width || rectRef.current?.height != newRect?.height)
        setReset(Math.random());
    }, 500);
    window.addEventListener("resize", debouncedCallback);
    return ()=>{
      window.removeEventListener("resize", debouncedCallback);
    }
  },[])
  return <div className="w-full flex-col sm:flex-row  pt-appbar sm:pt-0 h-[80dvh]">
    <div ref={ref} className="w-full h-full bg-base-200" >

    </div>
  </div>
}
export default WatermelonSkillsGame;
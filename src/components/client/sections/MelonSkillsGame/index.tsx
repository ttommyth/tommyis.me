"use client";
import { skills, skillsDict } from "@/data/skills";
import { ArrowPathIcon, LockClosedIcon, LockOpenIcon } from "@heroicons/react/24/solid";
import { useScroll, useVelocity, delay, useMotionValue, motion } from "framer-motion";
import { debounce, throttle } from "lodash";
import Matter, { Bodies, Body, Mouse, MouseConstraint, Sleeping, World } from "matter-js";
import next from "next";
import { FC, useRef, useState, useEffect, useMemo, MouseEventHandler, useCallback, use } from "react";
import { twMerge } from "tailwind-merge";
import { ScorePanel } from "./ScorePanel";
import { ScoreRecord } from "./ScoreRecord";
import Image from 'next/image';

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
const collisionCategories = {
  "base": 0x0002,
  "ghost": 0x0004,
}
const scores = [1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 66];
const ballScale = [0, 6, 12, 20, 28, 36, 46, 56, 66, 78, 90];
const playableSkills = playableSkillNames.map((it,idx)=>({...skillsDict[it], gameScoreWeight: idx,
  score: scores[idx],
  createBody: (x:number, y: number, notInGame?:boolean)=>{
    return Bodies.circle(x,y, 20+(ballScale[idx]??0), {
      render: {
        sprite: {
          texture: skillsDict[it].image,
          xScale: 1/4 + (ballScale[idx]??0) * 1/40,
          yScale: 1/4 + (ballScale[idx]??0) * 1/40
        }
      },
      isStatic:notInGame?true:false,
      collisionFilter:{
        category: notInGame? collisionCategories.ghost: collisionCategories.base,
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
  const nextSkillBodyRef = useRef<Matter.Body | null>(null);
  const worldRef = useRef<World|null>(null);
  const mouseX = useMotionValue(0);
  const [nextBallIndex, setNextBallIndex] = useState(Math.floor(Math.random()*playableSkills.length)); 
  const [score, setScore] = useState(0);
  const [reset, setReset] = useState(0);
  const { scrollY } = useScroll({
    target: ref,
  });
  
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
        hasBounds:false,
        wireframes:false
      }
    });

    // create two boxes and a ground
    const ground = Bodies.rectangle(
      (rect.width / 2) + 160, rect.height + 80, rect.width + 320, 160,{render: { opacity: 0 }, isStatic: true, friction:0.05, collisionFilter: {category: collisionCategories.base} });
    const wallLeft = Bodies.rectangle( -80, rect.height / 2, 160,   rect.height, { isStatic: true, render: { opacity: 0 }, collisionFilter: {category: collisionCategories.base} });
    const wallRight = Bodies.rectangle(rect.width + 80, rect.height / 2, 160, 1200, { isStatic: true, render: { opacity: 0 }, collisionFilter: {category: collisionCategories.base} })
    const roof = Bodies.rectangle(
      (rect.width / 2) + 160, -80, rect.width + 320, 160, { isStatic: true, render: { opacity: 0 } })
    // add all of the bodies to the world
    Composite.add(engine.world, [
      ground, wallLeft, wallRight//, roof
    ]);

    const boxes = [...playableItems, ...playableItems, ...playableItems] //TODO: tmp
      .map((skill,idx)=>skill.createBody(40+ (Math.random()*rect.width),100 + 20+ 40*Math.random()));
    Composite.add(engine.world,      
      boxes
    )
    Matter.Events.on(engine, "collisionActive", function (event) {
      event.pairs.forEach(pair=>{
        if(pair.bodyA.label == pair.bodyB.label){
          const higher = pair.bodyA.position.y < pair.bodyB.position.y?pair.bodyA:pair.bodyB;
          Matter.Composite.remove(engine.world, [pair.bodyA, pair.bodyB]);
          const skill = playableItemDict[parseInt(higher.label)+1];
          if(skill){
            delay(()=>{
              setScore(s=>s+skill.score);
              Matter.Composite.add(engine.world, skill.createBody((pair.bodyA.position.x + pair.bodyB.position.x )/2, (pair.bodyA.position.y + pair.bodyB.position.y )/2));
            }, 150);
          }
        }
      })
    });
    // add mouse control
    // const mouse = Mouse.create(render.canvas),
    //   mouseConstraint = MouseConstraint.create(engine, {
    //     mouse: mouse,
    //     constraint: {
    //       stiffness: 0.1,
    //       render: {
    //         visible: false
    //       }
    //     }
    //   });

    // World.add(engine.world, mouseConstraint);

    // keep the mouse in sync with rendering
    // render.mouse = mouse;
    // run the renderer
    Render.run(render);

    // create runner
    const runner = Runner.create();

    // run the engine
    Runner.run(runner, engine);

    // const nextSkill = playableSkills[nextBallIndex??0];
    // nextSkillBodyRef.current = nextSkill.createBody(0, 0, true);
    // nextSkillBodyRef.current.position.y = nextSkillBodyRef.current.circleRadius!/2;
    // Matter.Composite.add(engine.world, nextSkillBodyRef.current);
    // mouseX.on("change", (v)=>{
    //   if(nextSkillBodyRef.current)
    //     nextSkillBodyRef.current.position.x = v;
    // });
    worldRef.current = engine.world;
    return ()=>{
      Render.stop(render);
      World.clear(engine.world, false);
      Engine.clear(engine);
      render.canvas.remove();
      (render as any).canvas = null;
      (render as any).context = null;
      render.textures = {};
      mouseX.clearListeners();
    }
  }, [reset, mouseX]);
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
  const handleMouseMove = useCallback<MouseEventHandler>((ev)=>{
    mouseX.set(ev.clientX - ev.currentTarget.getBoundingClientRect().left);
  }, [mouseX]);
  const handleMouseClick = useCallback<MouseEventHandler>((ev)=>{
    if(!worldRef.current)
      return;
    const nextSkill = playableSkills[nextBallIndex??0];
    nextSkillBodyRef.current = nextSkill.createBody(ev.clientX - ev.currentTarget.getBoundingClientRect().left, 0);
    nextSkillBodyRef.current.position.y = nextSkillBodyRef.current.circleRadius!*1;
    // nextSkillBodyRef.current.velocity.x = 0;
    // nextSkillBodyRef.current.velocity.y = 0;
    Matter.Composite.add(worldRef.current, nextSkillBodyRef.current);
    setNextBallIndex(Math.floor(Math.random()*playableSkills.length));

  }, []);
  return <div className="w-full flex flex-col pt-appbar sm:pt-24 h-[90dvh] gap-2">
    <div className="flex flex-col sm:flex-row w-full grow gap-2">
      <div className="flex flex-row sm:flex-col w-64 gap-2">
        <ScorePanel score={score} bestScore={1}/>
        <ScoreRecord />
      </div>
      <div className="grow relative mt-12" onMouseMove={handleMouseMove} onClick={handleMouseClick}>
        <motion.div className="absolute top-0" style={{left: mouseX}}>
          <Image src={playableSkills[nextBallIndex].image} alt={playableSkillNames[nextBallIndex]} width={80} height={80} className=""  />
        </motion.div>
        <div ref={ref} className="w-full h-full border-b-2 border-x-2 border-default bg-dotted rounded-b-3xl" />
      </div>
    </div>
    {/* <div className="h-8 w-full bg-red-500">test</div> */}
  </div>
}
export default WatermelonSkillsGame;
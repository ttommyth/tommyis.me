"use client";
import styles from "@/styles/box.module.scss";
import { AdjustmentsHorizontalIcon, ArrowPathIcon, FunnelIcon, LockClosedIcon, LockOpenIcon } from "@heroicons/react/24/solid";
import { motion, useDragControls, useScroll, useTransform, useVelocity } from "framer-motion";
import { debounce, throttle } from "lodash";
import Matter, { Composites, Mouse, MouseConstraint, World } from "matter-js";
import MiniSearch from "minisearch";
import { FC, useEffect, useMemo, useRef, useState } from "react"
import { twMerge } from "tailwind-merge";
import { skills } from "../utils/Skills";

const TechPlayground:FC<{
  highlightItems?: string[]
}> = (props)=>{
  const {highlightItems} = props;
  
  const ref = useRef<HTMLDivElement | null>(null);
  const bodyRef = useRef<{[key: string]: Matter.Body}>({});
  const [locked, setLocked] = useState(true);
  const [reset, setReset] = useState(0);
  const { scrollY } = useScroll({
    target: ref,
  });
  const scrollYVelocity = useVelocity(scrollY);
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
      (rect.width / 2) + 160, rect.height + 80, rect.width + 320, 160,{render: { opacity: 0 }, isStatic: true });
    const wallLeft = Bodies.rectangle( -80, rect.height / 2, 160,   rect.height, { isStatic: true, render: { opacity: 0 } });
    const wallRight = Bodies.rectangle(rect.width + 80, rect.height / 2, 160, 1200, { isStatic: true, render: { opacity: 0 } })
    const roof = Bodies.rectangle(
      (rect.width / 2) + 160, -80, rect.width + 320, 160, { isStatic: true, render: { opacity: 0 } })
    // add all of the bodies to the world
    Composite.add(engine.world, [
      ground, wallLeft, wallRight, roof
    ]);

    const boxes = skills.map((skill,idx)=>Bodies.rectangle(80+ (Math.random()*rect.width/2),100 + 20+ 40*Math.random(), 80*(skill.weight??1), 80*(skill.weight??1), {
      render: {
        sprite: {
          texture: skill.image,
          xScale: 1*(skill.weight??1),
          yScale: 1*(skill.weight??1)
        }
      }
    }));
    bodyRef.current = Object.fromEntries(boxes.map((box,idx)=>[skills[idx].name, box]));
    Composite.add(engine.world,      
      boxes
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
      World.clear(engine.world, false);
      Engine.clear(engine);
      render.canvas.remove();
      (render as any).canvas = null;
      (render as any).context = null;
      render.textures = {};
    }
  }, [reset]);
  useEffect(()=>{
    if(bodyRef.current){
      Object.entries(bodyRef.current).forEach(([key, body])=>{
        body.render.opacity =highlightItems? highlightItems.includes(key)?1:0.2 : 1;
        if(highlightItems?.length==1 && highlightItems.includes(key)){
          Matter.Body.rotate(body, -body.angle)
          Matter.Body.setVelocity(body, {x:0, y:-10})
        }
      });
    }
  }, [highlightItems])
  useEffect(()=>{
    const debouncedCallback = debounce(()=>{
      setReset(Math.random());
    }, 500);
    window.addEventListener("resize", debouncedCallback);
    return ()=>{
      window.removeEventListener("resize", debouncedCallback);
    }
  },[])
  useEffect(()=>{
    const debouncedCallback = throttle((ev)=>{
      const velocity = scrollYVelocity.get();
      Object.entries(bodyRef.current).forEach(([key, body])=>{
        Matter.Body.setVelocity(body, {x:0, y:Math.min(20,Math.abs(velocity)/200) * (velocity>0?-1:1)})
      });
    }, 10);
    window.addEventListener("scroll", debouncedCallback);
    return ()=>{
      window.removeEventListener("scroll", debouncedCallback);
    }
  },[ scrollYVelocity])
  return <>
    <div ref={ref} className="w-full h-full">

    </div>
    <button className="absolute top-28 sm:top-2 right-2" onClick={ev=>setReset(Math.random())}><ArrowPathIcon className=" w-8 h-8" /></button>
    <div className={twMerge(locked?"block": "hidden", "absolute sm:hidden left-0 top-0 bottom-0 right-0  z-10 bg-dotted-glass opacity-50 transition")} />
    <button className="absolute right-2 bottom-2 z-10 block sm:hidden rounded-full bg-primary-500/80 p-2" onClick={ev=>setLocked(v=>!v)}>{locked?<LockClosedIcon className=" w-8 h-8"  />:<LockOpenIcon className=" w-8 h-8" />}</button>
  </>
}

export const Tech:FC<{}> = (props)=>{
  const controls = useDragControls()

  const minisearch = useMemo(()=>{
    const ms = new MiniSearch({
      idField: 'name',
      fields: ['name', 'description'], // fields to index for full-text search
      storeFields: ['name', 'description'], // fields to return with search results
    })
    ms.addAll(skills)
    return ms;
  }, []);
  const [searchText, setSearchText] = useState("");
  const matchTarget = useMemo(()=>{
    return minisearch.search(searchText, {
      prefix:true,
      fuzzy:0.2
    });
  }, [minisearch, searchText])
  // console.log(matchTarget);
  // const scroll = useScroll({target: ref,
  //   offset: ["end end", "start start"]});
  // const rotateY = useTransform(scroll.scrollYProgress, [0,1], ['-350px', '350px']);

  return <div className="flex flex-col sm:flex-row justify-center items-center h-full">
    <div className="w-[320px] h-[100dvh] sm:h-[80dvh] bg-dotted border-2 border-default rounded-xl overflow-hidden relative">
      <TechPlayground highlightItems={searchText?matchTarget.map(it=>it.name):undefined}/>

      <div className="block sm:hidden grow w-full px-2 py-2 absolute top-12 z-10">
      
        <span className="relative">
          <input className=" w-full text-xl pl-10" type="text"  value={searchText} onChange={ev=>setSearchText(ev.target.value)} placeholder="Filter..." />
          <FunnelIcon className="w-icon h-icon absolute left-2 top-1/2 -translate-y-1/2"/>
        </span>
      </div>
    </div>
    <div className="hidden sm:flex grow flex-col p-8 gap-8">
      <h2 className="text-4xl font-extrabold">⬅️ My Skill set</h2>
      <span className="relative">
        <input className=" w-full text-xl pl-10" type="text"  value={searchText} onChange={ev=>setSearchText(ev.target.value)} placeholder="Filter..." />
        <FunnelIcon className="w-icon h-icon absolute left-2 top-1/2 -translate-y-1/2"/>
      </span>
    </div>
  </div>
}
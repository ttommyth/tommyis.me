"use client";
import { easeInOut, motion, useTime, useTransform } from "framer-motion";
import { FC, useState } from "react"
import {maxBy} from "lodash";

export const VerticalRoll:FC<{
  messages:string[]
}> = (props)=>{
  const {messages} = props;
  const [currentMsgIndex, setCurrentMsgIndex] = useState(0);
  const time = useTime();
  const translateY = useTransform(time, [0, 4000], ['0%', '-100%'], {ease: easeInOut});

  return <span className="relative inline-block overflow-hidden">
    <span className="invisible">{maxBy(messages, it=>it.length)}</span>
    <motion.span animate={{ translateY: '-100%' }} transition={{repeat: Infinity, duration: 4, ease: easeInOut }} 
      className="absolute w-full left-0" onAnimationIterationCapture={()=>console.log("what")} >
      {messages[currentMsgIndex]}
    </motion.span>
    <motion.span animate={{ translateY: '-100%' }} transition={{repeat: Infinity, duration: 4, ease: easeInOut }} 
      className="absolute w-full left-0 top-[100%]" >
      {messages[currentMsgIndex+1 >= messages.length? 0: currentMsgIndex+1]}
    </motion.span>
  </span>
}
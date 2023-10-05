"use client";
import { AnimatePresence, motion } from "framer-motion"
import { FC, useState } from "react"

const JobAccordion: FC<{ i:number, expanded:number|false, setExpanded:(v:number|false)=>void}> = ({ i, expanded, setExpanded})=>{
  const isOpen = i === expanded;
  return  <> 
    <motion.header
      initial={false}
      animate={{ backgroundColor: isOpen ? "#FF0088" : "#0055FF" }}
      onClick={() => setExpanded(isOpen ? false : i)}
    >
      test {i}
    </motion.header>
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.section
          key="content"
          initial="collapsed"
          animate="open"
          exit="collapsed"
          variants={{
            open: { opacity: 1, height: "auto" },
            collapsed: { opacity: 0, height: 0 }
          }}
          transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
        >
          test
        </motion.section>
      )}
    </AnimatePresence>
  </>   
}
export const Jobs = ()=>{
  const [expanded, setExpanded] = useState<false | number>(0);

  return <div className="flex flex-col pt-12 sm:pt-0 w-[100dvw] sm:w-full items-center overflow-y-scroll sm:overflow-y-auto min-h-[100dvh]">
    <h2 className="text-4xl">Jobs</h2>
    {[0,1,2,3].map(it=><JobAccordion key={it} i={it} expanded={expanded} setExpanded={setExpanded}/>)}
  </div>
}
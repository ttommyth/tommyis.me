import { ChevronDownIcon } from "@heroicons/react/24/solid"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { FC, PropsWithChildren, useState } from "react"
import { ConditionalWrapper } from "../../utils/ConditionalWrapper"
import ImageCarousel from "../../ImageCarousel"

//toDO;
export const TodoNode:FC<{}> = ()=>{
  return <div className="flex flex-col ">
    <div className="absolute left-[-8px] mt-1  w-auto h-6 bg-default border-default  text-center transition-colors text-base-300 dark:text-base-900" title="comment">
      <span style={{color: "#6a9955"}}>{"//TODO: insert next job here"}</span>
    </div>
    <span className="h-8"></span>
  </div>

}

export const JobNode:FC<{
  job:{
    icon?:string,
    title:string,
    company:string,
    url?:string,
    period:string
  }
}> = ({job})=>{
  return <div className="flex flex-col ">
    <div className="absolute  left-[-1px] mt-1 -translate-x-1/2 w-6 h-6 bg-default border-default border-2 rounded-full transition-colors" title="Job"/>
    <h3 className="text-xl font-bold">{job.title}</h3>
    <ConditionalWrapper wrapper={(node)=><Link href={job.url!} target="_blank">{node}</Link>} condition={!!job.url}>
      <h4 className="text-gray-500 text-md">{job.company}</h4>
    </ConditionalWrapper>
    <h4 className="text-xs text-gray-500">{job.period}</h4>
  </div>
}
export const ProjectNode:FC<PropsWithChildren<{
  project:{
    icon?:string,
    name:string,
    labels?: string[]
    url?:string,
    period:string,
  },i:number, expanded:number|undefined, setExpanded:(v:number|undefined)=>void
}>> = ({project, i, expanded, setExpanded, children})=>{
  return <div className="flex flex-col ml-2 sm:ml-4 gap-2 ">
    <div className="absolute left-[-1px] mt-1 -translate-x-1/2 w-6 h-6 bg-default border-default border-2 rounded-md transition-colors" title="Project"/>
    <span className="flex flex-wrap sm:flex-row gap-2 sm:gap-4 sm:items-center">
      <ConditionalWrapper wrapper={(node)=><Link href={project.url!} target="_blank">{node}</Link>} condition={!!project.url}>
        <h3 className="text-xl font-bold">{project.name}</h3>
      </ConditionalWrapper>
      {project.labels?.map((label,idx)=><span key={"label-"+idx} className="text-xs rounded-full p-1  sm:py-2 sm:px-4 bg-base-300 dark:bg-base-900">
        {label}
      </span>)}
    </span>
    <h4 className="text-xs text-gray-500">{project.period}</h4>
    <motion.div     
      className="w-full h-auto border-default border-2 border-solid aria-expanded:border-style-expand rounded-md flex flex-col items-center bg-dotted group" aria-expanded={expanded==i}>
      <motion.header
        initial={false}
        className=" flex flex-row justify-center w-full bg-default border-default border-dashed group-aria-expanded:border-b-2 group-aria-expanded:rounded-b-none  cursor-pointer rounded-md "
        onClick={() => setExpanded(expanded==i ? undefined : i)}
      >
        <motion.div 
          animate={{ rotate: expanded==i ? "180deg" : "0deg" }}>
          <ChevronDownIcon className="w-6 h-6 text-base-400 dark:text-base-900" />
        </motion.div>
      </motion.header>
      <AnimatePresence initial={false}>
        {expanded==i && (
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
            {children}
          </motion.section>
        )}
      </AnimatePresence>
    </motion.div>
  </div>
}

export const PersonalProjectNode:FC<{
  project:{
    icon?:string,
    title:string,
    company:string,
    url?:string,
    period:string
  },i:number, expanded:number|undefined, setExpanded:(v:number|undefined)=>void
}> = ({project})=>{
  return <div className="flex flex-col ">
    <div className="absolute  left-[-1px]  mt-1 -translate-x-1/2 w-6 h-6 bg-default border-default border-2 -rotate-45 rounded-md transition-colors" title="Personal Project" />
    <h3 className="text-xl font-bold">{project.title}</h3>
    <ConditionalWrapper wrapper={(node)=><Link href={project.url!} target="_blank">{node}</Link>} condition={!!project.url}>
      <h4 className="text-gray-500 text-md">{project.company}</h4>
    </ConditionalWrapper>
    <h4 className="text-xs text-gray-500">{project.period}</h4>
  </div>
}


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
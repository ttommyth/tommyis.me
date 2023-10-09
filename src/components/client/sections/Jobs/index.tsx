"use client";
import { AnimatePresence, motion } from "framer-motion"
import { FC, useState } from "react"
import { ConditionalWrapper } from "../../utils/ConditionalWrapper";
import Link from "next/link";
import { ArrowDownIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import {TodoNode, JobNode, ProjectNode, PersonalProjectNode, EducationNode } from "./Nodes";
import { ChannelC } from "./projects/ChannelC";
import { Kitchee } from "./projects/Kitchee";
import { Studylu } from "./projects/Studylu";


export const Jobs = ()=>{
  const [expanded, setExpanded] = useState<undefined | number>(undefined);

  return <div className=" overflow-y-scroll sm:overflow-y-auto min-h-[100dvh] max-h-[100dvh] sm:max-h-none">
    <div className="flex flex-col pt-12 sm:pt-0 w-[100dvw] sm:w-full items-center overflow-x-hidden">
      <h2 className="text-4xl mb-8">Jobs</h2>
      <div className="ml-8 sm:ml-8 p-4 pl-6 pr-8 border-l-2 border-default w-full h-auto relative flex flex-col  transition-colors gap-8">
        <TodoNode  />
        <JobNode job={{
          title: "Senior System Analyst",
          company: "Cooltech Solutions Limited",
          url: "https://cooltechsol.com",
          period: "07/2022 - 10/2023"
        }} />
        <ProjectNode project={{
          icon: "/image/project/cc/icon.png",
          name: "Channel C HK",
          url: "https://channelchk.com",
          labels: ["Web Development","App Development", "Backend Development", "Data Analysis"],
          period: "2021 - 2023"
        }} i={0} expanded={expanded} setExpanded={setExpanded}>
          <ChannelC/>
        </ProjectNode>
        <ProjectNode project={{
          icon: "/image/project/kitchee/icon.png",
          name: "Kitchee",
          url: "https://kitchee.com",
          labels: ["Web Development", "CMS Customization"],
          period: "2022 - 2023"
        }} i={1} expanded={expanded} setExpanded={setExpanded}>
          <Kitchee/>
        </ProjectNode>
        <ProjectNode project={{
          icon: "/image/project/studylu/icon.png",
          name: "Studylu",
          url: "https://studylu.com",
          labels: ["Web Development", "Backend Development"],
          period: "2021 - 2023"
        }} i={2} expanded={expanded} setExpanded={setExpanded}>
          <Studylu/>
        </ProjectNode>
        <JobNode job={{
          title: "System Analyst",
          company: "Cooltech Solutions Limited",
          url: "https://cooltechsol.com",
          period: "07/2021 - 06/2022"
        }} />
        <JobNode job={{
          title: "Analyst Programmer",
          company: "HK Systems Limited",
          url: "https://cooltechsol.com",
          period: "10/2018 - 07/2021"
        }} />
        <PersonalProjectNode project={{
          title: "Custom Robot Controller with AR Mobile App",
          company: "City University of Hong Kong",
          url: "http://dspace.cityu.edu.hk/handle/2031/9098",
          period: "07/2018 - 08/2018"
        }} i={1} expanded={expanded} setExpanded={setExpanded}/>
        <JobNode job={{
          title: "Programmer",
          company: "HK Systems Limited",
          url: "https://hksl.com.hk",
          period: "08/2017 - 06/2018"
        }} />
        <EducationNode education={{
          title: "BSc Computer Science",
          school: "City University of Hong Kong",
          gpa: "3.47/4.3",
          period: "09/2016 - 08/2018"
        }} />
      </div>
    </div>
  </div>
}
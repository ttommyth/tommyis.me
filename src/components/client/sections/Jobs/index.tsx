"use client";
import { AnimatePresence, motion } from "framer-motion"
import { FC, useState } from "react"
import { ConditionalWrapper } from "../../utils/ConditionalWrapper";
import Link from "next/link";
import { ArrowDownIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import {TodoNode, JobNode, ProjectNode, PersonalProjectNode } from "./Nodes";
import { ChannelC } from "./projects/ChannelC";


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
          name: "Channel C HK",
          url: "https://channelchk.com",
          labels: ["Web Development","App Development", "Data Analysis"],
          period: "2021 - 2023"
        }} i={0} expanded={expanded} setExpanded={setExpanded}>
          <ChannelC/>
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
          title: "Senior System Analyst",
          company: "Cooltech Solutions Limited",
          url: "https://cooltechsol.com",
          period: "07/2021 - 10/2023"
        }} i={1} expanded={expanded} setExpanded={setExpanded}/>
        <JobNode job={{
          title: "Programmer",
          company: "HK Systems Limited",
          url: "https://hksl.com.hk",
          period: "08/2017 - 06/2018"
        }} />
      </div>
    </div>
  </div>
}
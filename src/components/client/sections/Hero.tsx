"use client";
import Image from "next/image";
import Link from "next/link";
import job from "public/image/job_developer.png";
import { ReactComponent as  GithubLogo } from "public/icon/github.svg";
import { ReactComponent as  LinkedinLogo } from "public/icon/linkedin.svg";
import { ArrowSmallRightIcon } from '@heroicons/react/24/solid'
import { DarkModeSwitch } from "@/hooks/DarkModeHook";

export const Hero = ()=>{
  return <>
    <div className="left-0 w-[100dvw] h-[100dvh] absolute flex items-center bg-dotted min-h-[500px]">
      <div className="mx-auto container max-w-4xl flex justify-between items-center px-4">
        <div className="flex flex-col gap-2">
          <h2>Hello there.</h2>
          <h1 className="text-6xl font-black">Tommy is me🧑🏻‍💻</h1>
          <h2 className="flex items-center gap-2"><ArrowSmallRightIcon className="w-8 inline-block"/>I am a developer</h2>
          
          <ul className="flex gap-2 mt-4">
            <li><Link href="https://github.com/ttommyth"><GithubLogo className="w-8 fill-current" /> </Link></li>
            <li><Link href="https://www.linkedin.com/in/ttommyth/"><LinkedinLogo className="w-8 fill-current" /> </Link></li>
            <li><DarkModeSwitch/></li>
          </ul>
        </div>
        <div className="w-72 relative">
          <Image src={job} className="w-full" objectFit="contain"  alt={"Developer"} />
        </div>
      </div>
    </div>
    <div className="invisible h-[100dvh] min-h-[500px]"></div>
  </> 
}
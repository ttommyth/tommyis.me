"use client";

import { PaperAirplaneIcon } from "@heroicons/react/20/solid";
import { ChatBubbleLeftEllipsisIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import { UserIcon } from "@heroicons/react/24/solid";
import { ReactComponent as  GithubLogo } from "public/icon/github.svg";
import { ReactComponent as  LinkedinLogo } from "public/icon/linkedin.svg";

export const Contact = () => {
  return <div className="h-[100dvh] min-w-[320px] flex justify-center items-center px-4 sm:px-0">
    <div className=" flex justify-stretch items-stretch w-full bg-base-300 dark:bg-base-900 border-default border-2  rounded-md flex-col sm:flex-row ">
      <div className="flex flex-row sm:flex-col h-full [&>*]:p-2 [&>*]:rounded-md [&>*]:flex [&>*]:gap-4 [&>*]:items-center gap-2 p-2 text-sm ">
        <span className="bg-base-400 dark:bg-base-800"><ChatBubbleLeftEllipsisIcon className="w-icon h-icon"/><span className="hidden sm:inline-block">Website</span></span>
        <span className=""><EnvelopeIcon className="w-icon h-icon"/><span className="hidden sm:inline-block">Email</span></span>
        <span className=""><LinkedinLogo className="w-icon h-icon "/><span className="hidden sm:inline-block">Linkedin</span></span>
      </div>
      <div className="bg-default grow py-2">
        <div className="flex flex-col grow bg-dotted [&_div]:pl-4">
          <div className="h-32 bg-base-300/50 dark:bg-base-900/50 p-8">
How can I reach you?
          </div>
          <div className="h-32 p-8">
test
          </div>
          <span className="mx-2 relative">
            <input className="pr-10 w-full" />
            <PaperAirplaneIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-icon h-icon"/>
          </span>
        </div>
      </div>
      
    </div>
     
  </div> 
}
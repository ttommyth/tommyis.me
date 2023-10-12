import { DeviceContainer } from "@/components/client/common/DeviceContainer";
import ImageCarousel from "@/components/client/common/ImageCarousel"
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid"
import Link from "next/link"
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import { SkillsPile } from "@/components/client/common/SkillsPile";


const websiteContent = `
## Loan Management

A loan management system for a confidential client. The system is used to manage loan applications and their related documents. It also provides a dashboard for the client to monitor the status of the loan applications.

I am work on the unit test structure with **xunit** and **moq**, allowing the team to write *unit tests* for the backend code and performing CI with *Github Actions*.

Furthermore, I've implemented a extensions method to allowing **EFCore** to perform include correctly with global filter.

`  
export const CtLoan = () => {
  return <div className="flex flex-col gap-4">
    <span className="w-full text-center border-default border-2 rounded-lg p-2 bg-strip font-black">Confidential Project</span>
    <ReactMarkdown className={"custom-prose"}>
      {
        websiteContent
      }
    </ReactMarkdown>

    <SkillsPile skills={[
      "React.js", "AWS", "Docker", "Tailwind CSS", "C#", ".net core"
    ]}/>
  </div>
}
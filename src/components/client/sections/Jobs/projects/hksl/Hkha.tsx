import { DeviceContainer } from "@/components/client/common/DeviceContainer";
import ImageCarousel from "@/components/client/common/ImageCarousel"
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid"
import Link from "next/link"
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import { SkillsPile } from "@/components/client/common/SkillsPile";


const websiteContent = `
## HKHA RFID Project

In this RFID Project, I am responsive to the **WPF desktop app** development and *android development*. The desktop app is used to manage the RFID reader and the android app is used to scan the RFID tag.


`  
export const Hkha = () => {
  return <div className="flex flex-col gap-4">
    <span className="w-full text-center border-default border-2 rounded-lg p-2 bg-strip font-black">Confidential Project</span>
    <ReactMarkdown className={"custom-prose"}>
      {
        websiteContent
      }
    </ReactMarkdown>

    <SkillsPile skills={[
      "React.js", "Kotlin", "C#", ".net core"
    ]}/>
  </div>
}
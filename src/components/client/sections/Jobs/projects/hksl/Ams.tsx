import { DeviceContainer } from "@/components/client/common/DeviceContainer";
import ImageCarousel from "@/components/client/common/ImageCarousel"
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid"
import Link from "next/link"
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import { SkillsPile } from "@/components/client/common/SkillsPile";


const websiteContent = `
## Asset Management System

The Asset Management System is designed to be run on a handheld device or with online support. Therefore, this system is designed to be offline-first. The system is used to manage the assets of the company, including the location of the assets and the status of the assets.

One of the key feature would be the ability to locate the RFID tag with a compass like interface. This allows the user to locate the asset with ease.
 This feature make use of the algorithm to **calculate the direction of the RFID tag** by their *RSSI* and *response time*.
`  
export const Ams = () => {
  return <div className="flex flex-col gap-4">
    <span className="w-full text-center border-default border-2 rounded-lg p-2 bg-strip font-black">Confidential Project</span>
    <ReactMarkdown className={"custom-prose"}>
      {
        websiteContent
      }
    </ReactMarkdown>

    <SkillsPile skills={[
      "Kotlin", "C#", ".net core"
    ]}/>
  </div>
}
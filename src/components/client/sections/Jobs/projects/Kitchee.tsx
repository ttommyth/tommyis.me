import { DeviceContainer } from "@/components/client/common/DeviceContainer";
import ImageCarousel from "@/components/client/common/ImageCarousel"
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid"
import Link from "next/link"
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import { SkillsPile } from "@/components/client/common/SkillsPile";

const websiteContent = `
## Kitchee Official Website

Kitchee is a professional football club in Hong Kong. They needed a website to showcase their team and players, as well as to promote their merchandise.

We make use of Next.js and Tailwind CSS to develop a website that is fast and easy to maintain.
 Also building the project in a monorepo structure powered by Nx, we are able to share code between the website and the CMS admin panel.
`  
export const Kitchee = () => {
  return <div className="flex flex-col gap-4">
    <DeviceContainer url={"https://kitchee.com"} deviceType={"browser"}>
      <ImageCarousel images={Array.from(new Array(6)).map((_,idx)=>`/image/project/kitchee/${idx+1}.png`)}/>
    </DeviceContainer>
    <ReactMarkdown className={"custom-prose"}>
      {
        websiteContent
      }
    </ReactMarkdown>
    <SkillsPile skills={[
      "React.js", "AWS", "Docker", "Tailwind CSS", "Typescript", "Next.js", "Storybook", "Jest", "Nx"
    ]}/>
  </div>
}
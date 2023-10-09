import { DeviceContainer } from "@/components/client/common/DeviceContainer";
import ImageCarousel from "@/components/client/common/ImageCarousel"
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid"
import Link from "next/link"
import ReactMarkdown from "react-markdown";
import Image from "next/image";

const WebsiteContent = `
## Channel C Website

Channel C HK, a fast-growing internet media platform since 2021, needed a website to showcase content that couldn't be effectively presented in YouTube videos.
 Our team developed a website using Next.js and Tailwind CSS, prioritizing loading speed and development efficiency.

The Channel C Website offers a user-friendly interface for visitors to explore the diverse range of content, including articles, comments, interactive features, and partner-ship promotion.
 With seamless social media integration, users can easily engage and share their favorite content.

By creating this bespoke website, we've provided Channel C with a powerful platform to expand their online presence beyond YouTube.
 The Channel C Website delivers an immersive visual experience and supports the brand's continued growth and success.
`  
export const Kitchee = () => {
  return <div className="flex flex-col gap-4">
    <DeviceContainer url={"https://kitchee.com"} deviceType={"browser"}>
      <ImageCarousel images={["/image/project/cc/1.png", "/image/project/cc/2.png"]}/>
    </DeviceContainer>
    <ReactMarkdown className={"custom-prose"}>
      {
        WebsiteContent
      }
    </ReactMarkdown>
  </div>
}
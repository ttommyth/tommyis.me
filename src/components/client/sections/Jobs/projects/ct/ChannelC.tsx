import { DeviceContainer } from "@/components/client/common/DeviceContainer";
import ImageCarousel from "@/components/client/common/ImageCarousel"
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid"
import Link from "next/link"
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import { SkillsPile } from "@/components/client/common/SkillsPile";


const   appStoreUrl="https://apps.apple.com/hk/app/channel-c-hk/id6443536056"
const googlePlayUrl="https://play.google.com/store/apps/details?id=com.channelchk.mobileapp"
const ChannelCWebsiteContent = `
## Channel C Website

Channel C HK, a fast-growing internet media platform since 2021, needed a website to showcase content that couldn't be effectively presented in YouTube videos.
 Our team developed a website using **Next.js** and **Tailwind CSS**, prioritizing loading speed and development efficiency.

The Channel C Website offers a user-friendly interface for visitors to explore the diverse range of content, including articles, comments, interactive features, and partner-ship promotion.
 With seamless social media integration, users can easily engage and share their favorite content.

By creating this bespoke website, we've provided Channel C with a powerful platform to expand their online presence beyond YouTube.
 The Channel C Website delivers an immersive visual experience and supports the brand's continued growth and success.

In addiction, this website integrated with *Google Analytics v4* and *Google Tag Manager* to provide the team with insights on user behavior.
`  
const ChannelCAppContent = `
## Channel C Mobile App

After the successful launch of Channel C Website, we were tasked with developing a mobile app to further expand the brand's online presence and enhance user engagement.

The Channel C Mobile App is a cross-platform app built with **React Native** and **Expo**. Providing a seamless user experience across iOS and Android devices,
 the app allows users to access Channel C's content on the go with deeplink.

Moreover, we've make use of **Lottie** to enhance the user experience with animations.
 The app also supports push notifications via **Firebase Cloud Messaging** to keep users up to date with the latest content.
` 

export const ChannelC = () => {
  return <div className="flex flex-col gap-4">
    <DeviceContainer url={"https://channelchk.com"} deviceType={"browser"}>
      <ImageCarousel images={Array.from(new Array(2)).map((_,idx)=>`/image/project/cc/${idx+1}.png`)}/>
    </DeviceContainer>
    <ReactMarkdown className={"custom-prose"}>
      {
        ChannelCWebsiteContent
      }
    </ReactMarkdown>
    <div className="flex flex-col sm:flex-row gap-4 items-center">
      <div className="max-w-full">
        <DeviceContainer url={"https://channelchk.com/app"} deviceType={"mobile"}>
          <ImageCarousel images={Array.from(new Array(4)).map((_,idx)=>`/image/project/cc/app/${idx+1}.jpeg`)}/>
        </DeviceContainer>
      </div>
      <div className="grow">

        <ReactMarkdown className={"custom-prose grow"}>
          {
            ChannelCAppContent
          }
        </ReactMarkdown>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href={appStoreUrl} target="_blank">
            <Image src="/image/app_store.png" alt={""}
              width={0}
              height={0}
              sizes="100vw"
              className="w-auto h-12"/>
          </Link>
          <Link href={googlePlayUrl} target="_blank">
            <Image src="/image/google_play.png" alt={""}
              width={0}
              height={0}
              sizes="100vw"
              className="w-auto h-12"/>
          </Link>
        </div>
      </div>
  
    </div>
    <SkillsPile skills={[
      "React.js", "React Native", "Cloudflare", "AWS", "Docker", "Elastic Search", "Expo", "Firebase", "Tailwind CSS", "Typescript", "Next.js"
    ]}/>
  </div>
}
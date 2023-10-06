import ImageCarousel from "@/components/client/ImageCarousel"
import Link from "next/link"

export const ChannelC = () => {
  return <>
    <div className="dui-mockup-browser border-2 border-default w-full">
      <div className="dui-mockup-browser-toolbar ">
        <Link href="https://channelchk.com" target="_blank" className="dui-input border-2 border-default  ">https://channelchk.com</Link>
      </div>
      <div className="w-full  aspect-video">
        <ImageCarousel images={["/image/skill/nextjs.png", "/image/skill/nextjs.png", "/image/skill/nextjs.png", "/image/skill/nextjs.png", "/image/skill/nextjs.png"]}/>
      </div>

    </div>
    <div className="h-screen"></div>
  </>
}
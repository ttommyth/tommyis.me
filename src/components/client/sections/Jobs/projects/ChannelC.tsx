import ImageCarousel from "@/components/client/ImageCarousel"
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid"
import Link from "next/link"

export const ChannelC = () => {
  return <>
    <div className="dui-mockup-browser border-2 border-default w-full">
      <div className="w-full flex">
        <span className="my-2 mx-4 rounded-xl px-2 grow border-2 border-default bg-default flex items-center gap-2">          
          <Link href="https://channelchk.com" target="_blank" className=" ">https://channelchk.com</Link>
          <ArrowTopRightOnSquareIcon className="w-icon h-icon"/>
        </span>
      </div>
      <div className="w-full  aspect-video">
        <ImageCarousel images={["/image/project/cc/1.png", "/image/project/cc/2.png"]}/>
      </div>

    </div>
    <p></p>
    <div className="h-screen"></div>
  </>
}
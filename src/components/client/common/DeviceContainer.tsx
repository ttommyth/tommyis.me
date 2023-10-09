import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { FC, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

export const DeviceContainer: FC<PropsWithChildren<{url: string, deviceType: "browser" | "mobile"}>>=(props)=>{
  return     <div className={twMerge("rounded-xl overflow-hidden border-2 border-default w-full bg-default", props.deviceType=="mobile"?"mx-auto max-w-xs":"")}>
    <div className="w-full flex">
      <span className="my-2 mx-1 sm:mx-4 rounded-xl px-1 sm:px-2 grow border-2 border-default bg-default flex items-center gap-2 max-w-full">          
        <Link href={props.url} target="_blank" className="truncate max-w-full">{props.url}</Link>
        <ArrowTopRightOnSquareIcon className="w-icon h-icon"/>
      </span>
    </div>
    <div className={twMerge("w-full", props.deviceType=="mobile"?"aspect-h-16 aspect-w-9":"aspect-w-16 aspect-h-9")}>
      <div className="absolute absolute-fill">
        {props.children}
      </div>
    </div>
  </div>;
}
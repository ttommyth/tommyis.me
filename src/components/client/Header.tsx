"use client";
import { DarkModeSwitch } from "@/hooks/DarkModeHook"
import { supportedLocale } from "@/locale/i18n";
import { usePathname } from "next/navigation";
export const Header = ()=>{
  const pathname = usePathname()
  const paths = pathname.split("/")
  return <header className=" fixed left-0 top-0 right-0 z-50 bg-dotted-glass border-dashed border-b-2 border-default flex justify-center px-2">
    <div className="max-w-6xl flex flex-row justify-center items-center h-appbar gap-8 w-full">
      <ul className="flex mx-auto container   gap-8   grow overflow-y-auto whitespace-nowrap h-full items-center">
        {
          (paths.length==1 || (paths.length==2 && supportedLocale.includes(paths[1])))?<>
            <a href="#hero">Tommy is me</a>
            <a href="#skills">Skills</a>
            <a href="#jobs">My Work</a>
            <a href="#contact">Contact Me</a>
          </>:<>
            <a href="/">Tommy is me</a>
          </>
        }
      </ul>
      <DarkModeSwitch />
    </div>
  </header>
}
import { DarkModeSwitch } from "@/hooks/DarkModeHook"

export const Header = ()=>{
  return <header className=" fixed left-0 top-0 right-0 z-50 bg-dotted-glass border-dotted border-b-2">
    <ul className="flex mx-auto container max-w-6xl justify-center items-center gap-8 h-10 ">
      <a href="#hero">Tommy is me</a>
      <a href="#skills">Skills</a>
      <a href="#jobs">Jobs</a>
      <DarkModeSwitch />
    </ul>
  </header>
}
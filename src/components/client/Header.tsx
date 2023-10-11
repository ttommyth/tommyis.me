import { DarkModeSwitch } from "@/hooks/DarkModeHook"

export const Header = ()=>{
  return <header className=" fixed left-0 top-0 right-0 z-50 bg-dotted-glass border-dashed border-b-2 flex justify-center px-2">
    <div className="max-w-6xl flex flex-row justify-center items-center h-appbar gap-8 w-full">
      <ul className="flex mx-auto container   gap-8   grow overflow-y-auto whitespace-nowrap h-full items-center">
        <a href="#hero">Tommy is me</a>
        <a href="#skills">Skills</a>
        <a href="#jobs">Jobs</a>
        <a href="#contact">Contact Me</a>
      </ul>
      <DarkModeSwitch />
    </div>
  </header>
}
import { DarkModeHelper, useDarkMode } from "@/hooks/DarkModeHook";
import { FC, PropsWithChildren, useEffect } from "react"
import { Header } from "../client/Header";

export const Layout:FC<PropsWithChildren<{}>>=({children})=>{
  return <>
    <DarkModeHelper/>
    <Header/>
    <main className="mx-auto container max-w-4xl px-4 ">{children}</main>
    <footer></footer>
  </>
}
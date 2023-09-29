import { FC, PropsWithChildren } from "react"

export const Layout:FC<PropsWithChildren<{}>>=({children})=>{
return <>
  <header className="flex mx-auto container max-w-6xl"></header>
  <main className="mx-auto container max-w-4xl bg-black">{children}</main>
  <footer></footer>
</>
}
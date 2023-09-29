import { FC, PropsWithChildren } from "react"

export const Layout:FC<PropsWithChildren<{}>>=({children})=>{
return <>
  <main className="mx-auto container max-w-3xl bg-black">{children}</main>
</>
}
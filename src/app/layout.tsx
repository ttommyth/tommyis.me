import { OnClickGraphicEffect } from '@/components/client/common/OnClickGraphicEffect'
import { Layout } from '@/components/server/Layout'
import '@/styles/globals.scss'
import type { Metadata } from 'next'
import { Noto_Sans } from 'next/font/google'
import { PropsWithChildren } from 'react'
import { twMerge } from 'tailwind-merge'
import { Analytics } from '@vercel/analytics/react';
 
const font = Noto_Sans({ subsets: ['latin'], display: 'swap', weight:['300','400', '700'] })

export const metadata: Metadata = {
  title: 'Tommy is me',
  description: 'The portfolio page of Tommy the developer',
  keywords:["Next.js", "SEO", "React", "full-stack development", "frontend developer", "Tailwind CSS", "portfolio", "projects", "web development", "developer", "typescript", "c#", "csharp", "dotnetcore", ".net core"]
}

export default function RootLayout({
  children,
  params: {locale}
}: PropsWithChildren<NextAppDirectoryProps>) {
  return (
    <html lang={locale}>
      <body className={twMerge(font.className, "relative")}>
        <Layout>
          {children}
          <OnClickGraphicEffect />
        </Layout>
        <Analytics />
      </body>
    </html>
  )
}

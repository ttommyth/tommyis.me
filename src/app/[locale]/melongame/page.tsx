import { Metadata } from 'next';
import {useTranslations} from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
import dynamic from 'next/dynamic';
import { PropsWithChildren, Suspense } from 'react';
const MelonSkillsGame = dynamic(() => import('@/components/client/sections/MelonSkillsGame'), { ssr: false });
 
export const metadata: Metadata = {
  title: 'Tommy is me',
  authors: [{name: "Tommy Tong", url: "https://tommyis.me"}],
  description: 'The portfolio page of Tommy the developer',
  keywords:["Next.js", "SEO", "React", "full-stack development", "frontend developer", "Tailwind CSS", "portfolio", "projects", "web development", "developer", "typescript", "c#", "csharp", "dotnetcore", ".net core"]
}

export default function Index({
  params: {locale}
}: NextAppDirectoryProps) {
  unstable_setRequestLocale(locale);
  const t = useTranslations('Index');
  return <div className='w-auto overflow-x-auto sm:overflow-x-hidden flex flex-row sm:flex-col snap-x  snap-mandatory sm:snap-none gap-16 sm:gap-4 px-8 py-0 sm:px-0 sm:py-8' id='root-container'>
    <div className='snap-always snap-center relative sm:static w-[100dvw] sm:w-auto h-[100dvh] min-h-[500px]' id='hero'>      
      <MelonSkillsGame />
    </div>
  </div>;
}
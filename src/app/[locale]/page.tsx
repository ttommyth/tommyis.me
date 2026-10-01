import { Hero } from '@/components/client/sections/Hero';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import dynamic from 'next/dynamic';
const Jobs = dynamic(() => import('@/components/client/sections/Jobs'));
const Tech = dynamic(() => import('@/components/client/sections/Tech'));
const Contact = dynamic(() => import('@/components/client/sections/Contact'));

export const metadata: Metadata = {
  title: 'Tommy is me',
  authors: [{ name: 'Tommy Tong', url: 'https://tommyis.me' }],
  description: 'The portfolio page of Tommy the developer',
  keywords: [
    'Next.js',
    'SEO',
    'React',
    'full-stack development',
    'frontend developer',
    'Tailwind CSS',
    'portfolio',
    'projects',
    'web development',
    'developer',
    'typescript',
    'c#',
    'csharp',
    'dotnetcore',
    '.net core',
  ],
};

export default async function Index({ params }: NextAppDirectoryProps) {
  const { locale } = await params;
  const t = await getTranslations('Index');
  return (
    <div
      className="w-auto overflow-x-hidden flex flex-col gap-4 px-0 py-4 sm:py-8"
      id="root-container"
    >
      <div
        className="relative sm:static w-[100dvw] sm:w-auto h-[100dvh] min-h-[500px]"
        id="hero"
      >
        <Hero
          locale={{
            title1: t('heroTitle1'),
            title2: t('heroTitle2'),
            iam: t('iam'),
            iamArray: JSON.parse(t.raw('iamArray')),
          }}
        />
      </div>
      <div
        className="relative sm:static  w-[100dvw] sm:w-auto h-[100dvh] min-h-[500px] scroll-mt-appbar"
        id="skills"
      >
        <Tech />
      </div>
      <div
        className="relative sm:static  w-[100dvw] sm:w-auto scroll-mt-appbar sm:scroll-m-20"
        id="jobs"
      >
        <Jobs />
      </div>
      <div
        className="relative sm:static  w-[100dvw] sm:w-auto h-[100dvh] sm:h-auto scroll-mt-appbar sm:scroll-m-20"
        id="contact"
      >
        <Contact />
      </div>
      {/* <div className='snap-always snap-center relative sm:static  w-[100dvw] sm:w-auto h-[100dvh] min-h-[500px]'>      
      <Hero locale={{
        title1: t("heroTitle1"),
        title2: t("heroTitle2"),
        iam: t("iam"),
        iamArray: JSON.parse(t.raw("iamArray"))
      }}/>
    </div> */}
    </div>
  );
}

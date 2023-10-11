import { Contact } from '@/components/client/sections/Contact';
import { Hero } from '@/components/client/sections/Hero';
import { Jobs } from '@/components/client/sections/Jobs';
import { Tech } from '@/components/client/sections/Tech';
import { Metadata } from 'next';
import {useTranslations} from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
import dynamic from 'next/dynamic';
import { PropsWithChildren, Suspense } from 'react';
 
export const metadata: Metadata = {
  title: 'Tommy is me',
  description: 'The portfolio page of Tommy the developer',
}

export default function Index({
  params: {locale}
}: NextAppDirectoryProps) {
  unstable_setRequestLocale(locale);
  const t = useTranslations('Index');
  return <div className='w-auto overflow-x-auto sm:overflow-x-hidden flex flex-row sm:flex-col snap-x  snap-mandatory sm:snap-none gap-16 sm:gap-4 px-8 py-0 sm:px-0 sm:py-8' id='root-container'>
    <div className='snap-always snap-center relative sm:static w-[100dvw] sm:w-auto h-[100dvh] min-h-[500px]' id='hero'>      
      <Hero locale={{
        title1: t("heroTitle1"),
        title2: t("heroTitle2"),
        iam: t("iam"),
        iamArray: JSON.parse(t.raw("iamArray"))
      }}/>
    </div>
    <div className='snap-always snap-center relative sm:static  w-[100dvw] sm:w-auto h-[100dvh] min-h-[500px]' id='skills'>    
      <Suspense fallback={<p>Loading...</p>}>
        <Tech />
      </Suspense>  
    </div>
    <div className='snap-always snap-center relative sm:static  w-[100dvw] sm:w-auto h-[100dvh] sm:h-auto scroll-m-0 sm:scroll-m-20' id='jobs'>    
      <Suspense fallback={<p>Loading...</p>}>
        <Jobs />
      </Suspense>
    </div>
    <div className='snap-always snap-center relative sm:static  w-[100dvw] sm:w-auto h-[100dvh] sm:h-auto scroll-m-0 sm:scroll-m-20' id='contact'>    
      <Suspense fallback={<p>Loading...</p>}>
        <Contact />
      </Suspense>
    </div>
    {/* <div className='snap-always snap-center relative sm:static  w-[100dvw] sm:w-auto h-[100dvh] min-h-[500px]'>      
      <Hero locale={{
        title1: t("heroTitle1"),
        title2: t("heroTitle2"),
        iam: t("iam"),
        iamArray: JSON.parse(t.raw("iamArray"))
      }}/>
    </div> */}
  </div>;
}
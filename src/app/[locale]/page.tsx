import { Hero } from '@/components/client/sections/Hero';
import { Tech } from '@/components/client/sections/Tech';
import {useTranslations} from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
import dynamic from 'next/dynamic';
import { PropsWithChildren, Suspense } from 'react';
 
export default function Index({
  params: {locale}
}: NextAppDirectoryProps) {
  unstable_setRequestLocale(locale);
  const t = useTranslations('Index');
  return <div className='w-auto overflow-x-auto sm:overflow-x-hidden flex flex-row sm:flex-col snap-x  snap-mandatory sm:snap-none gap-4'>
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
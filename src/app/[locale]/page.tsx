import { Hero } from '@/components/client/sections/Hero';
import {useTranslations} from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
import { PropsWithChildren } from 'react';
 
export default function Index({
  params: {locale}
}: NextAppDirectoryProps) {
  unstable_setRequestLocale(locale);
  const t = useTranslations('Intro');
  return <>
    <Hero/>
    <Hero/>
    <Hero/>
  </>;
}
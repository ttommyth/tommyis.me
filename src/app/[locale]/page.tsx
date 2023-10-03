import { Hero } from '@/components/client/sections/Hero';
import {useTranslations} from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
import { PropsWithChildren } from 'react';
 
export default function Index({
  params: {locale}
}: NextAppDirectoryProps) {
  unstable_setRequestLocale(locale);
  const t = useTranslations('Index');
  return <>
    <Hero locale={{
      title1: t("heroTitle1"),
      title2: t("heroTitle2"),
      iam: t("iam"),
      iamArray: JSON.parse(t.raw("iamArray"))
    }}/>
    <Hero locale={{
      title1: t("heroTitle1"),
      title2: t("heroTitle2"),
      iam: t("iam"),
      iamArray: JSON.parse(t.raw("iamArray"))
    }}/>
    <Hero locale={{
      title1: t("heroTitle1"),
      title2: t("heroTitle2"),
      iam: t("iam"),
      iamArray: JSON.parse(t.raw("iamArray"))
    }}/>
  </>;
}
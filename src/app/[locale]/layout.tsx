import { supportedLocale } from '@/locale/i18n';
import {useLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import { Noto_Sans } from 'next/font/google';
import { Layout } from '@/components/server/Layout';
import { PropsWithChildren } from 'react';
 

export function generateStaticParams() {
  return supportedLocale.map((locale) => ({locale}));
}
 
export default function LocaleLayout({children, params: {locale}}: PropsWithChildren<NextAppDirectoryProps>) {
  // Validate that the incoming `locale` parameter is valid
  const isValidLocale = supportedLocale.some((cur) => cur === locale);
  if (!isValidLocale) notFound();
 
  return (
    children
  );
}
import { supportedLocale } from '@/i18n/routing';
import {setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import { Noto_Sans } from 'next/font/google';
import { Layout } from '@/components/server/Layout';
import { PropsWithChildren } from 'react';
 

export function generateStaticParams() {
  return supportedLocale.map((locale) => ({locale}));
}
 
export default function LocaleLayout({ children, params }: PropsWithChildren<NextAppDirectoryProps>) {
  return children;
}
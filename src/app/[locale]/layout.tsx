import { supportedLocale } from '@/i18n/routing';
import { PropsWithChildren } from 'react';

export function generateStaticParams() {
  return supportedLocale.map((locale) => ({ locale }));
}

export default function LocaleLayout({
  children,
  params,
}: PropsWithChildren<NextAppDirectoryProps>) {
  return children;
}

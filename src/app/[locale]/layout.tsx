import { supportedLocale } from '@/i18n/routing';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { PropsWithChildren } from 'react';

// Ensure this interface matches your project's definition or is globally available
interface NextAppDirectoryProps {
  params: { locale: string };
}

export function generateStaticParams() {
  return supportedLocale.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: PropsWithChildren<NextAppDirectoryProps>) {
  const locale = params.locale;

  if (!supportedLocale.includes(locale as any)) notFound();

  let messages;
  try {
    messages = (await import(`@/i18n/messages/${locale}.json`)).default;
  } catch (error) {
    console.error('Failed to load messages for locale:', locale, error);
    notFound();
  }

  return (
    // <html lang={locale}> // HTML and BODY are usually in the root layout src/app/layout.tsx
    //   <body>
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
    //   </body>
    // </html>
  );
}

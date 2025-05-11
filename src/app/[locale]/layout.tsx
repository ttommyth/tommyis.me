import { supportedLocale } from '@/i18n/routing';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { PropsWithChildren } from 'react';

// Assuming supportedLocale is still needed for validation, or simplify further
// For now, let's keep a basic validation if you have `supportedLocale` easily available
// If not, you can comment out the validation for this test.
// import { supportedLocale } from '@/i18n/routing';
// import { notFound } from 'next/navigation';

interface NextAppDirectoryProps {
  params: Promise<{ locale: string }>;
}

/*
export function generateStaticParams() {
  return supportedLocale.map((locale) => ({ locale }));
}
*/

export default async function LocaleLayout({
  children,
  params,
}: PropsWithChildren<NextAppDirectoryProps>) {
  const locale = (await params).locale;
  if (!supportedLocale.includes(locale)) notFound();

  let messages;
  try {
    messages = (await import(`@/i18n/messages/${locale}.json`)).default;
  } catch (error) {
    console.error('Failed to load messages for locale:', locale, error);
    notFound();
  }

  return (
    // Assuming you don't want <html> and <body> tags here if you have a root app/layout.tsx
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}

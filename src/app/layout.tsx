import { OnClickGraphicEffect } from '@/components/client/common/OnClickGraphicEffect';
import { Layout } from '@/components/server/Layout';
import '@/styles/globals.scss';
import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';
import { Noto_Sans } from 'next/font/google';
import type { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

const font = Noto_Sans({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '700', '800', '900'],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tommyis.me',
  ),
  title: 'Tommy is me',
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
    'software engineer',
    'typescript',
    'c#',
    'csharp',
    'dotnetcore',
    '.net core',
    'lalamove',
    'cooltech',
    'channel c',
    'channelc',
  ],
};

// The root layout also serves the bare "/" route (which redirects to the
// default locale), where there is no `locale` param — hence the optional type.
interface RootLayoutProps {
  children: ReactNode;
  params: Promise<{ locale?: string }>;
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const { locale } = await params;
  return (
    <html lang={locale ?? 'en'} className="dark">
      <body className={twMerge(font.className, 'relative')}>
        <Layout>
          {children}
          <OnClickGraphicEffect />
        </Layout>
        <Analytics />
      </body>
    </html>
  );
}

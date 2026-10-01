import { DarkModeHelper } from '@/hooks/DarkModeHook';
import { FC, PropsWithChildren } from 'react';
import { Header } from '../client/Header';
import { MotionProvider } from '../client/common/MotionProvider';

export const Layout: FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <MotionProvider>
      <DarkModeHelper />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:rounded-md focus:bg-primary-500 focus:px-4 focus:py-2 focus:text-sm focus:text-base-100"
      >
        Skip to content
      </a>
      <Header />
      <main id="main-content" className="mx-auto container max-w-4xl">
        {children}
      </main>
      <footer className="mt-4 border-t-2 border-dashed border-default">
        <div className="mx-auto container max-w-4xl px-4 py-6 flex flex-wrap items-center justify-between gap-2 text-sm text-base-600 dark:text-base-300">
          <span>
            © {new Date().getFullYear()} Tommy Tong — built with Next.js
          </span>
          <a href="#top" className="hover:text-primary-500 transition-colors">
            Back to top ↑
          </a>
        </div>
      </footer>
    </MotionProvider>
  );
};

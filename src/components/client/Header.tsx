'use client';
import { DarkModeSwitch } from '@/hooks/DarkModeHook';
import { supportedLocale } from '@/i18n/routing';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
export const Header = () => {
  const pathname = usePathname();
  const paths = pathname.split('/');
  return (
    <header className=" fixed left-0 top-0 right-0 z-50  border-dashed border-b-2 border-default ">
      <div className="w-full h-full relative flex justify-center">
        <div className="opacity-100 dark:opacity-0 transition-opacity duration-500">
          <div className="light-bg-dotted-glass absolute top-0 left-0 right-0 bottom-0 " />
        </div>
        <div className="opacity-0 dark:opacity-100 transition-opacity duration-500">
          <div className="dark-bg-dotted-glass absolute top-0 left-0 right-0 bottom-0 " />
        </div>

        <div className="max-w-6xl flex flex-row justify-center items-center h-appbar gap-8 w-full z-10 relative px-4">
          <ul className="flex mx-auto container   gap-8   grow overflow-y-auto whitespace-nowrap h-full items-center">
            {paths.length == 1 ||
            (paths.length == 2 && supportedLocale.includes(paths[1])) ? (
              <>
                <a href="#hero">Tommy is me</a>
                <a href="#skills">Skills</a>
                <a href="#jobs">My Work</a>
                <a href="#contact">Contact Me</a>
              </>
            ) : (
              <>
                <Link href="/">Tommy is me</Link>
              </>
            )}
          </ul>
          <DarkModeSwitch />
        </div>
      </div>
    </header>
  );
};

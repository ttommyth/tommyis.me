import { DarkModeHelper } from '@/hooks/DarkModeHook';
import { FC, PropsWithChildren } from 'react';
import { Header } from '../client/Header';

export const Layout: FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <>
      <DarkModeHelper />
      <Header />
      <main className="mx-auto container max-w-4xl">{children}</main>
      <footer></footer>
    </>
  );
};

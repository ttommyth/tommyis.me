'use client';
import { FC, PropsWithChildren, ReactNode } from 'react';

export const ConditionalWrapper: FC<
  PropsWithChildren<{ wrapper: FC<ReactNode>; condition: boolean }>
> = ({ condition, wrapper, children }) => {
  if (condition) return wrapper(children);
  else return <>{children}</>;
};

type NextAppDirectoryProps = {
  params: Promise<{
    locale: string;
  }>;
};

type ComponentWithLocale<T> = {
  locale: T;
};

type NextAppDirectoryProps =  {
  params: {
    locale:string
  };
}

type ComponentWithLocale<T> = {
  locale: T;
}
import {getRequestConfig} from 'next-intl/server';
 
export const supportedLocale = ['en', 'zh-Hant'];

export default getRequestConfig(async ({locale}) => ({
  messages: (await import(`./messages/${locale}.json`)).default
}));
/** @type {import('next').NextConfig} */
const nextConfig = {

  sassOptions: {
    includePaths: ['./src/styles'],
  },
  output:process.env.NODE_ENV=="development"?undefined:"export",

}
const withNextIntl = require('next-intl/plugin')(
  './src/locale/i18n.ts'
);
 
module.exports = withNextIntl(nextConfig);

/** @type {import('next').NextConfig} */
const nextConfig = {

  images: {
    formats: ['image/webp'],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  sassOptions: {
    includePaths: ['./src/styles'],
  },
  webpack:(config,options)=>{
    config.module.rules.push({
      test: /\.(svg)$/, 
      use: [
        "@svgr/webpack",
        options.defaultLoaders.babel,
        {
          loader: 'file-loader',
          options: {
            name: 'images/[hash]-[name].[ext]',
          },
        },
      ],
    })
    return config
  },
  output:process.env.NODE_ENV=="development"?undefined:"export",

}
const withNextIntl = require('next-intl/plugin')(
  './src/locale/i18n.ts'
);
 
module.exports = withNextIntl(nextConfig);

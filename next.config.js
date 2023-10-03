/** @type {import('next').NextConfig} */
const nextConfig = {

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

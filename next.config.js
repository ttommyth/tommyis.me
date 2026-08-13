/** @type {import('next').NextConfig} */
const path = require('path');

// Security headers applied to every response. These are safe to send in all
// environments. The strict CSP is intentionally applied in production only,
// because `next dev` relies on inline/eval'd webpack HMR scripts.
const baseSecurityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  },
  { key: 'X-DNS-Prefetch-Control', value: 'off' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
];

const productionOnlyHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "form-action 'self'",
      // 'unsafe-inline' is required for Next.js hydration/RSC scripts and the
      // next/font <style> tags. 'unsafe-eval' is deliberately omitted.
      "script-src 'self' 'unsafe-inline' https://www.google.com https://www.gstatic.com https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "img-src 'self' data: blob:",
      "connect-src 'self' https://www.google.com https://www.gstatic.com https://va.vercel-scripts.com",
      "frame-src https://www.google.com https://recaptcha.google.com",
      "worker-src 'self' blob:",
    ].join('; '),
  },
];

const nextConfig = {
  images: {
    formats: ['image/webp'],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  sassOptions: {
    includePaths: ['./src/styles'],
  },
  async headers() {
    const isProduction = process.env.NODE_ENV === 'production';
    return [
      {
        source: '/:path*',
        headers: isProduction
          ? [...baseSecurityHeaders, ...productionOnlyHeaders]
          : baseSecurityHeaders,
      },
    ];
  },
  turbopack: {
    rules: {
      '*.svg': {
        as: '*.js',
        loaders: ['@svgr/webpack'],
      },
    },
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};
const withNextIntl = require('next-intl/plugin')();

module.exports = withNextIntl(nextConfig);

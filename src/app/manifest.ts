import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Tommy is me',
    short_name: 'tommyisme',
    description: 'The portfolio page of Tommy the developer',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#4193d2',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Tommy is me',
  description: 'The portfolio page of Tommy the developer',
  authors: [{ name: 'Tommy Tong', url: 'https://tommyis.me' }],
  keywords: [
    'Next.js',
    'SEO',
    'React',
    'full-stack development',
    'frontend developer',
    'Tailwind CSS',
    'portfolio',
    'projects',
    'web development',
    'developer',
    'typescript',
    'c#',
    'csharp',
    'dotnetcore',
    '.net core',
  ],
};

// This page only renders when the app is built statically (output: 'export')
export default function RootPage() {
  redirect('/en');
}

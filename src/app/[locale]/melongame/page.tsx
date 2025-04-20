import { Metadata } from 'next';
import dynamic from 'next/dynamic';
const MelonSkillsGame = dynamic(
  () => import('@/components/client/sections/MelonSkillsGame'),
);

export const metadata: Metadata = {
  title: 'Tommy is me',
  authors: [{ name: 'Tommy Tong', url: 'https://tommyis.me' }],
  description: 'The portfolio page of Tommy the developer',
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

export default async function Index() {
  return (
    <div className="w-full h-screen">
      <MelonSkillsGame />
    </div>
  );
}

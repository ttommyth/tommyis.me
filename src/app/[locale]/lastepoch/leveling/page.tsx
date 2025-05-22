// Refactor leveling guide page to use a StepItem component and data-driven steps
import LevelingGuideClient from '@/components/client/pages/LastEpochLevelingGuideClient';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Tommy is me',
  authors: [{ name: 'Tommy Tong', url: 'https://tommyis.me' }],
  description: 'Last Epoch Leveling Guide',
  keywords: [
    'Last Epoch',
    'Leveling Guide',
    'Leveling',
    'Action RPG',
    'Guide',
    'Leveling Build',
    'Last Epoch Season 2',
  ],
};
export default function LevelingGuidePage() {
  return (
    <>
      <LevelingGuideClient />
      <p>
        <Link href="/tools">Back to Tools</Link>
      </p>
    </>
  );
}

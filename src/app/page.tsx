import { Metadata } from 'next';
import {redirect} from 'next/navigation';

export const metadata: Metadata = {
  title: 'Tommy is me',
  description: 'The portfolio page of Tommy the developer',
}

// This page only renders when the app is built statically (output: 'export')
export default function RootPage() {
  redirect('/en');
}

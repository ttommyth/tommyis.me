import { Color as CuloriColor } from 'culori';
import ColorSandboxClientPage from './ColorSandboxClientPage'; // Import the new client component

interface ColorSandboxPageProps {
  // Props for a Server Component page can include searchParams
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// This is now a Server Component by default
export default async function ColorSandboxPage({
  searchParams,
}: ColorSandboxPageProps) {
  // Destructure specific keys you expect from searchParams
  // Provide a default empty object for searchParams if it could be undefined,
  // though Next.js usually provides it.
  const { gh: ghParam, gs: gsParam, gl: glParam } = (await searchParams) || {};

  let initialColorFromServer: CuloriColor | undefined = undefined;

  // Now use ghParam, gsParam, glParam directly
  if (
    ghParam &&
    typeof ghParam === 'string' &&
    gsParam &&
    typeof gsParam === 'string' &&
    glParam &&
    typeof glParam === 'string'
  ) {
    const h = parseFloat(ghParam);
    const s = parseFloat(gsParam); // Assuming this is 0-100 from URL
    const l = parseFloat(glParam); // Assuming this is 0-100 from URL

    if (!isNaN(h) && !isNaN(s) && !isNaN(l)) {
      // Convert s and l from 0-100 (URL) to 0-1 (Culori HSL)
      initialColorFromServer = { mode: 'hsl', h, s: s / 100, l: l / 100 };
    }
  }
  // Note: Add more robust parsing or default values if needed.
  // If no valid color params are found, initialColorFromServer will be undefined,
  // and useColorSandboxState will use its internal default.

  return (
    <ColorSandboxClientPage initialColorFromSearch={initialColorFromServer} />
  );
}

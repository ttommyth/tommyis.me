import { Color as CuloriColor } from 'culori';
import type { Metadata, ResolvingMetadata } from 'next';
import ColorSandboxClientPage from './ColorSandboxClientPage'; // Import the new client component

interface ColorSandboxPageProps {
  params: Promise<{ locale: string }>; // Assuming locale is part of your path structure
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Function to generate metadata
export async function generateMetadata(
  { params, searchParams }: ColorSandboxPageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { locale } = await params;
  const {
    gh,
    gs,
    gl,
    aa, // Analogous Angle
    sa, // Split Complementary Angle
    ta, // Tetradic Angle
    ps, // Palette Steps
  } = (await searchParams) || {
    gh: '210',
    gs: '100',
    gl: '50',
    aa: '30', // Default Analogous Angle
    sa: '30', // Default Split Complementary Angle
    ta: '60', // Default Tetradic Angle
    ps: '12', // Default Palette Steps
  };

  // Construct the OG image URL
  // Ensure your domain is correctly set, perhaps from an environment variable for production
  const siteUrl =
    `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'http://localhost:3000';
  const ogImageUrl = new URL(`${siteUrl}/api/og/color-sandbox`);
  ogImageUrl.searchParams.set('gh', Array.isArray(gh) ? gh[0] : (gh ?? '210'));
  ogImageUrl.searchParams.set('gs', Array.isArray(gs) ? gs[0] : (gs ?? '100'));
  ogImageUrl.searchParams.set('gl', Array.isArray(gl) ? gl[0] : (gl ?? '50'));
  ogImageUrl.searchParams.set('aa', Array.isArray(aa) ? aa[0] : (aa ?? '30'));
  ogImageUrl.searchParams.set('sa', Array.isArray(sa) ? sa[0] : (sa ?? '30'));
  ogImageUrl.searchParams.set('ta', Array.isArray(ta) ? ta[0] : (ta ?? '60'));
  ogImageUrl.searchParams.set('ps', Array.isArray(ps) ? ps[0] : (ps ?? '12'));

  // You can fetch existing parent metadata to extend it
  // const previousImages = (await parent).openGraph?.images || [];

  // TODO: Add other metadata like title, description dynamically if needed
  const title = 'Color Sandbox - Dynamic Preview';
  const description =
    'Explore colors and their harmonies. Preview generated dynamically.';

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: [
        {
          url: ogImageUrl.toString(),
          width: 1200,
          height: 675,
          alt: 'Dynamic preview of color sandbox selection',
        },
        // ...previousImages, // Optionally include images from parent routes
      ],
      // Optionally, specify the locale if your page supports it
      // locale: params.locale,
    },
    // Add other metadata tags as needed (e.g., twitter cards)
    // twitter: {
    //   card: 'summary_large_image',
    //   title: title,
    //   description: description,
    //   images: [ogImageUrl.toString()],
    // },
  };
}

// This is now a Server Component by default
export default async function ColorSandboxPage({
  searchParams: pageSearchParams, // Rename to avoid conflict with generateMetadata's searchParams
  params, // Add params here if your page component needs it, e.g. for locale
}: ColorSandboxPageProps) {
  // Destructure specific keys you expect from searchParams
  // Provide a default empty object for searchParams if it could be undefined,
  // though Next.js usually provides it.
  const {
    gh: ghParam,
    gs: gsParam,
    gl: glParam,
  } = (await pageSearchParams) || {};

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

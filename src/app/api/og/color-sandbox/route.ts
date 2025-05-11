import { Color as CuloriColor, converter, formatHex } from 'culori';
import { promises as fs } from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import satori from 'satori';
import sharp from 'sharp';

// Assuming your colorUtils are exportable and work server-side
// Adjust the import path as necessary based on your project structure
import {
  generateAnalogousHarmony,
  generateComplementaryHarmony,
  generateShades,
  generateSplitComplementaryHarmony,
  generateTetradicHarmony,
  generateTints,
  generateTones,
  generateTriadicHarmony,
} from '@/utils/colorUtils'; // Update this path if it's different
import ImageTemplate from './image-template'; // Import the new TSX template

// Helper to convert CuloriColor to a hex string for CSS
export const toCssColor = (color: CuloriColor | undefined): string => {
  if (!color) return '#transparent'; // Fallback for undefined colors
  return formatHex(color);
};

const oklch = converter('oklch');

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const hParam = searchParams.get('gh');
  const sParam = searchParams.get('gs');
  const lParam = searchParams.get('gl');

  // Get harmony angle parameters, with defaults
  const aaParam = searchParams.get('aa');
  const saParam = searchParams.get('sa');
  const taParam = searchParams.get('ta');
  const psParam = searchParams.get('ps'); // Palette Steps

  let analogousAngle = parseFloat(aaParam || '30');
  if (isNaN(analogousAngle)) analogousAngle = 30;

  let splitComplementaryAngle = parseFloat(saParam || '30');
  if (isNaN(splitComplementaryAngle)) splitComplementaryAngle = 30;

  let tetradicAngle = parseFloat(taParam || '60');
  if (isNaN(tetradicAngle)) tetradicAngle = 60;

  let paletteSteps = parseInt(psParam || '12', 10);
  if (isNaN(paletteSteps) || paletteSteps < 0) paletteSteps = 12; // Ensure non-negative

  // Default color if params are missing (e.g., a pleasant blue)
  let primaryColor: CuloriColor = { mode: 'hsl', h: 210, s: 1, l: 0.5 };

  if (hParam && sParam && lParam) {
    const h = parseFloat(hParam);
    const s = parseFloat(sParam); // Assuming 0-100 from URL
    const l = parseFloat(lParam); // Assuming 0-100 from URL

    if (!isNaN(h) && !isNaN(s) && !isNaN(l)) {
      // Keep primaryColor as CuloriColor for toCssColor utility
      primaryColor = { mode: 'hsl', h, s: s / 100, l: l / 100 };
    }
  }

  // Convert primary color to Oklch for harmony functions
  const primaryOklch = oklch(primaryColor) as CuloriColor & { mode: 'oklch' };

  const primaryCssForTemplate = toCssColor(primaryColor);

  try {
    // --- Font Loading ---
    // IMPORTANT: Ensure Roboto-Regular.ttf is in public/fonts/ or adjust path.
    // Vercel deployments might require placing fonts in the api route's directory
    // or using a different approach to bundle them.
    // For local dev, `path.join(process.cwd(), ...)` is usually fine.
    const fontPath = path.join(
      process.cwd(),
      'public',
      'fonts',
      'Roboto-Regular.ttf',
    );
    let fontData: ArrayBuffer;
    try {
      const fileBuffer = await fs.readFile(fontPath);
      // Ensure fontData is ArrayBuffer
      if (fileBuffer.buffer instanceof ArrayBuffer) {
        fontData = fileBuffer.buffer.slice(
          fileBuffer.byteOffset,
          fileBuffer.byteOffset + fileBuffer.byteLength,
        );
      } else {
        // If it's a SharedArrayBuffer or other, convert by copying
        const tempArrayBuffer = new ArrayBuffer(fileBuffer.byteLength);
        const tempView = new Uint8Array(tempArrayBuffer);
        tempView.set(
          new Uint8Array(
            fileBuffer.buffer,
            fileBuffer.byteOffset,
            fileBuffer.byteLength,
          ),
        );
        fontData = tempArrayBuffer;
      }
    } catch (fontError) {
      console.error('Error loading font:', fontError);
      // Fallback: Return a simple error image or message
      return new NextResponse(
        'Error loading font. Please ensure Roboto-Regular.ttf is in public/fonts/',
        { status: 500 },
      );
    }

    // --- Harmony Calculations ---
    // Harmony functions from colorUtils return string[] (CSS hex strings)

    const analogousResult = generateAnalogousHarmony(
      primaryOklch,
      analogousAngle,
    ); // returns string[]
    const complementaryResult = generateComplementaryHarmony(primaryOklch); // returns string[]
    const splitComplementaryResult = generateSplitComplementaryHarmony(
      // returns string[]
      primaryOklch,
      splitComplementaryAngle,
    );
    const tetradicResult = generateTetradicHarmony(primaryOklch, tetradicAngle); // returns string[]
    const triadicResult = generateTriadicHarmony(primaryOklch); // returns string[]

    // --- Tints, Shades, Tones Calculations ---
    const tintsPalette = generateTints(primaryOklch, paletteSteps); // returns string[]
    const shadesPalette = generateShades(primaryOklch, paletteSteps); // returns string[]
    const tonesPalette = generateTones(primaryOklch, paletteSteps); // returns string[]

    // Collect CSS color strings directly
    const harmonyCssColors: string[] = [
      complementaryResult[1], // complementaryResult is [baseCss, H1Css] -> take H1Css
      analogousResult[0], // analogousResult is [H1Css, baseCss, H2Css] -> take H1Css
      analogousResult[2], // -> take H2Css
      triadicResult[1], // triadicResult is [baseCss, H1Css, H2Css] -> take H1Css
      triadicResult[2], // -> take H2Css
      splitComplementaryResult[1], // splitComplementaryResult is [baseCss, H1Css, H2Css] -> take H1Css
      splitComplementaryResult[2], // -> take H2Css
      tetradicResult[1], // tetradicResult is [baseCss, H1Css, H2Css, H3Css] -> take H1Css
      tetradicResult[2], // -> take H2Css
      tetradicResult[3], // -> take H3Css
    ].filter(Boolean); // Filter out any potential undefined/empty strings

    // --- Satori HTML Structure ---
    const imageWidth = 1200;
    const imageHeight = 675; // 16:9 aspect ratio

    // Use the TSX template
    const element = ImageTemplate({
      primaryColorCss: primaryCssForTemplate, // Use the logged variable
      harmonyColorsCss: harmonyCssColors,
      tintsPaletteCss: tintsPalette,
      shadesPaletteCss: shadesPalette,
      tonesPaletteCss: tonesPalette,
    });

    // --- SVG Generation ---
    const svg = await satori(
      element as React.ReactNode, // Satori expects React.ReactNode
      {
        width: imageWidth,
        height: imageHeight,
        fonts: [
          {
            name: 'Roboto',
            data: fontData,
            weight: 400,
            style: 'normal',
          },
        ],
      },
    );

    // --- PNG Conversion ---
    const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();

    // --- Response ---
    return new NextResponse(pngBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, immutable, no-transform, max-age=31536000', // Cache aggressively
      },
    });
  } catch (e: any) {
    console.error('Error generating OG image:', e);
    return new NextResponse(`Failed to generate image: ${e.message}`, {
      status: 500,
    });
  }
}

// Optional: Add a revalidate option if you want Vercel to regenerate these periodically
// export const revalidate = 60 * 60 * 24; // Revalidate once a day

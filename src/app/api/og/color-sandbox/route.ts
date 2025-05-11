import {
  Color as CuloriColor,
  converter,
  differenceCiede2000,
  formatHex,
  inGamut,
  parse,
} from 'culori';
import { promises as fs } from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import satori from 'satori';
import sharp from 'sharp';

// Assuming your colorUtils are exportable and work server-side
// Adjust the import path as necessary based on your project structure
import { CSS_COLOR_NAMES } from '@/helper/colors'; // Import CSS_COLOR_NAMES
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

// Function to find the nearest CSS color name
const findNearestColorName = (inputColorCss: string): string => {
  const inputColorObject = parse(inputColorCss);
  if (!inputColorObject) {
    return 'Unknown Color';
  }

  const labConverter = converter('lab');
  const inputLab = labConverter(inputColorObject);

  if (!inputLab) {
    // If input cannot be converted to Lab, we can't do perceptual matching.
    // Optionally, one could implement a fallback to hex matching here if needed,
    // but for now, we'll indicate an issue finding a match.
    return 'Unknown Color (Lab conversion failed)';
  }

  let bestMatchName = 'Unknown Color';
  let minScore = Infinity; // Lower score is better.
  const SPECIAL_THRESHOLD = 0.1; // Very low Delta E for special underscore matches

  for (const [name, hexValueFromList] of Object.entries(CSS_COLOR_NAMES)) {
    const listItemColorObject = parse(hexValueFromList);
    if (!listItemColorObject) {
      continue; // Skip invalid colors in the list
    }

    const listItemLab = labConverter(listItemColorObject);
    if (!listItemLab) {
      continue; // Skip if list item can't be converted to Lab
    }

    const distance = differenceCiede2000()(inputLab, listItemLab);
    let currentScore: number;

    if (name.startsWith('_')) {
      if (distance < SPECIAL_THRESHOLD) {
        // This is a special underscore color and it's a very close match.
        // Give it a score that prioritizes it over non-special colors and other special colors that are further away.
        // Subtracting 1 ensures it's lower than any raw Delta E (which are >= 0).
        // The actual distance is used to differentiate between multiple special matches.
        currentScore = distance - 1.0;
      } else {
        // It's an underscore color, but not close enough for special treatment.
        // Treat its score with lower priority.
        currentScore = distance + 5;
      }
    } else {
      // Not an underscore-prefixed color, score is just the Delta E distance.
      currentScore = distance;
    }

    if (currentScore < minScore) {
      minScore = currentScore;
      bestMatchName = name;
    }
  }

  if (bestMatchName === 'Unknown Color') {
    return 'Unknown Color'; // Or a more specific message if needed
  }

  // Add spaces to the name, e.g. AliceBlue -> Alice Blue, _Lalamove -> _ Lalamove
  // return bestMatchName.replace(/([A-Z])/g, ' $1').trimStart(); // Removed formatting
  return bestMatchName; // Return the raw key
};

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
  const isPrimaryColorClipped = !inGamut('rgb')(primaryColor);

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
      'NotoSansMono-Black.ttf',
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

    // Find nearest color KEY
    const matchedColorKey = findNearestColorName(primaryCssForTemplate);

    // Load translations and determine display name
    let displayColorName = matchedColorKey; // Default to the key or "Unknown Color" string
    try {
      const translationsPath = path.join(
        process.cwd(),
        'src',
        'i18n',
        'messages',
        'en.json',
      );
      const translationsJson = await fs.readFile(translationsPath, 'utf-8');
      const translations = JSON.parse(translationsJson);

      if (
        translations.Colors &&
        typeof translations.Colors[matchedColorKey] === 'string'
      ) {
        displayColorName = translations.Colors[matchedColorKey];
      } else if (!matchedColorKey.startsWith('Unknown Color')) {
        // Fallback for valid keys not in translation: format the key itself
        if (matchedColorKey.startsWith('_')) {
          const namePart = matchedColorKey.substring(1);
          // Ensure underscore followed by a space, then formatted name part
          displayColorName = '_ ' + namePart.replace(/([A-Z])/g, ' $1').trim();
        } else {
          displayColorName = matchedColorKey
            .replace(/([A-Z])/g, ' $1')
            .trimStart();
        }
      }
      // If matchedColorKey was "Unknown..." or not found and unformattable, it remains as is.
    } catch (error) {
      console.error('Error loading or parsing en.json translations:', error);
      // Fallback if translations fail to load/parse: format the key or use Unknown string
      if (!matchedColorKey.startsWith('Unknown Color')) {
        if (matchedColorKey.startsWith('_')) {
          const namePart = matchedColorKey.substring(1);
          displayColorName = '_ ' + namePart.replace(/([A-Z])/g, ' $1').trim();
        } else {
          displayColorName = matchedColorKey
            .replace(/([A-Z])/g, ' $1')
            .trimStart();
        }
      } else {
        // displayColorName is already matchedColorKey which is "Unknown..."
      }
    }

    // Calculate font size, considering both height and width constraints.

    // 1. Height Constraint:
    // The text block (containing two lines) should take up to 25% of the image height.
    // Each line has a lineHeight of 1.1. So, 2 * fontSize * 1.1 <= 0.25 * imageHeight.
    // fontSize <= (0.25 * imageHeight) / 2.2
    const fontSizeBasedOnHeight = Math.floor(imageHeight * (0.5 / 2.2));

    // 2. Width Constraint:
    // Primary color block width is 52.5% of image width.
    // Text is positioned 20px from the left.
    // Allow for some right padding as well (e.g., 20px).
    const textBlockMaxWidth = imageWidth * 0.525 - 40; // 20px left padding, 20px right effective padding
    const avgCharWidthFactor = 0.6; // Estimated: average character width as a factor of font size. Needs tuning.
    let fontSizeBasedOnWidth = Infinity;
    if (displayColorName.length > 0) {
      fontSizeBasedOnWidth = Math.floor(
        textBlockMaxWidth / (displayColorName.length * avgCharWidthFactor),
      );
    }

    // Final font size is the minimum of the two, with a floor.
    const calculatedFontSize = Math.max(
      16, // Minimum font size
      Math.min(fontSizeBasedOnHeight, fontSizeBasedOnWidth),
    );

    // Use the TSX template
    const element = ImageTemplate({
      primaryColorCss: primaryCssForTemplate, // Use the logged variable
      isPrimaryColorClipped, // Pass the new prop
      harmonyColorsCss: harmonyCssColors,
      tintsPaletteCss: tintsPalette,
      shadesPaletteCss: shadesPalette,
      tonesPaletteCss: tonesPalette,
      displayColorName, // Use the (potentially) translated name
      fontSize: calculatedFontSize,
    });

    // --- SVG Generation ---
    const svg = await satori(
      element as React.ReactNode, // Satori expects React.ReactNode
      {
        width: imageWidth,
        height: imageHeight,
        fonts: [
          {
            name: 'NotoSansMono',
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

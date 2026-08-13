import axios from 'axios';
import { NextResponse } from 'next/server';

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_CONTENT_LENGTH = 2048;
// reCAPTCHA v3 scores range from 0.0 (very likely a bot) to 1.0 (very likely
// human). Treat anything below this threshold as suspicious.
const RECAPTCHA_MIN_SCORE = 0.5;

// Best-effort in-memory rate limiter keyed by client IP. On serverless
// (Vercel) this is per warm instance, but it still raises the cost of spam.
const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 10; // requests per window
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') ?? 'unknown';
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || entry.resetAt < now) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
}

// Prevent Discord @mentions (e.g. @everyone / @here) and role/user pings from
// being injected into the webhook message.
function sanitizeDiscordText(value: string): string {
  return value
    .replace(/@(everyone|here)/gi, '@\u200B$1')
    .replace(/<@[!&]?\d+>/g, '')
    .trim();
}

// To handle a POST request to /api
export async function POST(request: Request) {
  let body: {
    name?: unknown;
    email?: unknown;
    content?: unknown;
    recaptcha?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: 'invalid request body' },
      { status: 400 },
    );
  }

  // Server-side validation: the client-side form validation cannot be trusted.
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const content = typeof body.content === 'string' ? body.content.trim() : '';
  const recaptcha = typeof body.recaptcha === 'string' ? body.recaptcha : '';

  if (
    !name ||
    name.length > MAX_NAME_LENGTH ||
    !email ||
    email.length > MAX_EMAIL_LENGTH ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !content ||
    content.length > MAX_CONTENT_LENGTH ||
    !recaptcha
  ) {
    return NextResponse.json({ message: 'invalid input' }, { status: 400 });
  }

  // Rate limit by client IP.
  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    console.warn('contact request rate limited', { ip });
    return NextResponse.json({ message: 'too many requests' }, { status: 429 });
  }

  // Verify the reCAPTCHA v3 token and require a decent bot score.
  try {
    const verifyToken = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SERVER_KEY,
          response: recaptcha,
        },
        timeout: 10000,
      },
    );
    const data = verifyToken.data as {
      success?: boolean;
      score?: number;
      'error-codes'?: string[];
    };
    if (
      !data.success ||
      (typeof data.score === 'number' && data.score < RECAPTCHA_MIN_SCORE)
    ) {
      console.warn('request recaptcha failed', {
        errorCode: data?.['error-codes'],
        score: data?.score,
      });
      return NextResponse.json(
        { message: 'recaptcha failed' },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error('recaptcha verification error', error);
    return NextResponse.json(
      { message: 'recaptcha verification error' },
      { status: 500 },
    );
  }

  if (!process.env.DISCORD_WEBHOOK_FEEDBACK_URL) {
    console.error('DISCORD_WEBHOOK_FEEDBACK_URL is not configured');
    return NextResponse.json(
      { message: 'server configuration error' },
      { status: 500 },
    );
  }

  try {
    await axios.post(process.env.DISCORD_WEBHOOK_FEEDBACK_URL, {
      content: `## New feedback:\n${sanitizeDiscordText(name)} (${sanitizeDiscordText(email)})\n> ${sanitizeDiscordText(content)}`,
    });
  } catch (error) {
    console.error('Failed to post feedback to Discord', error);
    return NextResponse.json(
      { message: 'failed to send feedback' },
      { status: 500 },
    );
  }

  return NextResponse.json({ message: 'good' }, { status: 200 });
}


import axios from "axios";
import { NextResponse } from "next/server";
// To handle a POST request to /api
export async function POST(request: Request) {
  const body = await request.json();
  console.log(request)
  await axios.post(process.env.DISCORD_WEBHOOK_FEEDBACK_URL!, {
    content: `## New feedback:\n${body.name} (${body.email})\n> ${body.content}`
  })
  // Do whatever you want
  return NextResponse.json({ message: "Hello World" }, { status: 200 });
}

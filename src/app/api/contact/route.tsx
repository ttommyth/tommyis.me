
import axios from "axios";
import { NextResponse } from "next/server";
// To handle a POST request to /api
export async function POST(request: Request) {
  const body = await request.json();
  const verifyToken = await axios.post("https://www.google.com/recaptcha/api/siteverify", {
    secret: process.env.RECAPTCHA_SERVER_KEY,
    response: body.recaptcha
  });
  if(verifyToken.data.success){
    await axios.post(process.env.DISCORD_WEBHOOK_FEEDBACK_URL!, {
      content: `## New feedback:\n${body.name} (${body.email})\n> ${body.content}`
    })
  }else{
    console.warn("request recaptcha failed", body);
    return NextResponse.json({ message: "recaptcha failed" }, { status: 400 });
  }
  return NextResponse.json({ message: "good" }, { status: 200 });
}

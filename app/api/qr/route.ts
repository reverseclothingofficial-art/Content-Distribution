import { NextResponse } from "next/server";

const BACKEND = process.env.EXPO_PUBLIC_API_URL!;

export async function POST(req: Request) {
  const res = await fetch(`${BACKEND}/qr/generate`, {
    method: "POST",
    headers: req.headers,
    body: req.body,
    ...(req.body ? ({ duplex: "half" }) : {}),
  });

  return new NextResponse(res.body, { status: res.status });
}
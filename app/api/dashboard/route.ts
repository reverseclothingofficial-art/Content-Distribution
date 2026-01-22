import { NextResponse } from "next/server";

const BACKEND = process.env.EXPO_PUBLIC_API_URL!;

export async function GET(req: Request) {
  const backendRes = await fetch(`${BACKEND}/qr/analytics`, {
    headers: req.headers,
    cache: "no-store", // always fresh
  });

  return new NextResponse(backendRes.body, {
    status: backendRes.status,
    headers: backendRes.headers,
  });
}

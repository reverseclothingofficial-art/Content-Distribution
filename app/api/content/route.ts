import { NextResponse } from "next/server";

const BACKEND = process.env.EXPO_PUBLIC_API_URL!;

function backendUrl(req: Request) {
  const incoming = new URL(req.url);
  const out = new URL(`${BACKEND}/content`);
  incoming.searchParams.forEach((v, k) => out.searchParams.set(k, v));
  return out.toString();
}


export async function GET(req: Request) {
  const res = await fetch(backendUrl(req), {
    method: "GET",
    headers: req.headers,
  });

  return new NextResponse(res.body, { status: res.status });
}

export async function POST(req: Request) {
  const res = await fetch(backendUrl(req), {
    method: "POST",
    headers: req.headers,
    body: req.body,
    ...(req.body ? ({ duplex: "half" }) : {}),
  });

  return new NextResponse(res.body, { status: res.status });
}




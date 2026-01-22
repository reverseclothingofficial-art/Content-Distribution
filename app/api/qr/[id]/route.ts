import { NextResponse } from "next/server";

const BACKEND = process.env.EXPO_PUBLIC_API_URL!;


export async function GET(req: Request) {
  const url = new URL(req.url);
  const segments = url.pathname.split("/");
  const id = segments[segments.length - 1];

  if (!id) {
    return NextResponse.json(
      { message: "QR id is required" },
      { status: 400 }
    );
  }

  const res = await fetch(`${BACKEND}/qr/${id}`, {
    method: "GET",
    headers: req.headers,
  });

  return new NextResponse(res.body, {
    status: res.status,
    headers: res.headers,
  });
}

import { ParamsProps } from "@/types/common";
import { NextResponse, NextRequest } from "next/server";

const BACKEND = process.env.EXPO_PUBLIC_API_URL!;

export async function GET(req: Request, { params }: ParamsProps) {
  const id = (await params).id;

  if (!id) {
    return NextResponse.json(
      { message: "Content id is required" },
      { status: 400 }
    );
  }

  const backendRes = await fetch(`${BACKEND}/content/${id}`, {
    method: "GET",
    headers: req.headers,
    cache: "no-store",
  });

  return new NextResponse(backendRes.body, {
    status: backendRes.status,
    headers: backendRes.headers,
  });
}

export async function DELETE(req: Request, { params }: ParamsProps) {
  const id = (await params).id;
  if (!id) return new NextResponse("Missing id", { status: 400 });

  const res = await fetch(`${BACKEND}/content/${id}`, {
    method: "DELETE",
    headers: req.headers,
  });

  return new NextResponse(res.body, { status: res.status });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return new NextResponse("Missing id", { status: 400 });
  }

  const body = await req.arrayBuffer();

  const backendRes = await fetch(`${BACKEND}/content/${id}`, {
    method: "PATCH",
    headers: req.headers,
    body,
  });

  return new NextResponse(backendRes.body, {
    status: backendRes.status,
    headers: backendRes.headers,
  });
}

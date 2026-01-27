import { NextResponse } from "next/server";

const BACKEND = process.env.EXPO_PUBLIC_API_URL!;

function backendUrl(req: Request) {
  const incoming = new URL(req.url);
  const out = new URL(`${BACKEND}/content`);
  incoming.searchParams.forEach((v, k) => out.searchParams.set(k, v));
  return out.toString();
}


// export async function GET(req: Request) {
//   const res = await fetch(backendUrl(req), {
//     method: "GET",
//     headers: req.headers,
//   });

//   return new NextResponse(res.body, { status: res.status });
// }

export async function GET(req: Request) {
  const url = new URL(req.url);
  const backendUrl = `${BACKEND}/content?page=${url.searchParams.get('page')}&limit=10`;

  console.log('🔍 Proxy calling:', backendUrl);

  const res = await fetch(backendUrl, {
    cache: 'no-store',  // Match server.ts revalidate: 0
    // Copy server.ts headers logic (add your auth here)
    headers: {
      'Cookie': req.headers.get('cookie') || '',
      // Add other auth headers your backend expects
      // 'Authorization': `Bearer ${getToken()}`,
    },
  });

  const data = await res.json();
  console.log('📡 Proxy backend data.items:', data.data?.length || 0);

  return NextResponse.json({
    items: data.data,  // Match server.ts format!
    total: data.total,
    limit: 10
  });
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




import { Content } from "@/types/content";

const BASE = process.env.EXPO_PUBLIC_API_URL!;

const limit = 10;

export async function fetchContentList(page: number = 1) {
  const url = `${BASE}/content?page=${page}&limit=${limit}`;

  const res = await fetch(url, {
    next: { revalidate: 0 }, 
  });

  if (!res.ok) {
    console.error("fetchContentList error:", res.status);
    throw new Error("Failed to fetch content list");
  }

  const json = await res.json();
  return {
    items: json.data as Content[],
    total: json.total as number,
    limit: json.limit as number,
  };
}

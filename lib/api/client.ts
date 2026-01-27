export async function api<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    credentials: "include",
  });

  if (!res.ok) {
    let message = res.statusText;

    try {
      const data = await res.clone().json();
      message = data?.message || data?.error || message;
    } catch {}

    throw new Error(message);
  }

  if (res.status === 204) return undefined as T;

  const text = await res.text();
  if (!text) return undefined as T;

  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
}

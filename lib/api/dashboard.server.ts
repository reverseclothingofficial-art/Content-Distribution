import "server-only";

export type DashboardSummary = {
  totalScans: number;
  totalQrs: number;
  totalContents: number;
  publicContents: number;
  restrictedContents: number;
  topQrs: {
    qrToken: string;
  scanCount: number;
  }[];
};

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/qr/analytics`, {
    next: { revalidate: 10 },
  });

  if (!res.ok) {
    throw new Error("Failed to load dashboard");
  }

  return res.json();
}

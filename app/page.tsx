import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { TopQrGrid } from "@/components/dashboard/TopQrGrid";
import { getDashboardSummary } from "@/lib/api/dashboard.server";

export default async function Home() {
  const data = await getDashboardSummary();
  return (
    <section className="space-y-10">
      <StatsGrid data={data} />
      <TopQrGrid items={data.topQrs} />
    </section>
  );
}

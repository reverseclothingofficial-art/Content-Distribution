import { StatCard } from "./StatCard";

type StatsProps = {
  data: {
    totalScans: number;
    totalQrs: number;
    totalContents: number;
    publicContents: number;
    restrictedContents: number;
  };
};

export function StatsGrid({ data }: StatsProps) {
  const stats = [
    { label: "Total Scans", value: data.totalScans },
    { label: "Total QR Codes", value: data.totalQrs },
    { label: "Total Contents", value: data.totalContents },
    { label: "Public Contents", value: data.publicContents },
    { label: "Restricted Contents", value: data.restrictedContents },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((s) => (
        <StatCard
          key={s.label}
          label={s.label}
          value={s.value}
        />
      ))}
    </div>
  );
}

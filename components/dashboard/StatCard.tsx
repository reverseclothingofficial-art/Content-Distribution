type CardProps = {
  label: string;
  value: number;
};

export function StatCard({ label, value }: CardProps) {
  return (
    <div
      className="
        rounded-xl border bg-white p-5
        transition-all duration-200
        hover:shadow-md hover:-translate-y-0.5
        cursor-default
      "
    >
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-gray-900">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

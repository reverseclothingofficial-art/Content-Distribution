type Props = {
  qr: {
    qrToken: string;
  scanCount: number;
  };
  rank: number;
};

export function QrCard({ qr, rank }: Props) {
  return (
    <div
      className="
        rounded-xl border bg-white p-4
        transition-all duration-200
        hover:shadow-md hover:-translate-y-0.5
      "
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-400">
          #{rank}
        </span>
        <span className="text-xs text-gray-500">
          {qr.scanCount} scans
        </span>
      </div>

      <p className="mt-3 text-sm font-medium text-gray-900 truncate">
        {qr.qrToken}
      </p>
    </div>
  );
}

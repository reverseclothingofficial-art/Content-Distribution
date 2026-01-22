import { QrCard } from "./QrCard";

type QrItem = {
  qrToken: string;
  scanCount: number;
};

export function TopQrGrid({ items }: { items: QrItem[] }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Top QR Codes</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {items.map((qr, idx) => (
          <QrCard key={qr.qrToken} qr={qr} rank={idx + 1} />
        ))}
      </div>
    </div>
  );
}

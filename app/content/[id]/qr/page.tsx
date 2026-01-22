"use client";

import { useParams } from "next/navigation";
import { useGetQr } from "@/hooks/qr";
import ImageWithSkeleton from "@/components/common/ImageWithSkaleton";
import Button from "@/components/common/Button";

export default function QrDetailPage() {
  const params = useParams<{ id: string }>();
  const contentId = params.id;

  const { data, isLoading, isError } = useGetQr(contentId);

  if (isLoading) return <div>Loading QR...</div>;
  if (isError || !data) return <div>QR not found</div>;

 const handlePrint = (qrImageUrl: string) => {
  const win = window.open("", "_blank", "width=600,height=600");
  if (!win) return;

  const doc = win.document;

  const html = doc.createElement("html");
  const head = doc.createElement("head");
  const body = doc.createElement("body");

  const style = doc.createElement("style");
  style.textContent = `
    body {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      background: white;
    }
    img {
      width: 300px;
      height: 300px;
    }
  `;

  const img = doc.createElement("img");
  img.src = qrImageUrl;
  img.alt = "QR Code";

  head.appendChild(style);
  body.appendChild(img);
  html.appendChild(head);
  html.appendChild(body);

  doc.open();
  doc.appendChild(html);
  doc.close();

  win.onload = () => {
    win.focus();
    win.print();
    win.close();
  };
};



  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow space-y-4">
      <h1 className="text-xl font-semibold">QR Details</h1>

      {data.qrImage && (
        <div className="w-40">
          <ImageWithSkeleton src={data.qrImage} alt="QR Code" />
        </div>
      )}

      <div className="text-sm text-gray-500">
        Created at: {new Date(data.createdAt).toLocaleString()}
      </div>
      <Button type="button" title="Print QR" onClick={()=>handlePrint(data.qrImage)} />
    </div>
  );
}

"use client";

import { useParams } from "next/navigation";
import { useGetContent } from "@/hooks/content";
import ImageWithSkeleton from "@/components/common/ImageWithSkaleton";
import Link from "next/link";

export default function ContentDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const { data, isLoading, error } = useGetContent(id);

  if (isLoading) return <div>Loading...</div>;
  if (error || !data) return <div>Content not found</div>;

  return (
    <div className="max-w-3xl h-full mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">{data?.title}</h1>

      <p className="text-gray-700 mb-4">{data?.description}</p>

      <div className="flex gap-3">
        {data.image && (
          <div className="mb-4 h-80 w-80">
            <ImageWithSkeleton
              className="h-80 w-80"
              src={data.image}
              alt={data.title}
            />
          </div>
        )}

        {data.video && (
          <div className="mb-4 h-80 w-80">
            <video
              src={data.video}
              controls
              className="w-full h-full rounded"
              preload="metadata"
            />
          </div>
        )}
      </div>

      <button className="mt-4">
        <Link
          className="p-2 bg-black text-white mt-3"
          href={`/content/${data._id}/qr`}
        >
          View QR
        </Link>
      </button>
    </div>
  );
}

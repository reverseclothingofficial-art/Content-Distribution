"use client";

import Button from "../common/Button";
import { FiEdit, FiTrash2, IoQrCodeOutline } from "@/components/common/icons";
import { useContentList, useDeleteContent } from "@/hooks/content";
import TableSkeleton from "../common/TableSkeleton";
import ImageWithSkeleton from "../common/ImageWithSkaleton";
import { notify } from "@/lib/toast";
import { useState } from "react";
import EditForm from "./EditForm";
import { useGenerateQr } from "@/hooks/qr";
import { useRouter } from "next/navigation";
import { Content } from "@/types/content";
import Pagination from "./Pagination";

export default function ContentTable({
  initialData,
  page,
  total,
  limit
}: {
  initialData: Content[];
  page: number;
  total: number;
  limit: number;
}) {
  const headItems: string[] = [
    "No",
    "Title",
    "Image",
    "Video",
    "Status",
    "Actions",
  ];
  const [edit, setEdit] = useState<Content | null>(null);
  const { data, isLoading } = useContentList(page,initialData);
  const deleteMut = useDeleteContent(page);
  const generateQrMut = useGenerateQr();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  if (isLoading && !data) return <TableSkeleton />;
  const items: Content[] = data?.items|| [];

  const handleDelete = (id: string) => {
    if (!confirm("Delete this content? This action cannot be undone.")) return;

    setDeletingId(id);
    deleteMut.mutate(id, {
      onSuccess: () => {
        notify.success("Content deleted");
      },
      onError: (err) => {
        notify.error(err?.message || "Failed to delete");
      },
      onSettled: () => {
        setDeletingId(null);
      },
    });
  };

  const handleGenerateQr = (contentId: string) => {
    generateQrMut.mutate(contentId, {
      onSuccess: () => {
        notify.success("QR Code generated");
      },
      onError: (err) => {
        notify.error(err?.message || "Failed to generate QR Code");
      },
    });
  };


  return (
    <div className="bg-white rounded overflow-x-scroll">
      <table className="table-auto w-full">
        <thead className="border border-gray-300 bg-gray-100">
          <tr>
            {headItems.map((headItem, index) => (
              <th className="p-4 text-left font-semibold" key={index}>
                {headItem}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="border border-gray-300 min-h-screen">
          {items.length !== 0 ? (
            items.map((content: Content, index: number) => (
              <tr key={content._id} className="hover:bg-gray-200">
                <td className="p-4">{(limit*(page-1))+index+1}</td>
                <td
                  className="p-4 hover:underline cursor-pointer line-clamp-1"
                  onClick={() => {
                    router.push(`/content/${content._id}`);
                  }}
                >
                  {content.title}
                </td>
                <td className="p-4">
                  <ImageWithSkeleton src={content?.image} alt={content.title} />
                </td>
                <td className="p-4">
                  {content.video ? (
                    <div className="h-20 w-20">
                      <video
                        src={content.video}
                        className="object-cover h-full w-full"
                        muted
                        preload="metadata"
                      />
                    </div>
                  ) : (
                    <div className="h-20 w-20 flex items-center justify-center text-xs text-gray-400 bg-gray-50">
                      No Video
                    </div>
                  )}
                </td>

                <td className="p-4">{content.visibility}</td>

                <td className="p-4 space-x-3 min-w-50">
                  <Button
                    disabled={false}
                    leftIcon={<FiEdit />}
                    onClick={() => setEdit(content)}
                    className="cursor-pointer shadow-gray-200 border-gray-400 text-gray-400"
                  />

                  <Button
                    disabled={deletingId === content._id}
                    leftIcon={<FiTrash2 />}
                    className="cursor-pointer shadow-red-200 border-red-400 text-red-400"
                    onClick={() => handleDelete(content._id)}
                  />

                  <Button
                    leftIcon={<IoQrCodeOutline />}
                    className="cursor-pointer shadow-red-200 border-blue-400 text-blue-400"
                    onClick={() => handleGenerateQr(content._id)}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr className="text-center h-[70vh]">
              <td colSpan={6}>No data Found</td>
            </tr>
          )}
        </tbody>
      </table>
      {edit && (
        <div className="backdrop w-full h-full">
          <EditForm content={edit} onClose={() => setEdit(null)} />
        </div>
      )}
    <Pagination page={page} total={total} />
    </div>
  );
}

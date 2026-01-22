import { Qr } from "@/types/qr";
import { api } from "./client";
const BASE = "/api/qr";

export function generateQr(contentId: string): Promise<Qr> {
  console.log(contentId)
  return api<Qr>(BASE, {
    method: "POST",
      headers: {
    "Content-Type": "application/json",
  },
    body: JSON.stringify({ contentId }),
  });
}

export function getQrByContentId(contentId: string): Promise<Qr> {
  return api<Qr>(`/api/qr/${contentId}`);
}
import { generateQr, getQrByContentId } from "@/lib/api/qr.client";
import { Qr } from "@/types/qr";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGenerateQr() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (contentId:string) => generateQr(contentId),
    
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["qr"] });
    },
  });
}

export const useGetQr = (contentId?: string) =>
  useQuery<Qr>({
    queryKey: ["qr", contentId],
    queryFn: () => getQrByContentId(contentId!),
    enabled: !!contentId,
  });
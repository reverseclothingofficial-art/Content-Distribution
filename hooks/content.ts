// hooks/content.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createContent,
  deleteContent,
  getContent,
  getContentList,
  updateContent,
} from "@/lib/api/content.client";
import { contentKeys } from "@/lib/queryKeys";
import { Content } from "@/types/content";

// 🔧 NEW: Type definitions for payloads
export interface CreateContentPayload {
  title: string;
  description: string;
  image: File;
  video?: File;
  visibility?: string;
}

export interface UpdateContentPayload {
  title: string;
  description: string;
  visibility: string;
  image?: File;
  video?: File;
}

export const useContentList = (
  page = 1, 
  initialItems?: Content[]
) => useQuery({
  queryKey: contentKeys.list(page),
  queryFn: () => getContentList(page),
  initialData: initialItems ? { items: initialItems, total: 0 } : undefined,
  initialDataUpdatedAt: 0,
  staleTime: 30_000,
});

export const useDeleteContent = (page = 1) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: deleteContent,
    onSuccess: () => {
      console.log("✅ Content deleted successfully");
      qc.refetchQueries({ queryKey: contentKeys.list(page) });
    },
  });
};

export const useGetContent = (id?: string) =>
  useQuery({
    queryKey: id ? contentKeys.detail(id) : [],
    queryFn: () => getContent(id!),
    enabled: !!id,
  });

// 🔧 FIXED: Properly typed payload
export function useCreateContent() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateContentPayload) => createContent(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: contentKeys.lists() });
    },
  });
}

// 🔧 FIXED: Properly typed payload
export function useUpdateContent() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      formData,
    }: {
      id: string;
      formData: UpdateContentPayload;
    }) => updateContent(id, formData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: contentKeys.lists() });
    },
  });
}

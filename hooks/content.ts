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
      // Force refetch current page
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

export function useCreateContent() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createContent,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: contentKeys.lists() });
    },
  });
}

export type UpdateVars = {
  id: string;
  formData: FormData;
};

export function useUpdateContent() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: UpdateVars) => updateContent(id, formData),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: contentKeys.lists() });
    },
  });
}

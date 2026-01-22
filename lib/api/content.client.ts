// lib/api/content.client.ts
import { Content } from "@/types/content";
import { api } from "./client";
const BASE = "/api/content";

export function getContentList(
  page = 1
): Promise<{ items: Content[]; total: number }> {
  return api(`${BASE}?page=${page}&limit=10`);
}

export function getContent(id: string): Promise<Content> {
  return api<Content>(`${BASE}/${id}`, {
    method: "GET",
  });
}

export function deleteContent(id: string): Promise<void> {
  return api<void>(`${BASE}/${id}`, {
    method: "DELETE",
  });
}

export function createContent(payload: FormData): Promise<Content> {
  return api<Content>(BASE, {
    method: "POST",
    body: payload,
  });
}

export function updateContent(id: string, payload: FormData): Promise<Content> {
  return api<Content>(`${BASE}/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

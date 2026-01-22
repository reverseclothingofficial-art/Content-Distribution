export const contentKeys = {
  all: ["contents"] as const,
  lists: () => [...contentKeys.all, "list"] as const,
  list: (page: number) => [...contentKeys.lists(), page] as const,
  detail: (id: string) => ["content", id] as const,
};
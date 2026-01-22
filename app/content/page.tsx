import Button from "@/components/common/Button";
import ContentTable from "@/components/content/ContentTable";
import Link from "next/link";
import { MdOutlineAddCard } from "@/components/common/icons";
import { fetchContentList } from "@/lib/api/server";
import { redirect } from "next/navigation";

const LIMIT = 10;

export default async function Content({ searchParams }: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);

  const { items, total, limit } = await fetchContentList(page);
  const totalPages = Math.max(1, Math.ceil(total / LIMIT));
  const safePage = Math.min(page, totalPages);

  if (page !== safePage) {
    redirect(`/content?page=${safePage}`);
  }

  return (
    <div className="w-full space-y-3">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-foreground">Content List</h2>
        <Link href={"/content/create"}>
          <Button
            title="Add Content"
            className="bg-foreground text-background text-sm flex items-center justify-center"
            leftIcon={<MdOutlineAddCard size={18} />}
          />
        </Link>
      </div>
      <ContentTable limit={limit} initialData={items} page={page} total={total} />
    </div>
  );
}

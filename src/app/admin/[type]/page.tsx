import { notFound } from "next/navigation";
import { AdminShell } from "../components/AdminShell";
import { ContentList } from "../components/ContentList";
import { schemas } from "../lib/schemas";

export function generateStaticParams() {
  return Object.keys(schemas).map((type) => ({ type }));
}

export default async function TypeListPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  if (!schemas[type]) notFound();
  return (
    <AdminShell>
      <ContentList type={type} />
    </AdminShell>
  );
}

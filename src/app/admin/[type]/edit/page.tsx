import { notFound } from "next/navigation";
import { AdminShell } from "../../components/AdminShell";
import { ContentForm } from "../../components/ContentForm";
import { schemas } from "../../lib/schemas";

export function generateStaticParams() {
  return Object.keys(schemas).map((type) => ({ type }));
}

export default async function EditItemPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  if (!schemas[type]) notFound();
  return (
    <AdminShell>
      <ContentForm type={type} mode="edit" />
    </AdminShell>
  );
}

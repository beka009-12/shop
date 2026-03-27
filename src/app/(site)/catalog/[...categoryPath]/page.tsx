import FilterCatalog from "@/components/pages/filters/FilterCatalog";

interface Props {
  params: Promise<{ categoryPath: string[] }>;
}

export default async function CategoryPage({ params }: Props) {
  const { categoryPath } = await params;
  const lastSegment = categoryPath?.at(-1);
  const categoryId = lastSegment ? Number(lastSegment) : undefined;

  return <FilterCatalog categoryId={categoryId} />;
}

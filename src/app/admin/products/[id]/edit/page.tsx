import { EditProductView } from "@/views";

export const metadata = {
  title: "Editar Producto",
  description: "Página para editar un producto existente",
};

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditProductView productId={id} />;
}

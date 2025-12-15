import { EditProductView } from "@/views";

export const metadata = {
  title: "Editar Producto",
  description: "Página para editar un producto existente",
};

export default function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  return <EditProductView productId={params.id} />;
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { useGetProductDetailForAdmin } from "@/hooks/api";

import { EditProductForm } from "./edit-product-form";

interface EditProductCardProps {
  productId: string;
}

export const EditProductCard = ({ productId }: EditProductCardProps) => {
  const { data, isLoading, isError } = useGetProductDetailForAdmin(productId);

  if (isLoading) {
    return (
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Cargando producto...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-red-600">
            Error al cargar el producto
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Editar Producto
        </CardTitle>
      </CardHeader>
      <CardContent>
        <EditProductForm productId={productId} productData={data.data} />
      </CardContent>
    </Card>
  );
};

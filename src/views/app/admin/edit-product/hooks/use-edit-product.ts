import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useUpdateProductMutation } from "@/hooks/api";
import { handleApiError } from "@/lib";
import { queryClient } from "@/providers";

export const useEditProduct = () => {
  const router = useRouter();
  const { mutateAsync: updateProductAsync, isPending: isUpdating } =
    useUpdateProductMutation();

  const handleUpdateProduct = async (
    id: string,
    data: {
      title: string;
      description: string;
      price: number;
      stock: number;
      discount: number;
      status: string;
      categoryName: string;
      brandName: string;
      images?: File[];
    }
  ) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("price", data.price.toString());
      formData.append("stock", data.stock.toString());
      formData.append("discount", data.discount.toString());
      formData.append("status", data.status);
      formData.append("categoryName", data.categoryName);
      formData.append("brandName", data.brandName);

      if (data.images && data.images.length > 0) {
        data.images.forEach(image => {
          formData.append("images", image);
        });
      }

      await updateProductAsync({ id, productFormData: formData });

      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Producto actualizado exitosamente");
      router.push("/admin/products");
    } catch (error) {
      const apiError = handleApiError(error);
      toast.error(apiError.details || "Error al actualizar el producto");
    }
  };

  return {
    isLoading: isUpdating,
    actions: { handleUpdateProduct },
  };
};

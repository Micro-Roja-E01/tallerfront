import { useRouter } from "next/navigation";

import { useGetProductDetail } from "@/hooks/api";

export const useProductDetail = (id: string) => {
  // State
  const router = useRouter();

  // API calls
  const {
    data: queryData,
    isLoading,
    error,
    refetch,
  } = useGetProductDetail(id);

  // Computed values
  const productDetail = queryData?.data;

  // Actions
  const handleGoToProducts = () => {
    router.push("/products");
  };

  const handleRetry = () => {
    refetch();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return {
    // Data
    productDetail,
    isLoading,
    error,

    // Actions
    actions: {
      handleGoToProducts,
      handleRetry,
      formatPrice,
    },
  };
};

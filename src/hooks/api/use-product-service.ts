import { useMutation, useQuery } from "@tanstack/react-query";

import { isValidId } from "@/lib";
import {
  AdvancedFiltersParams,
  PaginationQueryParams,
} from "@/models/requests";
import { productService } from "@/services";

export const useGetProductsForCustomer = (
  params: PaginationQueryParams | AdvancedFiltersParams = { pageNumber: 1 }
) => {
  return useQuery({
    queryKey: ["products", "customer", params],
    queryFn: async () => {
      const response = await productService.getProductsForCustomer(params);
      return response.data;
    },
  });
};

export const useGetProductFilters = (enabled = true) => {
  return useQuery({
    queryKey: ["products", "filters"],
    queryFn: async () => {
      const response = await productService.getProductFilters();
      return response.data;
    },
    enabled,
    staleTime: 10 * 60 * 1000, // 10 minutos de cache para los filtros
  });
};

export const useGetProductDetail = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ["products", "detail", id],
    queryFn: async () => {
      const response = await productService.getProductDetail(id);
      return response.data;
    },
    enabled: enabled && isValidId(id),
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetProductDetailForAdmin = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ["products", "detail", "admin", id],
    queryFn: async () => {
      const response = await productService.getProductDetailForAdmin(id);
      return response.data;
    },
    enabled: enabled && isValidId(id),
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetProductsForAdmin = (
  params: PaginationQueryParams = { pageNumber: 1 }
) => {
  return useQuery({
    queryKey: ["products", "admin", params],
    queryFn: async () => {
      const response = await productService.getProductsForAdmin(params);
      return response.data;
    },
  });
};

export const useCreateProductMutation = () => {
  return useMutation({
    mutationFn: async (productFormData: FormData) => {
      const response = await productService.createProduct(productFormData);
      return response.data;
    },
  });
};

export const useToggleProductAvailabilityMutation = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await productService.toggleProductAvailability(id);
      return response.data;
    },
  });
};

export const useUpdateProductMutation = () => {
  return useMutation({
    mutationFn: async ({
      id,
      productFormData,
    }: {
      id: string;
      productFormData: FormData;
    }) => {
      const response = await productService.updateProduct(id, productFormData);
      return response.data;
    },
  });
};

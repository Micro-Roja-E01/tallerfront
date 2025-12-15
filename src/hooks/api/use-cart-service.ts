import { useMutation, useQuery } from "@tanstack/react-query";

import { CartItemRequest } from "@/models/requests";
import { cartService } from "@/services";

export const useGetCart = () => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const response = await cartService.getCart();
      return response.data;
    },
  });
};

export const useAddItemToCartMutation = () => {
  return useMutation({
    mutationFn: async (item: CartItemRequest) => {
      const response = await cartService.addItemToCart(item);
      return response.data;
    },
  });
};

export const useUpdateQuantityMutation = () => {
  return useMutation({
    mutationFn: async (item: CartItemRequest) => {
      const response = await cartService.updateItemQuantity(item);
      return response.data;
    },
  });
};

export const useRemoveItemFromCartMutation = () => {
  return useMutation({
    mutationFn: async (productId: string) => {
      const response = await cartService.removeItemFromCart(productId);
      return response.data;
    },
  });
};

export const useClearCartMutation = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await cartService.clearCart();
      return response.data;
    },
  });
};

export const useCheckoutMutation = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await cartService.checkout();
      return response.data;
    },
  });
};

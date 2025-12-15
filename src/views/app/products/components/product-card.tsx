import { Check, Loader2, ShoppingCart } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui";
import { ProductForCustomerResponse } from "@/models/responses";

import { useProductsCart } from "../hooks";

interface ProductCardProps {
  product: ProductForCustomerResponse;
  onClick?: () => void;
  isPriority?: boolean;
}

export const ProductCard = ({
  product,
  onClick,
  isPriority,
}: ProductCardProps) => {
  const {
    isAdding,
    justAdded,
    actions: { handleAddToCart },
  } = useProductsCart({
    productId: product.id,
    productTitle: product.title,
  });

  return (
    <div
      className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition"
      onClick={onClick}
    >
      <div className="relative w-full h-48 bg-gray-200 flex items-center justify-center">
        <Image
          src={product.mainImageURL}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={isPriority}
          className="object-contain"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg">{product.title}</h3>
        <div className="mt-2">
          {product.discount > 0 ? (
            <>
              <div className="flex items-center gap-2">
                <p className="text-green-600 font-bold text-xl">
                  ${product.finalPrice.toLocaleString("es-CL")}
                </p>
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                  -{product.discount}%
                </span>
              </div>
              <p className="text-gray-500 line-through text-sm">
                ${product.price.toLocaleString("es-CL")}
              </p>
            </>
          ) : (
            <p className="text-blue-700 font-bold text-xl">
              ${product.price.toLocaleString("es-CL")}
            </p>
          )}
        </div>
        <Button
          className="mt-4 w-full cursor-pointer"
          onClick={e => {
            e.stopPropagation();
            handleAddToCart();
          }}
          disabled={isAdding || justAdded}
        >
          {isAdding ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Agregando...
            </>
          ) : justAdded ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              ¡Agregado!
            </>
          ) : (
            <>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Agregar al Carrito
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

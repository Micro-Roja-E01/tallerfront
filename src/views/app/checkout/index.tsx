"use client";

import {
  ArrowLeft,
  CheckCircle,
  Package,
  Receipt,
  ShoppingBag,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button, Card, Skeleton } from "@/components/ui";
import { thousandSeparatorPipe } from "@/lib";

import {
  CheckoutDialog,
  CheckoutItemSkeleton,
  CheckoutSummarySkeleton,
} from "./components";
import { useCheckoutView } from "./hooks";

export default function CheckoutView() {
  const {
    items,
    cart: { totalPrice, hasItems },
    checkout: { changes: checkoutChanges, showDialog: showCheckoutDialog },
    isLoading,
    showSkeletons,
    actions: { handleCheckout, handleCreateOrder, handleCancelCheckout },
  } = useCheckoutView();

  if (!hasItems && !showSkeletons) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-2xl">
        <ShoppingBag className="w-24 h-24 mx-auto text-muted-foreground/40 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">
          No hay productos para revisar
        </h2>
        <p className="text-muted-foreground mb-6">
          Tu carrito está vacío. Agrega algunos productos para continuar.
        </p>
        <Link href="/products">
          <Button size="lg" className="cursor-pointer">
            Ver productos
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <Link href="/cart">
          <Button variant="outline" className="mb-4 cursor-pointer">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al carrito
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Revisar Pedido</h1>
        <p className="text-muted-foreground mt-1">
          Verifica tu pedido antes de confirmar
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Products */}
        <div className="lg:col-span-2 space-y-6">
          {/* Products Section */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">
                  Productos {!showSkeletons && `(${items.length})`}
                  {showSkeletons && (
                    <Skeleton className="inline-block w-8 h-5 ml-1" />
                  )}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Revisa los productos de tu pedido
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {showSkeletons ? (
                <>
                  {[1, 2, 3].map(i => (
                    <CheckoutItemSkeleton key={i} />
                  ))}
                </>
              ) : (
                items.map(item => (
                  <div
                    key={item.productId}
                    className="flex gap-4 pb-4 border-b last:border-b-0 last:pb-0"
                  >
                    {item.productImageUrl && (
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <Image
                          src={item.productImageUrl}
                          alt={item.productTitle}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium line-clamp-2">
                        {item.productTitle}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Cantidad: {item.quantity}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        ${thousandSeparatorPipe(item.price)} c/u
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-semibold">
                        ${thousandSeparatorPipe(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Receipt className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-bold">Resumen del Pedido</h2>
            </div>

            {showSkeletons ? (
              <CheckoutSummarySkeleton />
            ) : (
              <div className="space-y-3 mb-6">
                {/* Detailed breakdown by product */}
                <div className="space-y-2 pb-3 border-b">
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Desglose:
                  </p>
                  {items.map(item => (
                    <div
                      key={item.productId}
                      className="flex justify-between text-xs"
                    >
                      <span className="text-muted-foreground">
                        {item.quantity} × ${thousandSeparatorPipe(item.price)}
                      </span>
                      <span className="font-medium">
                        ${thousandSeparatorPipe(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Subtotal */}
                <div className="flex justify-between text-sm pt-2">
                  <span className="text-muted-foreground">
                    Subtotal ({items.length}{" "}
                    {items.length === 1 ? "producto" : "productos"})
                  </span>
                  <span className="font-medium">
                    ${thousandSeparatorPipe(totalPrice)}
                  </span>
                </div>

                {/* Total */}
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">Total a Pagar</span>
                    <span className="font-bold text-2xl text-primary">
                      ${thousandSeparatorPipe(totalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <Button
              className="w-full mb-3 cursor-pointer"
              size="lg"
              onClick={handleCheckout}
              disabled={isLoading || showSkeletons}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Verificando...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Confirmar Pedido
                </>
              )}
            </Button>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
                <span>Compra 100% segura</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-4 h-4 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                </div>
                <span>Garantía de devolución</span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-4 pt-4 border-t">
              Al continuar, aceptas nuestros términos y condiciones
            </p>
          </Card>
        </div>
      </div>

      {/* Checkout Changes Dialog */}
      <CheckoutDialog
        showCheckoutDialog={showCheckoutDialog}
        checkoutChanges={checkoutChanges}
        cancelCheckout={handleCancelCheckout}
        createOrder={handleCreateOrder}
      />
    </div>
  );
}

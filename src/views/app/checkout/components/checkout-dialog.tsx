import {
  AlertCircle,
  CheckCircle,
  Package,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui";

interface CheckoutDialogProps {
  showCheckoutDialog: boolean;
  checkoutChanges: {
    hasChanges: boolean;
    removedItems: { title: string }[];
    updatedItems: { title: string; oldQuantity: number; newQuantity: number }[];
  } | null;
  cancelCheckout: () => void;
  createOrder: () => void;
}

export const CheckoutDialog = ({
  showCheckoutDialog,
  checkoutChanges,
  cancelCheckout,
  createOrder,
}: CheckoutDialogProps) => {
  const hasChanges = checkoutChanges?.hasChanges ?? false;

  return (
    <AlertDialog open={showCheckoutDialog}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          {hasChanges ? (
            <>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                Tu carrito ha sido actualizado
              </AlertDialogTitle>
              <AlertDialogDescription>
                Algunos productos en tu carrito han cambiado su disponibilidad.
                Revisa los cambios antes de confirmar tu pedido.
              </AlertDialogDescription>
            </>
          ) : (
            <>
              <AlertDialogTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-green-500" />
                Carrito confirmado
              </AlertDialogTitle>
              <AlertDialogDescription>
                Tu carrito está listo. Todos los productos están disponibles.
                ¿Deseas confirmar tu pedido?
              </AlertDialogDescription>
            </>
          )}
        </AlertDialogHeader>

        {hasChanges ? (
          <div className="space-y-4 my-4 max-h-96 overflow-y-auto">
            {checkoutChanges?.removedItems &&
              checkoutChanges.removedItems.length > 0 && (
                <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg">
                  <h3 className="font-semibold text-destructive mb-3 flex items-center gap-2">
                    <Trash2 className="h-4 w-4" />
                    Productos no disponibles (
                    {checkoutChanges.removedItems.length})
                  </h3>
                  <ul className="space-y-2">
                    {checkoutChanges.removedItems.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm"
                      >
                        <span className="text-destructive">•</span>
                        <span className="text-muted-foreground">
                          {item.title}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-muted-foreground mt-3">
                    Estos productos fueron removidos de tu carrito porque ya no
                    están disponibles.
                  </p>
                </div>
              )}

            {checkoutChanges?.updatedItems &&
              checkoutChanges.updatedItems.length > 0 && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg">
                  <h3 className="font-semibold text-yellow-700 dark:text-yellow-500 mb-3 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Cantidades ajustadas ({checkoutChanges.updatedItems.length})
                  </h3>
                  <ul className="space-y-3">
                    {checkoutChanges.updatedItems.map((item, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="text-muted-foreground flex-1">
                          {item.title}
                        </span>
                        <span className="flex items-center gap-2 text-right">
                          <span className="line-through text-muted-foreground/60">
                            {item.oldQuantity}
                          </span>
                          <span className="text-muted-foreground">→</span>
                          <span className="font-semibold text-yellow-700 dark:text-yellow-500">
                            {item.newQuantity}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-muted-foreground mt-3">
                    Las cantidades fueron ajustadas según el stock disponible.
                  </p>
                </div>
              )}
          </div>
        ) : (
          <div className="my-4">
            <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-green-700 dark:text-green-500 mb-1">
                    Verificación exitosa
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Todos los productos en tu carrito están disponibles y las
                    cantidades son correctas. Puedes proceder con tu pedido.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel
            className="cursor-pointer"
            onClick={cancelCheckout}
          >
            {hasChanges ? "Revisar carrito" : "Cancelar"}
          </AlertDialogCancel>
          <AlertDialogAction
            className="cursor-pointer bg-primary hover:bg-primary/90 flex items-center gap-2"
            onClick={createOrder}
          >
            <Package className="h-4 w-4" />
            Crear Pedido
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

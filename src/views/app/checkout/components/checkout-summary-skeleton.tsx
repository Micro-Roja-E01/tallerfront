import { Skeleton } from "@/components/ui";

export const CheckoutSummarySkeleton = () => {
  return (
    <div className="space-y-4 mb-6">
      <div className="space-y-2 pb-3 border-b">
        <p className="text-sm font-medium text-muted-foreground mb-2">
          Desglose:
        </p>
        {[1, 2, 3].map(i => (
          <div key={i} className="flex justify-between text-xs">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>

      <div className="flex justify-between text-sm pt-2">
        <span className="text-muted-foreground">Subtotal</span>
        <Skeleton className="h-5 w-24" />
      </div>

      <div className="border-t pt-3 mt-3">
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg">Total a Pagar</span>
          <Skeleton className="h-8 w-32" />
        </div>
      </div>
    </div>
  );
};

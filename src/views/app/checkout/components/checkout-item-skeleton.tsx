import { Skeleton } from "@/components/ui";

export const CheckoutItemSkeleton = () => {
  return (
    <div className="flex gap-4 pb-4 border-b last:border-b-0 last:pb-0">
      <Skeleton className="w-20 h-20 flex-shrink-0 rounded" />
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-20" />
      </div>
      <div className="text-right flex-shrink-0">
        <Skeleton className="h-6 w-24" />
      </div>
    </div>
  );
};

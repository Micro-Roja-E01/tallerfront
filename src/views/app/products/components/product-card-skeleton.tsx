import { Skeleton } from "@/components/ui";

export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="relative w-full h-48 bg-gray-200 flex items-center justify-center">
        <Skeleton className="w-full h-full" />
      </div>

      <div className="p-4">
        <Skeleton className="h-7 w-3/4 mb-2" />

        <div className="mt-2">
          <Skeleton className="h-6 w-1/2" />
        </div>

        <div className="mt-4">
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
};

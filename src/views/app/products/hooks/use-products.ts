import { useRouter } from "next/navigation";
import { MouseEvent, useCallback, useState } from "react";

import { useGetProductFilters, useGetProductsForCustomer } from "@/hooks/api";
import { AdvancedFiltersParams } from "@/models/requests";

import { AdvancedFiltersState } from "../components";

export const useProducts = () => {
  // State
  const [filters, setFilters] = useState<AdvancedFiltersParams>({
    pageNumber: 1,
    pageSize: 10,
    searchTerm: "",
    categories: [],
    brands: [],
    statuses: [],
    minPrice: undefined,
    maxPrice: undefined,
  });

  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFiltersState>({
    categories: [],
    brands: [],
    statuses: [],
    minPrice: undefined,
    maxPrice: undefined,
  });

  const router = useRouter();

  // API calls
  const {
    data: queryData,
    isLoading,
    error,
    refetch,
  } = useGetProductsForCustomer(filters);

  const { data: filtersQueryData, isLoading: isLoadingFilters } =
    useGetProductFilters();

  // Computed values
  const productsData = queryData?.data;
  const products = productsData?.products ?? [];
  const totalPages = productsData?.totalPages ?? 0;
  const totalCount = productsData?.totalCount ?? 0;
  const currentPage = productsData?.currentPage ?? 1;

  const filtersData = filtersQueryData?.data;

  const generatePageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage <= 3) {
        pages.push(2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push("...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return pages;
  };

  const pageNumbers = totalPages > 1 ? generatePageNumbers() : [];

  // Actions
  const handleUpdateFilters = (newFilters: Partial<AdvancedFiltersParams>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleGoToPage = (page: number) => {
    handleUpdateFilters({ pageNumber: page });
  };

  const handleSearch = (searchTerm: string) => {
    handleUpdateFilters({ searchTerm, pageNumber: 1 });
  };

  const handleChangePageSize = (pageSize: number) => {
    handleUpdateFilters({ pageSize, pageNumber: 1 });
  };

  const handleRedirectToProductDetail = (productId: number) => {
    router.push(`/products/${productId}`);
  };

  const handlePreviousPage = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (currentPage > 1) {
      handleGoToPage(currentPage - 1);
    }
  };

  const handleNextPage = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (currentPage < totalPages) {
      handleGoToPage(currentPage + 1);
    }
  };

  const handlePageClick = (
    e: MouseEvent<HTMLAnchorElement>,
    pageNum: number
  ) => {
    e.preventDefault();
    handleGoToPage(pageNum);
  };

  const handleRetry = () => {
    refetch();
  };

  // Acciones para filtros avanzados
  const handleAdvancedFiltersChange = useCallback(
    (newAdvancedFilters: AdvancedFiltersState) => {
      setAdvancedFilters(newAdvancedFilters);
      handleUpdateFilters({
        categories: newAdvancedFilters.categories,
        brands: newAdvancedFilters.brands,
        statuses: newAdvancedFilters.statuses,
        minPrice: newAdvancedFilters.minPrice,
        maxPrice: newAdvancedFilters.maxPrice,
        pageNumber: 1, // Reset página al cambiar filtros
      });
    },
    []
  );

  const handleRemoveCategory = useCallback(
    (category: string) => {
      const newCategories = advancedFilters.categories.filter(
        c => c !== category
      );
      handleAdvancedFiltersChange({
        ...advancedFilters,
        categories: newCategories,
      });
    },
    [advancedFilters, handleAdvancedFiltersChange]
  );

  const handleRemoveBrand = useCallback(
    (brand: string) => {
      const newBrands = advancedFilters.brands.filter(b => b !== brand);
      handleAdvancedFiltersChange({ ...advancedFilters, brands: newBrands });
    },
    [advancedFilters, handleAdvancedFiltersChange]
  );

  const handleRemoveStatus = useCallback(
    (status: string) => {
      const newStatuses = advancedFilters.statuses.filter(s => s !== status);
      handleAdvancedFiltersChange({
        ...advancedFilters,
        statuses: newStatuses,
      });
    },
    [advancedFilters, handleAdvancedFiltersChange]
  );

  const handleRemovePriceRange = useCallback(() => {
    handleAdvancedFiltersChange({
      ...advancedFilters,
      minPrice: undefined,
      maxPrice: undefined,
    });
  }, [advancedFilters, handleAdvancedFiltersChange]);

  const handleClearAllFilters = useCallback(() => {
    const clearedFilters: AdvancedFiltersState = {
      categories: [],
      brands: [],
      statuses: [],
      minPrice: undefined,
      maxPrice: undefined,
    };
    handleAdvancedFiltersChange(clearedFilters);
  }, [handleAdvancedFiltersChange]);

  return {
    // Product data
    products,
    pagination: {
      totalPages,
      totalCount,
      currentPage,
      pageNumbers,
    },

    // Loading and error states
    isLoading,
    error,

    // Filter state
    filters,
    advancedFilters,

    // Filters data from API
    filtersData,
    isLoadingFilters,

    // Actions
    actions: {
      handleSearch,
      handleChangePageSize,
      handleRedirectToProductDetail,
      handlePreviousPage,
      handleNextPage,
      handlePageClick,
      handleRetry,
      // Advanced filters actions
      handleAdvancedFiltersChange,
      handleRemoveCategory,
      handleRemoveBrand,
      handleRemoveStatus,
      handleRemovePriceRange,
      handleClearAllFilters,
    },
  };
};

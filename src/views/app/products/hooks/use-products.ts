import { useRouter } from "next/navigation";
import { MouseEvent, useCallback, useMemo, useState } from "react";

import { useGetProductsForCustomer } from "@/hooks/api";
import { AdvancedFiltersParams } from "@/models/requests";
import { ProductFiltersResponse } from "@/models/responses";

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

  // API calls - Obtener todos los productos sin filtros para calcular las opciones de filtro
  const { data: allProductsData } = useGetProductsForCustomer({
    pageNumber: 1,
    pageSize: 1000, // Obtener suficientes productos para calcular filtros
  });

  // API calls - Productos con filtros aplicados (intentamos filtrar en backend)
  const {
    data: queryData,
    isLoading,
    error,
    refetch,
  } = useGetProductsForCustomer(filters);

  // Computed values
  const productsData = queryData?.data;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const rawProducts = productsData?.products ?? [];

  // Filtrar productos en el cliente (como fallback si el backend no filtra)
  const products = useMemo(() => {
    let filtered = rawProducts;

    // Filtrar por categorías
    if (advancedFilters.categories.length > 0) {
      filtered = filtered.filter(p =>
        advancedFilters.categories.includes(p.categoryName)
      );
    }

    // Filtrar por marcas
    if (advancedFilters.brands.length > 0) {
      filtered = filtered.filter(p =>
        advancedFilters.brands.includes(p.brandName)
      );
    }

    // Filtrar por estados
    if (advancedFilters.statuses.length > 0) {
      filtered = filtered.filter(p =>
        advancedFilters.statuses.includes(p.statusName)
      );
    }

    // Filtrar por precio mínimo
    if (advancedFilters.minPrice !== undefined) {
      filtered = filtered.filter(
        p => (p.finalPrice ?? p.price) >= advancedFilters.minPrice!
      );
    }

    // Filtrar por precio máximo
    if (advancedFilters.maxPrice !== undefined) {
      filtered = filtered.filter(
        p => (p.finalPrice ?? p.price) <= advancedFilters.maxPrice!
      );
    }

    return filtered;
  }, [rawProducts, advancedFilters]);

  const totalPages = productsData?.totalPages ?? 0;
  const totalCount = productsData?.totalCount ?? 0;
  const currentPage = productsData?.currentPage ?? 1;

  // Calcular filtros dinámicamente desde todos los productos
  const filtersData: ProductFiltersResponse | undefined = useMemo(() => {
    const allProducts = allProductsData?.data?.products ?? [];

    if (allProducts.length === 0) return undefined;

    // Contar categorías
    const categoryCount = new Map<string, number>();
    allProducts.forEach(p => {
      if (p.categoryName) {
        categoryCount.set(
          p.categoryName,
          (categoryCount.get(p.categoryName) ?? 0) + 1
        );
      }
    });

    // Contar marcas
    const brandCount = new Map<string, number>();
    allProducts.forEach(p => {
      if (p.brandName) {
        brandCount.set(p.brandName, (brandCount.get(p.brandName) ?? 0) + 1);
      }
    });

    // Contar estados
    const statusCount = new Map<string, number>();
    allProducts.forEach(p => {
      if (p.statusName) {
        statusCount.set(p.statusName, (statusCount.get(p.statusName) ?? 0) + 1);
      }
    });

    // Calcular rango de precios
    const prices = allProducts
      .map(p => p.finalPrice ?? p.price)
      .filter(p => p > 0);
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 1000000;

    return {
      categories: Array.from(categoryCount.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => a.name.localeCompare(b.name)),
      brands: Array.from(brandCount.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => a.name.localeCompare(b.name)),
      statuses: Array.from(statusCount.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => a.name.localeCompare(b.name)),
      minPrice,
      maxPrice,
    };
  }, [allProductsData]);

  const isLoadingFilters = !allProductsData;

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

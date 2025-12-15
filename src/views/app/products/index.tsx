"use client";

import { Suspense } from "react";

import { handleApiError } from "@/lib";
import { ProductForCustomerResponse } from "@/models/responses";

import {
  ActiveFiltersDisplay,
  AdvancedFilters,
  FilterBar,
  ProductCard,
  ProductCardSkeleton,
  ProductsEmptyState,
  ProductsErrorState,
  ProductsPagination,
} from "./components";
import { useProducts } from "./hooks";

export default function ProductsView() {
  const {
    products,
    pagination,
    isLoading,
    error,
    filters,
    advancedFilters,
    filtersData,
    isLoadingFilters,
    actions,
  } = useProducts();

  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <div className="flex flex-col gap-y-4">
        <h1 className="flex justify-center items-center text-2xl sm:text-5xl p-2 pt-4 italic">
          Productos disponibles
        </h1>

        {/* Barra de filtros básicos (búsqueda y paginación) - encima de todo */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-5">
          <FilterBar
            maxPageSize={pagination.totalCount}
            onSearch={actions.handleSearch}
            onPageSizeChange={actions.handleChangePageSize}
            currentPageSize={filters.pageSize ?? 10}
            currentSearch={filters.searchTerm ?? ""}
          />
        </div>

        {/* Layout principal con sidebar de filtros y contenido */}
        <div className="flex gap-6 px-5">
          {/* Sidebar de filtros (desktop) */}
          <AdvancedFilters
            filtersData={filtersData}
            isLoading={isLoadingFilters}
            currentFilters={advancedFilters}
            onFiltersChange={actions.handleAdvancedFiltersChange}
          />

          {/* Contenedor principal de productos */}
          <div className="flex-1 min-w-0">
            {/* Mostrar filtros activos como badges */}
            <ActiveFiltersDisplay
              filters={advancedFilters}
              onRemoveCategory={actions.handleRemoveCategory}
              onRemoveBrand={actions.handleRemoveBrand}
              onRemoveStatus={actions.handleRemoveStatus}
              onRemovePriceRange={actions.handleRemovePriceRange}
              onClearAll={actions.handleClearAllFilters}
            />

            {error &&
              !handleApiError(error).message.includes(
                "Producto no encontrado"
              ) && (
                <ProductsErrorState
                  error={handleApiError(error).details}
                  canRetry={handleApiError(error).canRetry}
                  onRetry={actions.handleRetry}
                />
              )}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-5">
              {isLoading ? (
                <>
                  {Array.from({ length: filters.pageSize ?? 10 }).map(
                    (_, index) => (
                      <ProductCardSkeleton key={`skeleton-${index}`} />
                    )
                  )}
                </>
              ) : (
                products.map((product: ProductForCustomerResponse) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isPriority={product.mainImageURL.includes("default")}
                    onClick={() =>
                      actions.handleRedirectToProductDetail(product.id)
                    }
                  />
                ))
              )}
            </div>

            <ProductsPagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              pageNumbers={pagination.pageNumbers}
              onPreviousPage={actions.handlePreviousPage}
              onNextPage={actions.handleNextPage}
              onPageClick={actions.handlePageClick}
            />

            {products.length === 0 &&
              !isLoading &&
              handleApiError(error).message.includes(
                "Producto no encontrado"
              ) && <ProductsEmptyState />}
          </div>
        </div>
      </div>
    </Suspense>
  );
}

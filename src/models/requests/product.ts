export interface PaginationQueryParams {
  pageNumber: number;
  pageSize?: number;
  searchTerm?: string;
}

export interface AdvancedFiltersParams extends PaginationQueryParams {
  categories?: string[];
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  statuses?: string[];
}

export interface CreateProductRequest {
  title: string;
  description: string;
  price: number;
  stock: number;
  discount: number;
  status: string;
  categoryName: string;
  brandName: string;
  images: File[];
}

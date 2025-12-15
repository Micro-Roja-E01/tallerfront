export interface ProductForCustomerResponse {
  id: number;
  title: string;
  description: string;
  mainImageURL: string;
  price: number;
  discount: number;
}

export interface ProductListForCustomerResponse {
  products: ProductForCustomerResponse[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface ProductDetailForCustomerResponse {
  id: number;
  title: string;
  description: string;
  mainImageURL: string;
  imageUrls: string[];
  price: number;
  finalPrice: number;
  discountPercentage: number;
  stock: number;
  stockIndicator: string;
  categoryName: string;
  brandName: string;
  isAvailable: boolean;
  statusName: string;
}

export interface ProductForAdminResponse {
  id: number;
  title: string;
  mainImageURL: string;
  price: number;
  stock: number;
  stockIndicator: string;
  categoryName: string;
  brandName: string;
  statusName: string;
  isAvailable: boolean;
  updatedAt: string;
}

export interface ProductListForAdminResponse {
  products: ProductForAdminResponse[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface FilterOptionWithCount {
  name: string;
  count: number;
}

export interface ProductFiltersResponse {
  categories: FilterOptionWithCount[];
  brands: FilterOptionWithCount[];
  statuses: FilterOptionWithCount[];
  minPrice: number;
  maxPrice: number;
}

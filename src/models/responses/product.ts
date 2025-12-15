export interface ProductForCustomerResponse {
  id: number;
  title: string;
  description?: string;
  mainImageURL: string;
  price: number;
  discount: number;
  finalPrice: number;
  stock?: number;
  stockIndicator?: string;
  categoryName: string;
  brandName: string;
  isAvailable: boolean;
  hasDiscount: boolean;
  statusName: string;
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
  discount: number;
  finalPrice: number;
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

export interface ImageDetailResponse {
  id: number;
  imageUrl: string;
  publicId: string;
  createdAt: string;
}

export interface ProductDetailForAdminResponse {
  id: number;
  title: string;
  description: string;
  price: number;
  discount: number;
  finalPrice: number;
  stock: number;
  status: string;
  isAvailable: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  categoryId: number;
  categoryName: string;
  brandId: number;
  brandName: string;
  images: ImageDetailResponse[];
  stockIndicator: string;
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

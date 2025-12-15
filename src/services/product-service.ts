import { AxiosRequestConfig } from "axios";

import { ApiResponse } from "@/models/generics";
import {
  AdvancedFiltersParams,
  PaginationQueryParams,
} from "@/models/requests";
import {
  ProductDetailForAdminResponse,
  ProductDetailForCustomerResponse,
  ProductFiltersResponse,
  ProductListForAdminResponse,
  ProductListForCustomerResponse,
} from "@/models/responses";

import { BaseApiService } from "./base-api-service";

export class ProductService extends BaseApiService {
  constructor() {
    super("");
  }

  getProductsForCustomer(
    params?: PaginationQueryParams | AdvancedFiltersParams
  ) {
    const queryParams = params ? this.buildQueryParams(params) : {};
    return this.httpClient.get<ApiResponse<ProductListForCustomerResponse>>(
      `${this.baseURL}/products`,
      { params: queryParams } as AxiosRequestConfig
    );
  }

  private buildQueryParams(
    params: PaginationQueryParams | AdvancedFiltersParams
  ) {
    const queryParams: Record<string, string | number | undefined> = {
      pageNumber: params.pageNumber,
      pageSize: params.pageSize,
      searchTerm: params.searchTerm,
    };

    if ("categories" in params && params.categories?.length) {
      queryParams.categories = params.categories.join(",");
    }
    if ("brands" in params && params.brands?.length) {
      queryParams.brands = params.brands.join(",");
    }
    if ("statuses" in params && params.statuses?.length) {
      queryParams.statuses = params.statuses.join(",");
    }
    if ("minPrice" in params && params.minPrice !== undefined) {
      queryParams.minPrice = params.minPrice;
    }
    if ("maxPrice" in params && params.maxPrice !== undefined) {
      queryParams.maxPrice = params.maxPrice;
    }

    return queryParams;
  }

  getProductFilters() {
    return this.httpClient.get<ApiResponse<ProductFiltersResponse>>(
      `${this.baseURL}/products/filters`
    );
  }

  getProductDetail(id: string) {
    return this.httpClient.get<ApiResponse<ProductDetailForCustomerResponse>>(
      `${this.baseURL}/products/${id}`
    );
  }

  getProductDetailForAdmin(id: string) {
    return this.httpClient.get<ApiResponse<ProductDetailForAdminResponse>>(
      `${this.baseURL}/admin/${id}/detailed`
    );
  }

  getProductsForAdmin(params?: PaginationQueryParams) {
    return this.httpClient.get<ApiResponse<ProductListForAdminResponse>>(
      `${this.baseURL}/admin/products`,
      { params } as AxiosRequestConfig
    );
  }

  createProduct(productFormData: FormData) {
    return this.httpClient.post<ApiResponse<string>>(
      `${this.baseURL}/admin/create-with-files`,
      productFormData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
  }

  toggleProductAvailability(id: string) {
    return this.httpClient.patch<ApiResponse<string>>(
      `${this.baseURL}/admin/${id}/toggle-availability`
    );
  }

  updateProduct(id: string, productFormData: FormData) {
    return this.httpClient.put<ApiResponse<string>>(
      `${this.baseURL}/admin/products/${id}`,
      productFormData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
  }
}

export const productService = new ProductService();

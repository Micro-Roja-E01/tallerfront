import { AxiosRequestConfig } from "axios";

import { ApiResponse } from "@/models/generics";
import { PaginationQueryParams } from "@/models/requests";
import {
  ProductDetailForCustomerResponse,
  ProductListForAdminResponse,
  ProductListForCustomerResponse,
} from "@/models/responses";

import { BaseApiService } from "./base-api-service";

export class ProductService extends BaseApiService {
  constructor() {
    super("");
  }

  getProductsForCustomer(params?: PaginationQueryParams) {
    return this.httpClient.get<ApiResponse<ProductListForCustomerResponse>>(
      `${this.baseURL}/products`,
      { params } as AxiosRequestConfig
    );
  }

  getProductDetail(id: string) {
    return this.httpClient.get<ApiResponse<ProductDetailForCustomerResponse>>(
      `${this.baseURL}/products/${id}`
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
      `${this.baseURL}/admin/products/${id}/toggle-availability`
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

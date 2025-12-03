import { api } from './api';
import type { Product } from '../types';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  category: string;
  size: string;
  material: string;
  image: string;
  stock?: number;
}

export interface UpdateProductData extends Partial<CreateProductData> {}

export const productService = {
  // Get all products
  async getAllProducts(): Promise<Product[]> {
    const response = await api.get<ApiResponse<Product[]>>('/products');
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch products');
    }
    return response.data;
  },

  // Get product by ID
  async getProductById(id: number): Promise<Product> {
    const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch product');
    }
    return response.data;
  },

  // Get products by category
  async getProductsByCategory(category: string): Promise<Product[]> {
    const response = await api.get<ApiResponse<Product[]>>(`/products/category/${category}`);
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch products');
    }
    return response.data;
  },

  // Create new product
  async createProduct(data: CreateProductData): Promise<Product> {
    const response = await api.post<ApiResponse<Product>>('/products', data);
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to create product');
    }
    return response.data;
  },

  // Update product
  async updateProduct(id: number, data: UpdateProductData): Promise<Product> {
    const response = await api.put<ApiResponse<Product>>(`/products/${id}`, data);
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to update product');
    }
    return response.data;
  },

  // Delete product
  async deleteProduct(id: number): Promise<void> {
    const response = await api.delete<ApiResponse<null>>(`/products/${id}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete product');
    }
  },
};

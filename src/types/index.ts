export interface Product {
  id: number;
  name: string;
  price: number;
  size: string;
  material: string;
  image: string;
  description: string;
  category: 'cotton' | 'linen' | 'silk' | 'synthetic';
  stock?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export type LoadingState = 'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}


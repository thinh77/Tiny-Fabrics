export interface Product {
  id: number;
  name: string;
  price: number;
  size: string;
  material: string;
  image: string;
  description: string;
  category: 'cotton' | 'linen' | 'silk' | 'synthetic';
}

export interface CartItem extends Product {
  quantity: number;
}

export type LoadingState = 'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR';


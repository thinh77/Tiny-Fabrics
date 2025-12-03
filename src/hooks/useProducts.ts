import { useState, useEffect, useCallback } from 'react';
import { productService } from '../services/product.service';
import type { Product, LoadingState } from '../types';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<LoadingState>('IDLE');
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading('LOADING');
    setError(null);
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
      setLoading('SUCCESS');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      setLoading('ERROR');
    }
  }, []);

  const addProduct = useCallback(async (productData: Parameters<typeof productService.createProduct>[0]) => {
    try {
      const newProduct = await productService.createProduct(productData);
      setProducts(prev => [newProduct, ...prev]);
      return newProduct;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create product');
    }
  }, []);

  const updateProduct = useCallback(async (id: number, productData: Parameters<typeof productService.updateProduct>[1]) => {
    try {
      const updatedProduct = await productService.updateProduct(id, productData);
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
      return updatedProduct;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update product');
    }
  }, []);

  const deleteProduct = useCallback(async (id: number) => {
    try {
      await productService.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete product');
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}

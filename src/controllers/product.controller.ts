import { Request, Response } from 'express';
import { productService } from '../services/product.service';

export const productController = {
  // GET all products
  async getAllProducts(req: Request, res: Response) {
    try {
      const products = await productService.getAllProducts();
      res.json({
        success: true,
        data: products
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch products'
      });
    }
  },

  // GET product by ID
  async getProductById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const product = await productService.getProductById(id);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Product not found'
        });
      }
      
      res.json({
        success: true,
        data: product
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch product'
      });
    }
  },

  // GET products by category
  async getProductsByCategory(req: Request, res: Response) {
    try {
      const category = req.params.category;
      const products = await productService.getProductsByCategory(category);
      
      res.json({
        success: true,
        data: products
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch products by category'
      });
    }
  },

  // POST create new product
  async createProduct(req: Request, res: Response) {
    try {
      const newProduct = await productService.createProduct(req.body);
      
      res.status(201).json({
        success: true,
        data: newProduct,
        message: 'Product created successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to create product'
      });
    }
  },

  // PUT update product
  async updateProduct(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const updatedProduct = await productService.updateProduct(id, req.body);
      
      if (!updatedProduct) {
        return res.status(404).json({
          success: false,
          error: 'Product not found'
        });
      }
      
      res.json({
        success: true,
        data: updatedProduct,
        message: 'Product updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to update product'
      });
    }
  },

  // DELETE product
  async deleteProduct(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const deleted = await productService.deleteProduct(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: 'Product not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Product deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to delete product'
      });
    }
  }
};

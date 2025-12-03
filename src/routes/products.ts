import { Router } from 'express';
import { productController } from '../controllers/product.controller';

const router = Router();

// GET all products
router.get('/', productController.getAllProducts);

// GET product by ID
router.get('/:id', productController.getProductById);

// GET products by category
router.get('/category/:category', productController.getProductsByCategory);

// POST create new product
router.post('/', productController.createProduct);

// PUT update product
router.put('/:id', productController.updateProduct);

// DELETE product
router.delete('/:id', productController.deleteProduct);

export default router;

import { db } from '../db';
import { products } from '../db/schema';
import { eq } from 'drizzle-orm';

export const productService = {
  // Get all products
  async getAllProducts() {
    return await db.select().from(products);
  },

  // Get product by ID
  async getProductById(id: number) {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, id));
    
    return product || null;
  },

  // Get products by category
  async getProductsByCategory(category: string) {
    return await db
      .select()
      .from(products)
      .where(eq(products.category, category));
  },

  // Create new product
  async createProduct(productData: typeof products.$inferInsert) {
    const [newProduct] = await db
      .insert(products)
      .values(productData)
      .returning();
    
    return newProduct;
  },

  // Update product
  async updateProduct(id: number, productData: Partial<typeof products.$inferInsert>) {
    const [updatedProduct] = await db
      .update(products)
      .set({ ...productData, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    
    return updatedProduct || null;
  },

  // Delete product
  async deleteProduct(id: number) {
    const [deletedProduct] = await db
      .delete(products)
      .where(eq(products.id, id))
      .returning();
    
    return deletedProduct || null;
  }
};

import { db } from '../db';
import { products, categories, users } from '../db/schema';
import bcrypt from 'bcryptjs';

export async function seedDatabase() {
  try {
    console.log('🌱 Seeding database...');

    // Seed admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    await db.insert(users).values({
      email: 'admin@tinyfabrics.com',
      password: adminPassword,
      name: 'Admin',
      role: 'admin',
    }).onConflictDoNothing();
    console.log('✅ Admin user seeded (admin@tinyfabrics.com / admin123)');

    // Seed categories
    const categoryData = [
      { name: 'cotton', label: 'Cotton' },
      { name: 'linen', label: 'Linen' },
      { name: 'denim', label: 'Denim' },
      { name: 'silk', label: 'Lụa' },
      { name: 'wool', label: 'Dạ' },
    ];

    await db.insert(categories).values(categoryData).onConflictDoNothing();
    console.log('✅ Categories seeded');

    // Seed products
    const productData = [
      {
        name: 'Vải Cotton Hoa Nhí',
        description: 'Vải cotton mềm mại, họa tiết hoa nhỏ xinh, phù hợp cho may quần áo búp bê',
        price: 15000,
        category: 'cotton',
        size: '20x30cm',
        image: 'https://images.unsplash.com/photo-1586105449897-20b5efeb3b9c?w=500&auto=format',
        stock: 10
      },
      {
        name: 'Vải Linen Trơn Xanh Mint',
        description: 'Linen cao cấp, màu xanh mint pastel, lý tưởng cho túi vải và gối trang trí',
        price: 25000,
        category: 'linen',
        size: '25x35cm',
        image: 'https://images.unsplash.com/photo-1601924287230-b5ee4e8be398?w=500&auto=format',
        stock: 8
      },
      {
        name: 'Denim Xanh Đậm',
        description: 'Vải jean dày dặn, độ bền cao, tuyệt vời cho patchwork và quilt',
        price: 18000,
        category: 'denim',
        size: '15x40cm',
        image: 'https://images.unsplash.com/photo-1582552938357-32b906cffc10?w=500&auto=format',
        stock: 15
      },
      {
        name: 'Lụa Satin Hồng Nude',
        description: 'Lụa satin mịn màng, ánh kim nhẹ, dùng may túi clutch cực sang',
        price: 35000,
        category: 'silk',
        size: '20x25cm',
        image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=500&auto=format',
        stock: 5
      },
      {
        name: 'Vải Dạ Xám Khói',
        description: 'Vải dạ mềm, giữ ấm tốt, thích hợp làm balo mini hoặc móc khóa felt',
        price: 30000,
        category: 'wool',
        size: '18x22cm',
        image: 'https://images.unsplash.com/photo-1558769132-cb1aea3c8240?w=500&auto=format',
        stock: 12
      },
      {
        name: 'Cotton Kẻ Sọc Retro',
        description: 'Họa tiết kẻ sọc vintage, cotton 100%, phong cách tối giản',
        price: 20000,
        category: 'cotton',
        size: '30x30cm',
        image: 'https://images.unsplash.com/photo-1604003047280-9f0c3b0c0b9f?w=500&auto=format',
        stock: 20
      },
      {
        name: 'Linen Chấm Bi Nâu',
        description: 'Vải linen chấm bi nhỏ tông nâu đất, phong cách Hàn Quốc',
        price: 22000,
        category: 'linen',
        size: '25x30cm',
        image: 'https://images.unsplash.com/photo-1558769132-f9235c0073b1?w=500&auto=format',
        stock: 18
      },
      {
        name: 'Denim Wash Nhạt',
        description: 'Jean wash nhẹ phong cách casual, mềm mại hơn denim thường',
        price: 16000,
        category: 'denim',
        size: '20x35cm',
        image: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=500&auto=format',
        stock: 14
      },
    ];

    await db.insert(products).values(productData);
    console.log('✅ Products seeded');

    console.log('🎉 Database seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

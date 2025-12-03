import type { Product } from '../types/index';

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Set Vải Cotton Hoa Nhí Vintage",
    price: 45000,
    size: "30x50cm (5 tấm)",
    material: "100% Cotton",
    category: "cotton",
    image: "https://picsum.photos/id/102/400/400",
    description: "Những mảnh vải cotton mềm mịn với họa tiết hoa nhí cổ điển, thích hợp làm ví cầm tay hoặc dây buộc tóc."
  },
  {
    id: 2,
    name: "Vải Linen Thô Màu Mộc",
    price: 30000,
    size: "50x70cm",
    material: "Linen",
    category: "linen",
    image: "https://picsum.photos/id/201/400/400",
    description: "Chất liệu linen tự nhiên, thoáng mát. Màu mộc mạc, phù hợp thêu tay hoặc làm lót ly."
  },
  {
    id: 3,
    name: "Vụ Lụa Tơ Tằm Tổng Hợp",
    price: 25000,
    size: "40x40cm",
    material: "Lụa tổng hợp",
    category: "silk",
    image: "https://picsum.photos/id/305/400/400",
    description: "Vải bóng nhẹ, mềm rủ. Thích hợp làm nơ cài áo hoặc trang trí túi xách."
  },
  {
    id: 4,
    name: "Set Vải Canvas Họa Tiết Hình Học",
    price: 55000,
    size: "40x60cm (3 tấm)",
    material: "Canvas",
    category: "synthetic",
    image: "https://picsum.photos/id/400/400/400",
    description: "Vải dày dặn, đứng form. Tuyệt vời để may túi bút hoặc lót túi tote."
  },
  {
    id: 5,
    name: "Vải Xô Muslin Màu Pastel",
    price: 35000,
    size: "50x50cm",
    material: "Muslin",
    category: "cotton",
    image: "https://picsum.photos/id/500/400/400",
    description: "Siêu mềm mại, thấm hút tốt. Dùng làm khăn tay hoặc đồ chơi vải cho bé."
  },
  {
    id: 6,
    name: "Vải Nhung Tăm Màu Đỏ Đô",
    price: 40000,
    size: "30x100cm",
    material: "Nhung tăm",
    category: "synthetic",
    image: "https://picsum.photos/id/600/400/400",
    description: "Màu sắc ấm áp, chất vải dày. Phù hợp may scrunchies mùa đông hoặc túi rút."
  }
];

export const CATEGORIES = [
  { id: 'all', label: 'Tất cả' },
  { id: 'cotton', label: 'Cotton' },
  { id: 'linen', label: 'Linen/Thô' },
  { id: 'silk', label: 'Lụa/Voan' },
  { id: 'synthetic', label: 'Canvas/Khác' },
];

import React from 'react';
import { Plus, Ruler, ShoppingBag } from 'lucide-react';
import type { Product } from '../../../types';
import Button from '../Button/Button';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="group bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <div className="relative aspect-square overflow-hidden bg-stone-100">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-stone-800 shadow-sm uppercase tracking-wide">
          {product.category}
        </div>
        
        {/* Quick add overlay on mobile/desktop */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
          <button 
            onClick={() => onAddToCart(product)}
            className="bg-white p-3 rounded-full shadow-lg text-amber-600 hover:text-amber-700 hover:bg-amber-50 transition-colors"
            title="Thêm vào giỏ"
          >
            <Plus size={20} strokeWidth={3} />
          </button>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        <div className="mb-2 flex items-center gap-1 text-stone-500 text-xs font-medium">
          <Ruler size={14} />
          <span>{product.size}</span>
        </div>
        
        <h3 className="text-lg font-bold text-stone-800 mb-2 leading-tight group-hover:text-amber-700 transition-colors">
          {product.name}
        </h3>
        
        <p className="text-stone-600 text-sm line-clamp-2 mb-4 flex-1">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-stone-100">
          <span className="text-xl font-bold text-amber-600">
            {product.price.toLocaleString('vi-VN')}₫
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-stone-500 hover:text-amber-600 hover:bg-amber-50"
            onClick={() => onAddToCart(product)}
          >
            <span className="sr-only">Thêm vào giỏ</span>
            <ShoppingBag size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
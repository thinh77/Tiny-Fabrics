import React from 'react';
import { Scissors } from 'lucide-react';
import Button from '../common/Button/Button';

interface HeroProps {
  onShopNow: () => void;
}

const Hero: React.FC<HeroProps> = ({ onShopNow }) => {
  return (
    <div className="relative bg-stone-900 text-white overflow-hidden rounded-3xl mx-4 mt-4 shadow-xl">
      {/* Background Image Overlay */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1528578577235-b963df6db908?q=80&w=2070&auto=format&fit=crop" 
          alt="Fabric textures" 
          className="w-full h-full object-cover opacity-40"
        />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 md:py-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center space-x-2 bg-amber-500/20 text-amber-300 px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm border border-amber-500/30">
          <Scissors size={18} />
          <span className="text-sm font-semibold uppercase tracking-wider">Tiệm Vải Vụn Xinh</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          Biến Vải Thừa Thành <span className="text-amber-400">Tác Phẩm Nghệ Thuật</span>
        </h1>
        
        <p className="max-w-2xl text-lg md:text-xl text-stone-200 mb-10 leading-relaxed">
          Cung cấp các khổ vải nhỏ, vải vụn chất lượng cao cho cộng đồng handmade. 
          Tiết kiệm chi phí, thỏa sức sáng tạo và bảo vệ môi trường.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" onClick={onShopNow}>
            Khám Phá Ngay
          </Button>
          <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
            Tìm Hiểu Về Upcycling
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
import React from 'react';
import { Scissors, Instagram, Facebook } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-400 py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 text-white mb-4">
            <Scissors size={20} />
            <span className="font-bold text-lg">Tiệm Vải Vụn Xinh</span>
          </div>
          <p className="text-sm leading-relaxed">
            Chúng mình tin rằng không có mảnh vải nào là thừa thãi. Mỗi tấm vải đều mang trong mình một câu chuyện đang chờ bạn kể tiếp.
          </p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Liên Hệ</h4>
          <ul className="space-y-2 text-sm">
            <li>Hotline: 090.xxx.xxxx</li>
            <li>Email: hello@tiemvaivun.com</li>
            <li>Địa chỉ: Quận 3, TP. Hồ Chí Minh</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Theo Dõi</h4>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors"><Instagram size={24} /></a>
            <a href="#" className="hover:text-white transition-colors"><Facebook size={24} /></a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-stone-800 text-center text-xs">
        © {new Date().getFullYear()} Tiệm Vải Vụn Xinh. Made with ❤️ & 🧵
      </div>
    </footer>
  );
};

export default Footer;

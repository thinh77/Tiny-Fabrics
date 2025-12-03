import React, { useState, useEffect } from 'react';
import { ShoppingBag, Scissors, Search, Filter, Menu, X, Minus, Plus, Trash2, Settings, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/layout/Hero';
import Footer from '../components/layout/Footer';
import ProductCard from '../components/common/Card/ProductCard';
import { CATEGORIES } from '../constants';
import { useProducts } from '../hooks/useProducts';
import type { Product, CartItem } from '../types/index';
import Button from '../components/common/Button/Button';

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const { products, loading, error, fetchProducts } = useProducts();
    
    // State
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Scroll effect for navbar
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Filter Logic
    const filteredProducts = products.filter(product => {
        const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Cart Logic
    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
        setIsCartOpen(true);
    };

    const updateQuantity = (id: number, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                return { ...item, quantity: Math.max(1, item.quantity + delta) };
            }
            return item;
        }));
    };

    const removeFromCart = (id: number) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const handleCheckout = () => {
        alert("Cảm ơn bạn đã đặt hàng! Chức năng này đang được phát triển.");
        setCart([]);
        setIsCartOpen(false);
    };

    const scrollToShop = () => {
        document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Navbar */}
            <nav className={`fixed top-0 w-full z-40 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
                <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-600">
                        <div className="bg-amber-100 p-2 rounded-lg">
                            <Scissors size={24} />
                        </div>
                        <span className={`text-xl font-bold tracking-tight ${scrolled ? 'text-stone-800' : 'text-stone-800 lg:text-white'}`}>
                            Tiệm Vải Vụn Xinh
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/admin')}
                            className="p-2 rounded-full hover:bg-black/5 transition-colors group"
                            title="Quản lý"
                        >
                            <Settings className={`${scrolled ? 'text-stone-700' : 'text-stone-700 lg:text-white'} group-hover:text-amber-600`} />
                        </button>
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative p-2 rounded-full hover:bg-black/5 transition-colors group"
                        >
                            <ShoppingBag className={`${scrolled ? 'text-stone-700' : 'text-stone-700 lg:text-white'} group-hover:text-amber-600`} />
                            {cart.length > 0 && (
                                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                                    {cart.reduce((a, b) => a + b.quantity, 0)}
                                </span>
                            )}
                        </button>
                        <button className="md:hidden p-2">
                            <Menu className={scrolled ? 'text-stone-700' : 'text-stone-700 lg:text-white'} />
                        </button>
                    </div>
                </div>
            </nav>

            <Hero onShopNow={scrollToShop} />

            <main className="flex-grow">

                {/* Shop Section */}
                <section id="shop" className="max-w-7xl mx-auto px-4 md:px-6 py-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-stone-800 mb-4">Kho Vải Vụn</h2>
                        <p className="text-stone-500 max-w-xl mx-auto">
                            Tuyển tập những mảnh vải "nhỏ nhưng có võ". Phù hợp cho patchwork, may ví, đồ búp bê và nhiều hơn thế nữa.
                        </p>
                    </div>

                    {/* Filters & Search */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
                        <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeCategory === cat.id
                                            ? 'bg-amber-600 text-white shadow-md'
                                            : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                                        }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>

                        <div className="relative w-full md:w-72">
                            <input
                                type="text"
                                placeholder="Tìm loại vải, màu sắc..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all"
                            />
                            <Search className="absolute left-3 top-2.5 text-stone-400" size={18} />
                        </div>
                    </div>

                    {/* Product Grid */}
                    {loading === 'LOADING' ? (
                        <div className="text-center py-20">
                            <Loader2 className="mx-auto text-amber-600 mb-4 animate-spin" size={48} />
                            <p className="text-stone-500 font-medium">Đang tải sản phẩm...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-20 bg-red-50 rounded-2xl border border-dashed border-red-200">
                            <p className="text-red-500 font-medium mb-4">Không thể tải sản phẩm: {error}</p>
                            <Button
                                variant="outline"
                                onClick={fetchProducts}
                                className="text-red-600 border-red-600"
                            >
                                Thử lại
                            </Button>
                        </div>
                    ) : filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredProducts.map(product => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onAddToCart={addToCart}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                            <Filter className="mx-auto text-stone-300 mb-3" size={48} />
                            <p className="text-stone-500 font-medium">Không tìm thấy sản phẩm phù hợp.</p>
                            <Button
                                variant="ghost"
                                onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
                                className="mt-2 text-amber-600"
                            >
                                Xóa bộ lọc
                            </Button>
                        </div>
                    )}
                </section>
            </main>

            <Footer />
        </div>
    );
};


export default HomePage;
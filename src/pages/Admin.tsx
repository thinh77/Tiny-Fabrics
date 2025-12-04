import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Package, 
  Search, 
  Edit, 
  Trash2, 
  Loader2, 
  RefreshCw,
  LayoutDashboard,
  ShoppingBag,
  TrendingUp,
  Users,
  Settings,
  LogOut,
  Scissors,
  ChevronDown,
  Eye,
  Filter,
  Download,
  CheckSquare,
  Square,
  AlertCircle,
  X,
  Menu,
  Home
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button/Button';
import AddProductModal from '../components/common/Modal/AddProductModal';
import { useProducts } from '../hooks/useProducts';
import { useAuth } from '../contexts/AuthContext';
import { CATEGORIES } from '../constants';
import type { Product } from '../types';

// Sidebar navigation items
const navItems = [
  { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
  { id: 'products', label: 'Sản phẩm', icon: Package },
  { id: 'orders', label: 'Đơn hàng', icon: ShoppingBag },
  { id: 'analytics', label: 'Thống kê', icon: TrendingUp },
  { id: 'customers', label: 'Khách hàng', icon: Users },
];

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { products, loading, error, fetchProducts, addProduct, deleteProduct } = useProducts();
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [activeNav, setActiveNav] = useState('products');
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, categoryFilter]);

  // Stats calculations
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, p) => sum + p.price, 0);
    const avgPrice = totalProducts > 0 ? Math.round(totalValue / totalProducts) : 0;
    const categoryCount = new Set(products.map(p => p.category)).size;
    
    return {
      totalProducts,
      totalValue,
      avgPrice,
      categoryCount,
    };
  }, [products]);

  // Handlers
  const handleDeleteProduct = async (id: number) => {
    setDeletingId(id);
    try {
      await deleteProduct(id);
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete product:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  const handleSelectProduct = (id: number) => {
    setSelectedProducts(prev => 
      prev.includes(id) 
        ? prev.filter(pid => pid !== id)
        : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Bạn có chắc muốn xóa ${selectedProducts.length} sản phẩm?`)) {
      for (const id of selectedProducts) {
        await deleteProduct(id);
      }
      setSelectedProducts([]);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0 
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-stone-100 flex">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white border-r border-stone-200 
        transform transition-transform duration-200 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-stone-200">
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 p-2.5 rounded-xl">
                <Scissors size={24} className="text-amber-600" />
              </div>
              <div>
                <h1 className="font-bold text-stone-800">Tiệm Vải Vụn</h1>
                <p className="text-xs text-stone-500">Admin Panel</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left
                    transition-all duration-200 cursor-pointer
                    ${isActive 
                      ? 'bg-amber-50 text-amber-700 font-medium' 
                      : 'text-stone-600 hover:bg-stone-50 hover:text-stone-800'
                    }
                  `}
                >
                  <Icon size={20} className={isActive ? 'text-amber-600' : ''} />
                  <span>{item.label}</span>
                  {item.id === 'products' && (
                    <span className={`
                      ml-auto text-xs px-2 py-0.5 rounded-full
                      ${isActive ? 'bg-amber-200 text-amber-800' : 'bg-stone-200 text-stone-600'}
                    `}>
                      {products.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Bottom actions */}
          <div className="p-4 border-t border-stone-200 space-y-1">
            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-stone-600 hover:bg-stone-50 hover:text-stone-800 transition-colors cursor-pointer"
            >
              <Home size={20} />
              <span>Về trang chủ</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-stone-600 hover:bg-stone-50 hover:text-stone-800 transition-colors cursor-pointer">
              <Settings size={20} />
              <span>Cài đặt</span>
            </button>
            <button 
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <LogOut size={20} />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="bg-white border-b border-stone-200 sticky top-0 z-30">
          <div className="px-4 lg:px-8 py-4 flex items-center justify-between gap-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            >
              <Menu size={24} />
            </button>

            {/* Search */}
            <div className="flex-1 max-w-xl relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm, danh mục..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={fetchProducts}
                disabled={loading === 'LOADING'}
                className="p-2.5 hover:bg-stone-100 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
                title="Làm mới dữ liệu"
              >
                <RefreshCw size={20} className={loading === 'LOADING' ? 'animate-spin text-amber-600' : 'text-stone-600'} />
              </button>
              <Button onClick={() => setIsAddModalOpen(true)} className="hidden sm:flex">
                <Plus size={20} className="mr-2" />
                Thêm sản phẩm
              </Button>
              <Button onClick={() => setIsAddModalOpen(true)} className="sm:hidden" size="sm">
                <Plus size={20} />
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-5 border border-stone-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 bg-blue-100 rounded-xl">
                  <Package size={20} className="text-blue-600" />
                </div>
                <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-full">
                  +12%
                </span>
              </div>
              <p className="text-2xl font-bold text-stone-800">{stats.totalProducts}</p>
              <p className="text-sm text-stone-500">Tổng sản phẩm</p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-stone-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 bg-emerald-100 rounded-xl">
                  <TrendingUp size={20} className="text-emerald-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-stone-800">{formatCurrency(stats.totalValue)}</p>
              <p className="text-sm text-stone-500">Tổng giá trị</p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-stone-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 bg-amber-100 rounded-xl">
                  <ShoppingBag size={20} className="text-amber-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-stone-800">{formatCurrency(stats.avgPrice)}</p>
              <p className="text-sm text-stone-500">Giá trung bình</p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-stone-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 bg-purple-100 rounded-xl">
                  <Filter size={20} className="text-purple-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-stone-800">{stats.categoryCount}</p>
              <p className="text-sm text-stone-500">Danh mục</p>
            </div>
          </div>

          {/* Products Section */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-stone-800">Danh sách sản phẩm</h2>
                <p className="text-sm text-stone-500">
                  {filteredProducts.length} sản phẩm 
                  {searchQuery && ` khớp với "${searchQuery}"`}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Category Filter */}
                <div className="relative">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="appearance-none pl-4 pr-10 py-2 rounded-lg border border-stone-200 bg-white text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none cursor-pointer"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                </div>

                {/* Bulk Actions */}
                {selectedProducts.length > 0 && (
                  <div className="flex items-center gap-2 pl-3 border-l border-stone-200">
                    <span className="text-sm text-stone-600">
                      Đã chọn {selectedProducts.length}
                    </span>
                    <button
                      onClick={handleBulkDelete}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Xóa các sản phẩm đã chọn"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}

                {/* Export Button */}
                <button className="p-2 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer" title="Xuất dữ liệu">
                  <Download size={18} className="text-stone-600" />
                </button>
              </div>
            </div>

            {/* Content */}
            {loading === 'LOADING' && products.length === 0 ? (
              <div className="text-center py-20">
                <Loader2 className="mx-auto text-amber-600 mb-4 animate-spin" size={48} />
                <p className="text-stone-500 font-medium">Đang tải sản phẩm...</p>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <AlertCircle className="mx-auto text-red-400 mb-4" size={48} />
                <p className="text-red-600 font-medium mb-2">Không thể tải dữ liệu</p>
                <p className="text-stone-500 text-sm mb-4">{error}</p>
                <Button variant="outline" onClick={fetchProducts}>
                  <RefreshCw size={16} className="mr-2" />
                  Thử lại
                </Button>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-stone-50 border-b border-stone-200">
                    <tr>
                      <th className="px-6 py-4 text-left">
                        <button
                          onClick={handleSelectAll}
                          className="p-1 hover:bg-stone-200 rounded transition-colors cursor-pointer"
                        >
                          {selectedProducts.length === filteredProducts.length && filteredProducts.length > 0 ? (
                            <CheckSquare size={18} className="text-amber-600" />
                          ) : (
                            <Square size={18} className="text-stone-400" />
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
                        Sản phẩm
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
                        Danh mục
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider hidden md:table-cell">
                        Kích thước
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
                        Giá
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-stone-600 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredProducts.map((product) => (
                      <tr 
                        key={product.id} 
                        className={`
                          hover:bg-stone-50 transition-colors
                          ${selectedProducts.includes(product.id) ? 'bg-amber-50/50' : ''}
                        `}
                      >
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleSelectProduct(product.id)}
                            className="p-1 hover:bg-stone-200 rounded transition-colors cursor-pointer"
                          >
                            {selectedProducts.includes(product.id) ? (
                              <CheckSquare size={18} className="text-amber-600" />
                            ) : (
                              <Square size={18} className="text-stone-400" />
                            )}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-14 h-14 object-cover rounded-xl border border-stone-200"
                            />
                            <div className="min-w-0">
                              <div className="font-medium text-stone-800 truncate max-w-[200px]">
                                {product.name}
                              </div>
                              <div className="text-sm text-stone-500 truncate max-w-[200px]">
                                {product.material}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`
                            inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                            ${product.category === 'cotton' ? 'bg-blue-100 text-blue-700' : ''}
                            ${product.category === 'linen' ? 'bg-emerald-100 text-emerald-700' : ''}
                            ${product.category === 'silk' ? 'bg-pink-100 text-pink-700' : ''}
                            ${product.category === 'synthetic' ? 'bg-purple-100 text-purple-700' : ''}
                          `}>
                            {CATEGORIES.find(c => c.id === product.category)?.label || product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-stone-600 hidden md:table-cell">
                          {product.size}
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-stone-800">
                            {formatCurrency(product.price)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              className="p-2 hover:bg-stone-100 text-stone-500 hover:text-stone-700 rounded-lg transition-colors cursor-pointer"
                              title="Xem chi tiết"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              className="p-2 hover:bg-amber-50 text-stone-500 hover:text-amber-600 rounded-lg transition-colors cursor-pointer"
                              title="Chỉnh sửa"
                            >
                              <Edit size={18} />
                            </button>
                            <div className="relative">
                              <button
                                onClick={() => setShowDeleteConfirm(showDeleteConfirm === product.id ? null : product.id)}
                                className="p-2 hover:bg-red-50 text-stone-500 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                                title="Xóa"
                              >
                                <Trash2 size={18} />
                              </button>

                              {/* Delete Confirmation Popup */}
                              {showDeleteConfirm === product.id && (
                                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-stone-200 p-4 z-10">
                                  <p className="text-sm text-stone-700 mb-3">
                                    Bạn có chắc muốn xóa sản phẩm này?
                                  </p>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => setShowDeleteConfirm(null)}
                                      className="flex-1 px-3 py-2 text-sm text-stone-600 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                                    >
                                      Hủy
                                    </button>
                                    <button
                                      onClick={() => handleDeleteProduct(product.id)}
                                      disabled={deletingId === product.id}
                                      className="flex-1 px-3 py-2 text-sm bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center"
                                    >
                                      {deletingId === product.id ? (
                                        <Loader2 size={16} className="animate-spin" />
                                      ) : (
                                        'Xóa'
                                      )}
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-20">
                <Package className="mx-auto text-stone-300 mb-4" size={64} />
                <p className="text-stone-600 font-medium mb-2">Không tìm thấy sản phẩm</p>
                <p className="text-stone-500 text-sm mb-4">
                  {searchQuery 
                    ? 'Thử tìm kiếm với từ khóa khác'
                    : 'Bắt đầu thêm sản phẩm mới cho cửa hàng của bạn'
                  }
                </p>
                {searchQuery ? (
                  <Button variant="ghost" onClick={() => { setSearchQuery(''); setCategoryFilter('all'); }}>
                    <X size={16} className="mr-2" />
                    Xóa bộ lọc
                  </Button>
                ) : (
                  <Button onClick={() => setIsAddModalOpen(true)}>
                    <Plus size={16} className="mr-2" />
                    Thêm sản phẩm đầu tiên
                  </Button>
                )}
              </div>
            )}

            {/* Table Footer */}
            {filteredProducts.length > 0 && (
              <div className="px-6 py-4 border-t border-stone-200 flex items-center justify-between">
                <p className="text-sm text-stone-500">
                  Hiển thị {filteredProducts.length} / {products.length} sản phẩm
                </p>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 text-sm text-stone-600 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50" disabled>
                    Trước
                  </button>
                  <span className="px-3 py-1.5 text-sm bg-amber-600 text-white rounded-lg">1</span>
                  <button className="px-3 py-1.5 text-sm text-stone-600 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50" disabled>
                    Sau
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onProductAdded={addProduct}
      />
    </div>
  );
};

export default AdminPage;

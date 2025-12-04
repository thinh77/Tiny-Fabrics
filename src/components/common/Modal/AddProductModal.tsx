import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Upload, 
  Plus, 
  Loader2, 
  ImagePlus, 
  Package, 
  DollarSign, 
  Ruler, 
  Layers,
  FileText,
  Tag,
  AlertCircle,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import Button from '../Button/Button';
import { productService } from '../../../services/product.service';
import type { CreateProductData } from '../../../services/product.service';
import type { Product } from '../../../types';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: (productData: CreateProductData) => Promise<Product>;
}

interface FormErrors {
  name?: string;
  description?: string;
  price?: string;
  size?: string;
  material?: string;
  image?: string;
}

const CATEGORY_OPTIONS = [
  { value: 'cotton', label: 'Cotton', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { value: 'linen', label: 'Linen/Thô', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { value: 'silk', label: 'Lụa/Voan', color: 'bg-pink-100 text-pink-700 border-pink-200' },
  { value: 'synthetic', label: 'Canvas/Khác', color: 'bg-purple-100 text-purple-700 border-purple-200' },
];

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onProductAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'cotton',
    size: '',
    material: '',
    image: '',
    stock: '10',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Focus first input when modal opens
  useEffect(() => {
    if (isOpen && firstInputRef.current) {
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Validate single field
  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Vui lòng nhập tên sản phẩm';
        if (value.length < 3) return 'Tên sản phẩm phải có ít nhất 3 ký tự';
        break;
      case 'description':
        if (!value.trim()) return 'Vui lòng nhập mô tả';
        if (value.length < 10) return 'Mô tả phải có ít nhất 10 ký tự';
        break;
      case 'price':
        if (!value) return 'Vui lòng nhập giá';
        if (parseInt(value) < 1000) return 'Giá phải ít nhất 1,000đ';
        break;
      case 'size':
        if (!value.trim()) return 'Vui lòng nhập kích thước';
        break;
      case 'material':
        if (!value.trim()) return 'Vui lòng nhập chất liệu';
        break;
      case 'image':
        if (value && !isValidUrl(value)) return 'URL hình ảnh không hợp lệ';
        break;
    }
    return undefined;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }

    // Handle image preview
    if (name === 'image') {
      if (value && isValidUrl(value)) {
        setImageLoading(true);
        setImagePreview(value);
      } else {
        setImagePreview(null);
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const fieldError = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: fieldError }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'cotton',
      size: '',
      material: '',
      image: '',
      stock: '10',
    });
    setError(null);
    setErrors({});
    setTouched({});
    setImagePreview(null);
    setShowSuccess(false);
    setSelectedFile(null);
    setUploadingImage(false);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, image: 'Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WebP)' }));
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: 'File quá lớn. Giới hạn 5MB' }));
      return;
    }

    setSelectedFile(file);
    setErrors(prev => ({ ...prev, image: undefined }));

    // Create local preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: FormErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) {
        newErrors[key as keyof FormErrors] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      let imageUrl = formData.image || 'https://picsum.photos/400/400';

      // Upload image if a file is selected
      if (selectedFile) {
        setUploadingImage(true);
        try {
          const uploadResult = await productService.uploadImage(selectedFile);
          imageUrl = uploadResult.url;
        } catch (uploadErr) {
          throw new Error(uploadErr instanceof Error ? uploadErr.message : 'Không thể upload hình ảnh');
        } finally {
          setUploadingImage(false);
        }
      }

      const productData: CreateProductData = {
        name: formData.name,
        description: formData.description,
        price: parseInt(formData.price),
        category: formData.category,
        size: formData.size,
        material: formData.material,
        image: imageUrl,
        stock: parseInt(formData.stock) || 10,
      };

      await onProductAdded(productData);
      setShowSuccess(true);
      
      // Close after showing success
      setTimeout(() => {
        resetForm();
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Failed to add product:', err);
      setError(err instanceof Error ? err.message : 'Không thể thêm sản phẩm. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  };

  // Calculate form completion percentage
  const requiredFields = ['name', 'description', 'price', 'size', 'material'];
  const filledFields = requiredFields.filter(field => formData[field as keyof typeof formData]?.toString().trim());
  const completionPercent = Math.round((filledFields.length / requiredFields.length) * 100);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          ref={modalRef}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden pointer-events-auto flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          {/* Success Overlay */}
          {showSuccess && (
            <div className="absolute inset-0 bg-white z-10 flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4 animate-bounce">
                <CheckCircle2 size={40} className="text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-stone-800 mb-2">Thêm sản phẩm thành công!</h3>
              <p className="text-stone-500">Sản phẩm đã được thêm vào danh sách</p>
            </div>
          )}

          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <Sparkles size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Thêm Sản Phẩm Mới</h2>
                <p className="text-amber-100 text-sm">Điền thông tin để thêm sản phẩm vào cửa hàng</p>
              </div>
            </div>
            <button 
              onClick={handleClose}
              disabled={isSubmitting}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              aria-label="Đóng"
            >
              <X size={24} className="text-white" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="px-6 py-3 bg-stone-50 border-b border-stone-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-stone-600">Tiến độ điền form</span>
              <span className="text-sm font-medium text-amber-600">{completionPercent}%</span>
            </div>
            <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-300"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-3">
              <AlertCircle size={20} className="flex-shrink-0" />
              <span>{error}</span>
              <button 
                onClick={() => setError(null)} 
                className="ml-auto p-1 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Product Info */}
                <div className="space-y-5">
                  {/* Product Name */}
                  <div>
                    <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-stone-700 mb-2">
                      <Package size={16} className="text-stone-400" />
                      Tên Sản Phẩm <span className="text-red-500">*</span>
                    </label>
                    <input
                      ref={firstInputRef}
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`
                        w-full px-4 py-3 border rounded-xl outline-none transition-all
                        ${errors.name && touched.name 
                          ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
                          : 'border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
                        }
                      `}
                      placeholder="VD: Set Vải Cotton Hoa Nhí Vintage"
                    />
                    {errors.name && touched.name && (
                      <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="flex items-center gap-2 text-sm font-medium text-stone-700 mb-2">
                      <FileText size={16} className="text-stone-400" />
                      Mô Tả <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      rows={4}
                      className={`
                        w-full px-4 py-3 border rounded-xl outline-none transition-all resize-none
                        ${errors.description && touched.description 
                          ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
                          : 'border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
                        }
                      `}
                      placeholder="Mô tả chi tiết về sản phẩm, đặc điểm nổi bật..."
                    />
                    <div className="flex items-center justify-between mt-1.5">
                      {errors.description && touched.description ? (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle size={14} />
                          {errors.description}
                        </p>
                      ) : (
                        <span className="text-xs text-stone-400">Tối thiểu 10 ký tự</span>
                      )}
                      <span className="text-xs text-stone-400">{formData.description.length}/500</span>
                    </div>
                  </div>

                  {/* Price & Size */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="price" className="flex items-center gap-2 text-sm font-medium text-stone-700 mb-2">
                        <DollarSign size={16} className="text-stone-400" />
                        Giá (VNĐ) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        min="0"
                        className={`
                          w-full px-4 py-3 border rounded-xl outline-none transition-all
                          ${errors.price && touched.price 
                            ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
                            : 'border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
                          }
                        `}
                        placeholder="25000"
                      />
                      {errors.price && touched.price && (
                        <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle size={14} />
                          {errors.price}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="size" className="flex items-center gap-2 text-sm font-medium text-stone-700 mb-2">
                        <Ruler size={16} className="text-stone-400" />
                        Kích Thước <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="size"
                        name="size"
                        value={formData.size}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`
                          w-full px-4 py-3 border rounded-xl outline-none transition-all
                          ${errors.size && touched.size 
                            ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
                            : 'border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
                          }
                        `}
                        placeholder="30x50cm"
                      />
                      {errors.size && touched.size && (
                        <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle size={14} />
                          {errors.size}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Material */}
                  <div>
                    <label htmlFor="material" className="flex items-center gap-2 text-sm font-medium text-stone-700 mb-2">
                      <Layers size={16} className="text-stone-400" />
                      Chất Liệu <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="material"
                      name="material"
                      value={formData.material}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`
                        w-full px-4 py-3 border rounded-xl outline-none transition-all
                        ${errors.material && touched.material 
                          ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
                          : 'border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
                        }
                      `}
                      placeholder="100% Cotton"
                    />
                    {errors.material && touched.material && (
                      <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.material}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Column - Category & Image */}
                <div className="space-y-5">
                  {/* Category Selection */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-stone-700 mb-3">
                      <Tag size={16} className="text-stone-400" />
                      Danh Mục <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {CATEGORY_OPTIONS.map(cat => (
                        <button
                          key={cat.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, category: cat.value }))}
                          className={`
                            px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all cursor-pointer
                            ${formData.category === cat.value 
                              ? `${cat.color} border-current ring-2 ring-offset-2 ring-current/30` 
                              : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300 hover:bg-stone-50'
                            }
                          `}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label htmlFor="image" className="flex items-center gap-2 text-sm font-medium text-stone-700 mb-2">
                      <ImagePlus size={16} className="text-stone-400" />
                      Hình Ảnh Sản Phẩm
                    </label>
                    
                    {/* Hidden file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      onChange={handleFileSelect}
                      className="hidden"
                    />

                    {/* Image Preview */}
                    <div 
                      className={`
                        relative w-full aspect-video rounded-xl border-2 border-dashed overflow-hidden mb-3 cursor-pointer
                        ${imagePreview ? 'border-amber-300 bg-amber-50' : 'border-stone-200 bg-stone-50 hover:border-amber-400 hover:bg-amber-50/50'}
                        transition-all
                      `}
                      onClick={!imagePreview ? handleUploadClick : undefined}
                    >
                      {imagePreview ? (
                        <>
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                            onLoad={() => setImageLoading(false)}
                            onError={() => {
                              setImageLoading(false);
                              setImagePreview(null);
                              setSelectedFile(null);
                              setErrors(prev => ({ ...prev, image: 'Không thể tải hình ảnh' }));
                            }}
                          />
                          {imageLoading && (
                            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                              <Loader2 className="animate-spin text-amber-600" size={32} />
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, image: '' }));
                              setImagePreview(null);
                              setSelectedFile(null);
                              if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
                          >
                            <X size={16} />
                          </button>
                          {selectedFile && (
                            <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 text-white text-xs rounded-lg">
                              {selectedFile.name}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-400">
                          <Upload size={40} className="mb-2" />
                          <span className="text-sm font-medium">Nhấn để chọn ảnh</span>
                          <span className="text-xs mt-1">hoặc nhập URL bên dưới</span>
                        </div>
                      )}
                    </div>

                    {/* URL Input & Upload Button */}
                    <div className="flex gap-2">
                      <input
                        type="url"
                        id="image"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        disabled={!!selectedFile}
                        className={`
                          flex-1 px-4 py-3 border rounded-xl outline-none transition-all
                          ${errors.image 
                            ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
                            : 'border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
                          }
                          ${selectedFile ? 'bg-stone-100 text-stone-400 cursor-not-allowed' : ''}
                        `}
                        placeholder={selectedFile ? 'Đã chọn file từ máy' : 'https://example.com/image.jpg'}
                      />
                      <button
                        type="button"
                        onClick={handleUploadClick}
                        className="px-4 py-3 border border-amber-500 bg-amber-50 text-amber-700 rounded-xl hover:bg-amber-100 transition-colors cursor-pointer flex items-center gap-2"
                        title="Chọn ảnh từ máy"
                      >
                        <Upload size={18} />
                      </button>
                    </div>
                    {errors.image ? (
                      <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.image}
                      </p>
                    ) : (
                      <p className="text-xs text-stone-400 mt-1.5">
                        {selectedFile 
                          ? `File: ${selectedFile.name} (${(selectedFile.size / 1024).toFixed(1)} KB)` 
                          : 'Chọn ảnh từ máy hoặc nhập URL. Để trống sẽ dùng ảnh mặc định'
                        }
                      </p>
                    )}
                  </div>

                  {/* Stock (Optional) */}
                  <div>
                    <label htmlFor="stock" className="flex items-center gap-2 text-sm font-medium text-stone-700 mb-2">
                      <Package size={16} className="text-stone-400" />
                      Số Lượng Tồn Kho
                    </label>
                    <input
                      type="number"
                      id="stock"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                      placeholder="10"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="sticky bottom-0 bg-stone-50 border-t border-stone-200 px-6 py-4 flex items-center justify-between gap-4">
              <p className="text-sm text-stone-500 hidden sm:block">
                <span className="text-red-500">*</span> Trường bắt buộc
              </p>
              <div className="flex gap-3 w-full sm:w-auto">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-none sm:px-6"
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || completionPercent < 100}
                  className="flex-1 sm:flex-none sm:px-8"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={18} />
                      {uploadingImage ? 'Đang upload ảnh...' : 'Đang thêm...'}
                    </>
                  ) : (
                    <>
                      <Plus size={18} className="mr-2" />
                      Thêm Sản Phẩm
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddProductModal;

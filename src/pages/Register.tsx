import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scissors, Eye, EyeOff, Mail, Lock, User, Loader2, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [acceptTerms, setAcceptTerms] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        if (formData.name.length < 2) {
            setError('Tên phải có ít nhất 2 ký tự');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError('Email không hợp lệ');
            return;
        }

        if (formData.password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        if (!acceptTerms) {
            setError('Vui lòng đồng ý với điều khoản sử dụng');
            return;
        }

        setIsLoading(true);

        try {
            await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
            });
            navigate('/');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Đăng ký thất bại. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    // Password strength indicator
    const getPasswordStrength = (password: string): { level: number; text: string; color: string } => {
        if (!password) return { level: 0, text: '', color: '' };
        let score = 0;
        if (password.length >= 6) score++;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        if (score <= 2) return { level: 1, text: 'Yếu', color: 'bg-red-500' };
        if (score <= 3) return { level: 2, text: 'Trung bình', color: 'bg-yellow-500' };
        return { level: 3, text: 'Mạnh', color: 'bg-emerald-500' };
    };

    const passwordStrength = getPasswordStrength(formData.password);

    return (
        <div className="min-h-screen flex">
            {/* Left Panel - Decorative */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 overflow-hidden">
                {/* Pattern overlay */}
                <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <defs>
                            <pattern id="fabric-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                                <rect width="20" height="20" fill="transparent" />
                                <path d="M0 10 L10 0 L20 10 L10 20 Z" fill="white" opacity="0.3" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#fabric-pattern)" />
                    </svg>
                </div>

                {/* Floating shapes */}
                <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse" />
                <div className="absolute bottom-32 right-16 w-40 h-40 bg-orange-300/20 rounded-full blur-3xl animate-pulse delay-700" />
                <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-amber-200/20 rounded-full blur-2xl animate-pulse delay-1000" />

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center items-center w-full px-12 text-white">
                    <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl mb-8">
                        <Scissors size={48} className="text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-4 text-center">Tham Gia Ngay!</h1>
                    <p className="text-lg text-white/90 text-center max-w-md leading-relaxed">
                        Đăng ký tài khoản để nhận nhiều ưu đãi độc quyền và theo dõi đơn hàng dễ dàng.
                    </p>

                    {/* Benefits */}
                    <div className="mt-12 space-y-4 text-left">
                        <div className="flex items-center gap-3">
                            <CheckCircle size={20} className="text-amber-200" />
                            <span>Ưu đãi 10% cho đơn hàng đầu tiên</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle size={20} className="text-amber-200" />
                            <span>Theo dõi đơn hàng realtime</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle size={20} className="text-amber-200" />
                            <span>Nhận thông báo khuyến mãi sớm nhất</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Register Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-stone-50">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
                        <div className="bg-amber-100 p-3 rounded-xl">
                            <Scissors size={28} className="text-amber-600" />
                        </div>
                        <span className="text-2xl font-bold text-stone-800">Tiệm Vải Vụn Xinh</span>
                    </div>

                    {/* Header */}
                    <div className="text-center lg:text-left mb-8">
                        <h2 className="text-3xl font-bold text-stone-800 mb-2">Tạo tài khoản</h2>
                        <p className="text-stone-500">
                            Điền thông tin bên dưới để đăng ký tài khoản mới.
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
                            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Register Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name Field */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-2">
                                Họ và tên
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Nguyễn Văn A"
                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-stone-200 bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all text-stone-800 placeholder:text-stone-400"
                                    autoComplete="name"
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="example@email.com"
                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-stone-200 bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all text-stone-800 placeholder:text-stone-400"
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-2">
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-stone-200 bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all text-stone-800 placeholder:text-stone-400"
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
                                    aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {/* Password Strength */}
                            {formData.password && (
                                <div className="mt-2">
                                    <div className="flex gap-1">
                                        {[1, 2, 3].map((level) => (
                                            <div
                                                key={level}
                                                className={`h-1 flex-1 rounded-full transition-colors ${
                                                    level <= passwordStrength.level
                                                        ? passwordStrength.color
                                                        : 'bg-stone-200'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs text-stone-500 mt-1">
                                        Độ mạnh mật khẩu: <span className="font-medium">{passwordStrength.text}</span>
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-stone-700 mb-2">
                                Xác nhận mật khẩu
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-stone-200 bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all text-stone-800 placeholder:text-stone-400"
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
                                    aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                <p className="text-xs text-red-500 mt-1">Mật khẩu không khớp</p>
                            )}
                        </div>

                        {/* Terms */}
                        <label className="flex items-start gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={acceptTerms}
                                onChange={(e) => setAcceptTerms(e.target.checked)}
                                className="w-4 h-4 mt-0.5 rounded border-stone-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                            />
                            <span className="text-sm text-stone-600 group-hover:text-stone-800 transition-colors">
                                Tôi đồng ý với{' '}
                                <Link to="/terms" className="text-amber-600 hover:text-amber-700 font-medium">
                                    Điều khoản sử dụng
                                </Link>{' '}
                                và{' '}
                                <Link to="/privacy" className="text-amber-600 hover:text-amber-700 font-medium">
                                    Chính sách bảo mật
                                </Link>
                            </span>
                        </label>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 px-6 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-semibold rounded-xl shadow-lg shadow-amber-600/25 hover:shadow-amber-600/40 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    <span>Đang đăng ký...</span>
                                </>
                            ) : (
                                <>
                                    <span>Đăng ký</span>
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Login Link */}
                    <p className="text-center mt-8 text-stone-600">
                        Đã có tài khoản?{' '}
                        <Link
                            to="/login"
                            className="text-amber-600 hover:text-amber-700 font-semibold transition-colors"
                        >
                            Đăng nhập
                        </Link>
                    </p>

                    {/* Back to Home */}
                    <div className="text-center mt-6">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-700 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span>Quay lại trang chủ</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;

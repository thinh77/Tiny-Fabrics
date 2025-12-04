import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Scissors, Eye, EyeOff, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    // Get the redirect path from location state or default to home
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Basic validation
        if (!formData.email || !formData.password) {
            setError('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError('Email không hợp lệ');
            return;
        }

        setIsLoading(true);

        try {
            await login(formData);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Đăng nhập thất bại. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

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
                    <h1 className="text-4xl font-bold mb-4 text-center">Tiệm Vải Vụn Xinh</h1>
                    <p className="text-lg text-white/90 text-center max-w-md leading-relaxed">
                        Nơi những mảnh vải nhỏ tạo nên những tác phẩm lớn. Đăng nhập để khám phá bộ sưu tập độc đáo của chúng tôi.
                    </p>

                    {/* Decorative fabric swatches */}
                    <div className="flex gap-4 mt-12">
                        <div className="w-12 h-12 rounded-lg bg-rose-300/50 backdrop-blur-sm border border-white/30 rotate-12 hover:rotate-0 transition-transform cursor-pointer" />
                        <div className="w-12 h-12 rounded-lg bg-sky-300/50 backdrop-blur-sm border border-white/30 -rotate-6 hover:rotate-0 transition-transform cursor-pointer" />
                        <div className="w-12 h-12 rounded-lg bg-emerald-300/50 backdrop-blur-sm border border-white/30 rotate-3 hover:rotate-0 transition-transform cursor-pointer" />
                        <div className="w-12 h-12 rounded-lg bg-violet-300/50 backdrop-blur-sm border border-white/30 -rotate-12 hover:rotate-0 transition-transform cursor-pointer" />
                    </div>
                </div>
            </div>

            {/* Right Panel - Login Form */}
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
                        <h2 className="text-3xl font-bold text-stone-800 mb-2">Đăng nhập</h2>
                        <p className="text-stone-500">
                            Chào mừng trở lại! Vui lòng đăng nhập để tiếp tục.
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

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
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
                                    autoComplete="current-password"
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
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                                />
                                <span className="text-sm text-stone-600 group-hover:text-stone-800 transition-colors">
                                    Ghi nhớ đăng nhập
                                </span>
                            </label>
                            <Link
                                to="/forgot-password"
                                className="text-sm text-amber-600 hover:text-amber-700 font-medium transition-colors"
                            >
                                Quên mật khẩu?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 px-6 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-semibold rounded-xl shadow-lg shadow-amber-600/25 hover:shadow-amber-600/40 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    <span>Đang đăng nhập...</span>
                                </>
                            ) : (
                                <>
                                    <span>Đăng nhập</span>
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-stone-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-stone-50 text-stone-500">hoặc đăng nhập với</span>
                        </div>
                    </div>

                    {/* Social Login */}
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            className="flex items-center justify-center gap-2 py-3 px-4 border border-stone-200 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            <span className="text-sm font-medium text-stone-700">Google</span>
                        </button>
                        <button
                            type="button"
                            className="flex items-center justify-center gap-2 py-3 px-4 border border-stone-200 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer"
                        >
                            <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            <span className="text-sm font-medium text-stone-700">Facebook</span>
                        </button>
                    </div>

                    {/* Register Link */}
                    <p className="text-center mt-8 text-stone-600">
                        Chưa có tài khoản?{' '}
                        <Link
                            to="/register"
                            className="text-amber-600 hover:text-amber-700 font-semibold transition-colors"
                        >
                            Đăng ký ngay
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

export default LoginPage;

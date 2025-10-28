import React, { useState } from 'react';

interface AuthViewProps {
  onLogin: (name: string, password: string) => Promise<{ success: boolean, message?: string }>;
  onRegister: (name: string, password: string) => Promise<{ success: boolean, message?: string }>;
}

const AuthView: React.FC<AuthViewProps> = ({ onLogin, onRegister }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !password.trim()) {
        setError('Vui lòng nhập đầy đủ tên và mật khẩu.');
        return;
    }
    
    setIsLoading(true);
    let result;
    if (activeTab === 'login') {
        result = await onLogin(name, password);
    } else {
        result = await onRegister(name, password);
    }
    setIsLoading(false);

    if (!result.success && result.message) {
        setError(result.message);
    }
  };

  const switchTab = (tab: 'login' | 'register') => {
    setActiveTab(tab);
    setError(null);
    setName('');
    setPassword('');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lifted border border-slate-200 grid lg:grid-cols-2 overflow-hidden">
            <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="text-center lg:text-left mb-8">
                    <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                        Học Tiếng Anh <span className="text-indigo-600">Cùng AI</span>
                    </h1>
                    <p className="text-slate-500 mt-2">Nền tảng học toàn diện dành cho bạn</p>
                </div>

                <div>
                    <div className="flex border-b border-slate-200 mb-6">
                        <button
                            onClick={() => switchTab('login')}
                            className={`w-1/2 py-3 font-semibold text-center transition-colors ${activeTab === 'login' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Đăng nhập
                        </button>
                        <button
                            onClick={() => switchTab('register')}
                            className={`w-1/2 py-3 font-semibold text-center transition-colors ${activeTab === 'register' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Tạo tài khoản
                        </button>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && <p className="text-red-500 bg-red-50 p-3 rounded-md text-sm font-medium">{error}</p>}
                        
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Tên người dùng</label>
                            <input
                              type="text"
                              id="name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition"
                              placeholder="Ví dụ: longnguyen"
                              autoFocus
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu</label>
                            <div className="relative">
                                <input
                                  type={isPasswordVisible ? 'text' : 'password'}
                                  id="password"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition pr-10"
                                  placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                                    className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500 hover:text-indigo-600"
                                    aria-label={isPasswordVisible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                                >
                                    {isPasswordVisible ? (
                                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" /><path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.992-3.992l-2.754-2.754a10.006 10.006 0 0010.43 10.43z" /></svg>
                                    ) : (
                                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C3.732 4.943 9.522 3 10 3s6.268 1.943 9.542 7c-3.274 5.057-9.064 7-9.542 7S3.732 15.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                                    )}
                                </button>
                            </div>
                        </div>
                        
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-wait"
                        >
                            {isLoading ? 'Đang xử lý...' : (activeTab === 'login' ? 'Đăng nhập' : 'Tạo tài khoản')}
                        </button>
                    </form>
                    <div className="mt-6 bg-slate-100 p-4 rounded-lg text-center">
                        <h4 className="font-semibold text-slate-700 flex items-center justify-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                            </svg>
                            Quyền riêng tư & Linh hoạt
                        </h4>
                        <p className="text-xs text-slate-500 mt-2">
                           Tiến trình học tập của bạn được lưu trữ an toàn ngay trên trình duyệt này. Học mọi lúc, mọi nơi mà không cần tài khoản đám mây.
                        </p>
                    </div>
                </div>
            </div>
            <div className="hidden lg:block">
                <img 
                    src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1740&auto=format&fit=crop" 
                    alt="Students learning in a classroom" 
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    </div>
  );
};

export default AuthView;
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 p-4">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">
                Học Tiếng Anh <span className="text-indigo-600">Cùng AI</span>
            </h1>
            <p className="text-slate-500 mt-2">Nền tảng học toàn diện dành cho bạn</p>
        </div>

        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
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
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Ví dụ: longnguyen"
                      autoFocus
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu</label>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="••••••••"
                    />
                </div>
                
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-wait"
                >
                    {isLoading ? 'Đang xử lý...' : (activeTab === 'login' ? 'Đăng nhập' : 'Tạo tài khoản')}
                </button>
            </form>
            {activeTab === 'register' && (
                 <p className="text-xs text-slate-500 text-center mt-4">Sau khi tạo tài khoản, bạn sẽ làm một bài kiểm tra ngắn để AI xác định trình độ tiếng Anh của bạn.</p>
            )}
        </div>
    </div>
  );
};

export default AuthView;
import React, { useState } from 'react';

interface LoginModalProps {
  onClose: () => void;
  onLogin: (name: string) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLogin }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin(name.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">Đăng nhập</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-slate-600 mb-1">Tên của bạn</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ví dụ: Long Nguyễn"
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Bắt đầu học
          </button>
        </form>
         <p className="text-xs text-slate-400 text-center mt-4">Đây là phiên bản mô phỏng, bạn chỉ cần nhập tên để tiếp tục.</p>
      </div>
    </div>
  );
};

export default LoginModal;

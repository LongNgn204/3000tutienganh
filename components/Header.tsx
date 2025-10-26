import React from 'react';
import type { ViewMode } from '../types';

const VIEW_TITLES: Record<ViewMode, string> = {
    'dashboard': 'Bảng điều khiển',
    'list': 'Danh sách từ vựng',
    'flashcard': 'Học từ vựng (Flashcard)',
    'quiz': 'Trắc nghiệm từ vựng',
    'grammar': 'Cẩm nang Ngữ pháp',
    'conversation': 'Luyện Giao tiếp AI',
    'pronunciation': 'Luyện Phát Âm AI',
    'story': 'Viết truyện cùng AI',
    'placement-test': 'Kiểm tra trình độ',
    'placement-test-result': 'Kết quả kiểm tra',
    'listening': 'Luyện Nghe Cùng AI',
    'advanced-grammar': 'Ngữ pháp Chuyên sâu',
    'auth': 'Đăng nhập & Đăng ký',
};

const Header: React.FC<{
  viewMode: ViewMode;
  onMenuClick: () => void;
}> = ({ 
  viewMode, 
  onMenuClick
}) => {
  return (
    <header className="bg-slate-100/80 backdrop-blur-lg sticky top-0 z-20 border-b border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button 
              onClick={onMenuClick}
              className="lg:hidden mr-4 p-2 rounded-md text-slate-600 hover:bg-slate-200"
              aria-label="Mở menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
             <h1 className="text-xl font-bold text-slate-800">
                {VIEW_TITLES[viewMode] || 'Học Tiếng Anh Cùng AI'}
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

import React from 'react';
import type { User, ViewMode } from '../types';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  viewMode: ViewMode;
  navigateTo: (mode: ViewMode, options?: { initialFilter: 'review' | 'unknown' }) => void;
  currentUser: User | null;
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  searchQuery, 
  setSearchQuery, 
  viewMode, 
  navigateTo,
  currentUser,
  onLoginClick,
  onLogoutClick 
}) => {
  return (
    <header className="bg-white shadow-md border-b border-slate-200 sticky top-0 z-30">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
             <h1 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight cursor-pointer" onClick={() => navigateTo('list')}>
                <span className="text-blue-600">3000</span> Từ Tiếng Anh
            </h1>
          </div>
          <div className="flex-1 flex justify-center px-2 lg:px-8">
             <div className="relative w-full max-w-xs md:max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input
                    type="text"
                    placeholder="Tìm kiếm từ..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-full leading-5 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:placeholder-slate-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
             </div>
          </div>
          <div className="flex items-center gap-x-1 md:gap-x-2">
            <div className="flex flex-col items-center justify-center w-16 text-center">
                <button
                    onClick={() => navigateTo('dashboard')}
                    className={`flex items-center justify-center w-9 h-9 rounded-full transition-colors ${viewMode === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
                    title="Tiến độ"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                    </svg>
                </button>
                <span className="text-xs text-slate-500 mt-1 leading-tight">Tiến độ</span>
            </div>
            <div className="flex flex-col items-center justify-center w-16 text-center">
                <button
                    onClick={() => navigateTo('story')}
                    className={`flex items-center justify-center w-9 h-9 rounded-full transition-colors ${viewMode === 'story' ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
                    title="Luyện tập AI"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                        <path d="M12.736 3.97a6 6 0 00-8.486 8.486l-1.014-1.014a1 1 0 011.414-1.414l1.014 1.014a6 6 0 008.486-8.486z" />
                        <path d="M12 6a1 1 0 100-2 1 1 0 000 2zM8 8a1 1 0 100-2 1 1 0 000 2zM6 12a1 1 0 100-2 1 1 0 000 2zM3.464 6.536a1 1 0 10-1.414-1.414 1 1 0 001.414 1.414z" />
                    </svg>
                </button>
                <span className="text-xs text-slate-500 mt-1 leading-tight">Viết cùng AI</span>
            </div>
             <div className="flex flex-col items-center justify-center w-16 text-center">
                <button
                    onClick={() => navigateTo('quiz')}
                    className={`flex items-center justify-center w-9 h-9 rounded-full transition-colors ${viewMode === 'quiz' ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
                    title="Luyện tập"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                </button>
                <span className="text-xs text-slate-500 mt-1 leading-tight">Trắc nghiệm</span>
             </div>
             <div className="flex flex-col items-center justify-center w-16 text-center">
                <button
                    onClick={() => navigateTo(viewMode === 'list' ? 'flashcard' : 'list')}
                    className={`flex items-center justify-center w-9 h-9 rounded-full transition-colors ${viewMode === 'flashcard' ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
                    title={viewMode === 'list' ? 'Chế độ Flashcard' : 'Chế độ danh sách'}
                >
                {viewMode === 'flashcard' || viewMode === 'quiz' || viewMode === 'story' || viewMode === 'dashboard' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M5 4a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2H5zm10 1H5a1 1 0 00-1 1v6a1 1 0 001 1h10a1 1 0 001-1V6a1 1 0 00-1-1z" />
                    </svg>
                )}
                </button>
                <span className="text-xs text-slate-500 mt-1 leading-tight">{viewMode === 'list' ? 'Flashcard' : 'Danh sách'}</span>
            </div>

             <div className="h-8 w-px bg-slate-200 mx-2"></div>

             {currentUser ? (
               <div className="flex items-center gap-x-2">
                 <span className="hidden md:inline text-sm font-medium text-slate-700">Chào, {currentUser.name}</span>
                 <button onClick={onLogoutClick} className="text-sm font-semibold text-blue-600 hover:text-blue-800">Đăng xuất</button>
               </div>
             ) : (
                <button onClick={onLoginClick} className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Đăng nhập</button>
             )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

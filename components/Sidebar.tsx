import React from 'react';
import type { User, ViewMode } from '../types';

const NavButton: React.FC<{
    onClick: () => void;
    isActive: boolean;
    label: string;
    children: React.ReactNode;
    disabled?: boolean;
}> = ({ onClick, isActive, label, children, disabled = false }) => (
    <li>
        <button
            onClick={onClick}
            disabled={disabled}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                isActive 
                ? 'bg-indigo-100 text-indigo-700' 
                : disabled 
                ? 'text-slate-400 cursor-not-allowed'
                : 'text-slate-600 hover:bg-slate-200 hover:text-slate-800'
            }`}
        >
            <span className={`h-5 w-5 ${isActive ? 'text-indigo-600' : disabled ? 'text-slate-400' : 'text-slate-500'}`}>{children}</span>
            {label}
            {disabled && <span className="ml-auto text-xs font-bold bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full">Sắp ra mắt</span>}
        </button>
    </li>
);

const NavGroup: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <h3 className="px-4 text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">{title}</h3>
    <ul className="space-y-1">
        {children}
    </ul>
  </div>
);

const UserProfile: React.FC<{ currentUser: User | null; onLogoutClick: () => void }> = ({ currentUser, onLogoutClick }) => {
    if (!currentUser) return null;
    
    return (
        <div className="mt-auto p-4 border-t border-slate-200">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                    {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <p className="font-bold text-slate-800">{currentUser.name}</p>
                    <p className="text-xs text-slate-500 font-medium">{currentUser.level} Level</p>
                </div>
            </div>
            <button onClick={onLogoutClick} className="w-full mt-4 text-center text-sm font-semibold text-slate-600 hover:text-red-600 bg-slate-100 hover:bg-red-50 py-2 rounded-lg transition-colors">
                Đăng xuất
            </button>
        </div>
    );
};

const Sidebar: React.FC<{
  viewMode: ViewMode;
  navigateTo: (mode: ViewMode) => void;
  currentUser: User | null;
  onLogoutClick: () => void;
}> = ({ viewMode, navigateTo, currentUser, onLogoutClick }) => {
  return (
    <aside className="sidebar fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200 z-40 flex flex-col">
      <div className="p-4 border-b border-slate-200">
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight cursor-pointer" onClick={() => navigateTo('dashboard')}>
            Học Tiếng Anh <span className="text-indigo-600">Cùng AI</span>
        </h1>
      </div>
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        
        <NavGroup title="Học tập">
            <NavButton onClick={() => navigateTo('dashboard')} isActive={viewMode === 'dashboard'} label="Bảng điều khiển">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            </NavButton>
            <NavButton onClick={() => navigateTo('list')} isActive={viewMode === 'list'} label="Từ vựng">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10.392C3.057 14.71 4.245 14 5.5 14c1.255 0 2.443.29 3.5.804V4.804zM14.5 4c-1.255 0-2.443.29-3.5.804v10.392c1.057.514 2.245.804 3.5.804c1.255 0 2.443-.29 3.5-.804V4.804C16.943 4.29 15.755 4 14.5 4z" /></svg>
            </NavButton>
            <NavButton onClick={() => navigateTo('flashcard')} isActive={viewMode === 'flashcard'} label="Flashcard">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" /><path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
            </NavButton>
             <NavButton onClick={() => navigateTo('quiz')} isActive={viewMode === 'quiz'} label="Trắc nghiệm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6.22 8.22a.75.75 0 011.06 0l1.47 1.47a.75.75 0 001.06 0l1.47-1.47a.75.75 0 111.06 1.06l-1.47 1.47a.75.75 0 000 1.06l1.47 1.47a.75.75 0 11-1.06 1.06L10 12.56l-1.47 1.47a.75.75 0 11-1.06-1.06l1.47-1.47a.75.75 0 000-1.06L6.22 9.28a.75.75 0 010-1.06z" clipRule="evenodd" /><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM4 10a6 6 0 1112 0 6 6 0 01-12 0z" clipRule="evenodd" /></svg>
            </NavButton>
            <NavButton onClick={() => navigateTo('grammar')} isActive={viewMode === 'grammar'} label="Ngữ pháp">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /><path fillRule="evenodd" d="M9.879 2.47a3 3 0 013.84 0l4.242 4.242a3 3 0 010 3.84l-4.242 4.242a3 3 0 01-3.84 0L5.636 10.53a3 3 0 010-3.84L9.879 2.47zM11.293 4.293a1 1 0 00-1.414 0L5.636 8.536a1 1 0 000 1.414l4.243 4.243a1 1 0 001.414 0l4.243-4.243a1 1 0 000-1.414L11.293 4.293z" clipRule="evenodd" /></svg>
            </NavButton>
            <NavButton onClick={() => navigateTo('advanced-grammar')} isActive={viewMode === 'advanced-grammar'} label="Ngữ pháp chuyên sâu">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M15.5 2.75a.75.75 0 00-1.5 0v14.5a.75.75 0 001.5 0V2.75z" /><path d="M1.97 3.03a.75.75 0 00-1.06 1.06l4.5 4.5a.75.75 0 001.06 0l4.5-4.5a.75.75 0 00-1.06-1.06L6.5 6.44 1.97 3.03zM1.97 10.03a.75.75 0 00-1.06 1.06l4.5 4.5a.75.75 0 001.06 0l4.5-4.5a.75.75 0 00-1.06-1.06L6.5 13.44l-4.53-3.41z" /></svg>
            </NavButton>
        </NavGroup>

        <NavGroup title="Luyện tập AI">
             <NavButton onClick={() => navigateTo('conversation')} isActive={viewMode === 'conversation'} label="AI Giao tiếp">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" /></svg>
            </NavButton>
            <NavButton onClick={() => navigateTo('pronunciation')} isActive={viewMode === 'pronunciation'} label="AI Luyện Âm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8h-1a6 6 0 11-12 0H3a7.001 7.001 0 006 6.93V17H7a1 1 0 100 2h6a1 1 0 100-2h-2v-2.07z" clipRule="evenodd" /></svg>
            </NavButton>
            <NavButton onClick={() => navigateTo('story')} isActive={viewMode === 'story'} label="AI Viết truyện">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
            </NavButton>
             <NavButton onClick={() => navigateTo('listening')} isActive={viewMode === 'listening'} label="Luyện Nghe">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
            </NavButton>
            <NavButton onClick={() => navigateTo('reading')} isActive={viewMode === 'reading'} label="Phòng Đọc AI">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zM3.46 3.46A6.5 6.5 0 0110 1.5 6.5 6.5 0 0116.54 3.46l-1.42 1.42A4.5 4.5 0 0010 3.5 4.5 4.5 0 004.88 4.88L3.46 3.46zM10 18.5A6.5 6.5 0 013.46 16.54l1.42-1.42A4.5 4.5 0 0010 16.5a4.5 4.5 0 005.12-3.62l1.42-1.42A6.5 6.5 0 0110 18.5z" /><path d="M14 10a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </NavButton>
        </NavGroup>
      </nav>
      <UserProfile currentUser={currentUser} onLogoutClick={onLogoutClick} />
    </aside>
  );
};

export default Sidebar;
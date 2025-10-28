import React from 'react';
import type { User, ViewMode, CEFRLevel } from '../types';

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
            className={`w-full relative flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                isActive 
                ? 'bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700' 
                : disabled 
                ? 'text-slate-400 cursor-not-allowed'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
            }`}
        >
            {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-r-full"></div>}
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

const UserProfile: React.FC<{ 
    currentUser: User | null; 
    onLogoutClick: () => void;
    onLevelChange: (newLevel: CEFRLevel) => void;
}> = ({ currentUser, onLogoutClick, onLevelChange }) => {
    if (!currentUser) return null;
    
    const allLevels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

    return (
        <div className="mt-auto p-4 border-t border-slate-200 bg-slate-50">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-grow min-w-0">
                    <p className="font-bold text-slate-800 truncate">{currentUser.name}</p>
                    <div className="relative inline-block group">
                        <select 
                            value={currentUser.level}
                            onChange={(e) => onLevelChange(e.target.value as CEFRLevel)}
                            className="text-xs text-slate-500 font-medium bg-transparent border-none p-0 pr-4 focus:ring-0 focus:outline-none appearance-none cursor-pointer group-hover:text-indigo-600"
                            aria-label="Change CEFR level"
                        >
                            {allLevels.map(level => (
                                <option key={level} value={level}>{level} Level</option>
                            ))}
                        </select>
                        <svg className="absolute right-0 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none group-hover:text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
                <button onClick={onLogoutClick} className="flex-shrink-0 p-2 text-slate-500 hover:bg-red-100 hover:text-red-600 rounded-full transition-colors" title="Đăng xuất">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

const Sidebar: React.FC<{
  viewMode: ViewMode;
  navigateTo: (mode: ViewMode) => void;
  currentUser: User | null;
  onLogoutClick: () => void;
  onLevelChange: (newLevel: CEFRLevel) => void;
}> = ({ viewMode, navigateTo, currentUser, onLogoutClick, onLevelChange }) => {
  return (
    <aside className="sidebar fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200 z-40 flex flex-col">
      <div className="p-4 border-b border-slate-200">
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight cursor-pointer" onClick={() => navigateTo('dashboard')}>
            Học Tiếng Anh <span className="text-indigo-600">Cùng AI</span>
        </h1>
      </div>
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        
        <NavGroup title="Học & Ôn tập">
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
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v.755a4.5 4.5 0 016.364 4.108l.353.353a.75.75 0 11-1.06 1.06l-.354-.353a4.5 4.5 0 01-8.107 0l-.353.353a.75.75 0 01-1.06-1.06l.353-.353A4.5 4.5 0 019.25 4.505V3.75A.75.75 0 0110 3zm-2.25 6a2.25 2.25 0 114.5 0 2.25 2.25 0 01-4.5 0z" clipRule="evenodd" /><path d="M12.25 18a.75.75 0 00-1.5 0v-2.19c-2.443-1.01-4.25-3.328-4.25-6.06V9a.75.75 0 011.5 0v.75a4.75 4.75 0 009.5 0V9a.75.75 0 011.5 0v.75c0 2.732-1.807 5.05-4.25 6.06V18z" /></svg>
            </NavButton>
        </NavGroup>

        <NavGroup title="Luyện Kỹ Năng">
             <NavButton onClick={() => navigateTo('reading')} isActive={viewMode === 'reading'} label="Luyện Đọc">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10.392C3.057 14.71 4.245 14 5.5 14c1.255 0 2.443.29 3.5.804V4.804zM14.5 4c-1.255 0-2.443.29-3.5.804v10.392c1.057.514 2.245.804 3.5.804c1.255 0 2.443-.29 3.5-.804V4.804C16.943 4.29 15.755 4 14.5 4z" /></svg>
            </NavButton>
            <NavButton onClick={() => navigateTo('listening')} isActive={viewMode === 'listening'} label="Luyện Nghe">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M7 4a.75.75 0 01.75.75v10.5a.75.75 0 01-1.5 0V4.75A.75.75 0 017 4zM13 4a.75.75 0 01.75.75v10.5a.75.75 0 01-1.5 0V4.75A.75.75 0 0113 4z" /><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM2 10a8 8 0 1116 0 8 8 0 01-16 0z" clipRule="evenodd" /></svg>
            </NavButton>
            <NavButton onClick={() => navigateTo('conversation')} isActive={viewMode === 'conversation'} label="Luyện Giao tiếp">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" /></svg>
            </NavButton>
            <NavButton onClick={() => navigateTo('pronunciation')} isActive={viewMode === 'pronunciation'} label="Luyện Phát Âm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8h-1a6 6 0 11-12 0H3a7.001 7.001 0 006 6.93V17H7a1 1 0 100 2h6a1 1 0 100-2h-2v-2.07z" clipRule="evenodd" /></svg>
            </NavButton>
             <NavButton onClick={() => navigateTo('writing')} isActive={viewMode === 'writing'} label="Luyện Viết">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
            </NavButton>
             <NavButton onClick={() => navigateTo('role-play')} isActive={viewMode === 'role-play'} label="Tình huống nhập vai">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.75.75 0 011.02.043 8.002 8.002 0 0111.985 0 .75.75 0 011.02-.043 9.502 9.502 0 00-14.025 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14.51 15.326a.75.75 0 011.02.043A8.003 8.003 0 0117 18.25a.75.75 0 11-1.44.438 6.503 6.503 0 00-11.12 0 .75.75 0 11-1.44-.438 8.003 8.003 0 012.92-2.88.75.75 0 011.02.043z" /></svg>
            </NavButton>
        </NavGroup>
        
        <NavGroup title="Cộng đồng">
            <NavButton onClick={() => navigateTo('leaderboard')} isActive={viewMode === 'leaderboard'} label="Bảng xếp hạng">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M18 3a1 1 0 00-1.447-.894L13 4.434V3a1 1 0 00-2 0v2.268l-3-1.92-2.32.774A1 1 0 002.732 5H2a1 1 0 00-1 1v8a1 1 0 001 1h.732a1 1 0 00.948-.684L5 13.08l3-1.92V17a1 1 0 002 0v-1.566l3.553 2.279A1 1 0 0018 17V4a1 1 0 000-1z" /></svg>
            </NavButton>
            <NavButton onClick={() => navigateTo('challenges')} isActive={viewMode === 'challenges'} label="Thử thách">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 4a1 1 0 112 0v1a1 1 0 11-2 0V4z" clipRule="evenodd" /><path d="M10 8a1 1 0 011 1v4a1 1 0 11-2 0v-4a1 1 0 011-1z" /></svg>
            </NavButton>
            <NavButton onClick={() => navigateTo('video-lessons')} isActive={viewMode === 'video-lessons'} label="Bài giảng Video">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M3.5 2.75a.75.75 0 00-1.5 0v14.5a.75.75 0 001.5 0v-4.392l1.657-.348a6.44 6.44 0 015.686 0l1.657.348V17.25a.75.75 0 001.5 0V2.75a.75.75 0 00-1.5 0v4.392l-1.657.348a6.44 6.44 0 01-5.686 0L3.5 7.142V2.75z" /></svg>
            </NavButton>
             <NavButton onClick={() => navigateTo('community-forum')} isActive={viewMode === 'community-forum' || viewMode === 'forum-topic'} label="Diễn đàn" disabled>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5A1.5 1.5 0 0116.5 18h-13A1.5 1.5 0 012 16.5v-13z" /></svg>
            </NavButton>
        </NavGroup>
      </nav>
      <UserProfile currentUser={currentUser} onLogoutClick={onLogoutClick} onLevelChange={onLevelChange} />
    </aside>
  );
};

export default Sidebar;
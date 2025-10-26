import React, { useState, useEffect, useRef, useMemo } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import WordList from './components/WordList';
import FlashcardView from './components/FlashcardView';
import QuizView from './components/QuizView';
import AIStoryView from './components/AIStoryView';
import LoginModal from './components/LoginModal';
import { WORD_CATEGORIES, ALL_WORDS } from './constants';
import type { Category, User, StudyProgress, StudyStatus } from './types';

type ViewMode = 'list' | 'flashcard' | 'quiz' | 'story';

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>(WORD_CATEGORIES[0]?.id || '');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [studyProgress, setStudyProgress] = useState<StudyProgress>({});

  const mainContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Persist user login
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    // Load study progress
    const storedProgress = localStorage.getItem('studyProgress');
    if (storedProgress) {
        setStudyProgress(JSON.parse(storedProgress));
    }
  }, []);

  useEffect(() => {
    if (viewMode !== 'list') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.id);
          }
        });
      },
      {
        root: mainContentRef.current,
        rootMargin: '-150px 0px -70% 0px',
        threshold: 0,
      }
    );

    const sections = mainContentRef.current?.querySelectorAll('section[id]');
    sections?.forEach((section) => observer.observe(section));

    return () => {
      sections?.forEach((section) => observer.unobserve(section));
    };
  }, [viewMode]);

  const handleCategoryClick = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleLogin = (name: string) => {
    const user = { name };
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };
  
  const handleUpdateStudyProgress = (wordEnglish: string, status: StudyStatus) => {
    const newProgress = { ...studyProgress, [wordEnglish]: status };
    setStudyProgress(newProgress);
    localStorage.setItem('studyProgress', JSON.stringify(newProgress));
  };
  
  const handleResetStudyProgress = (wordKeys: string[]) => {
      const newProgress = { ...studyProgress };
      wordKeys.forEach(key => {
          delete newProgress[key];
      });
      setStudyProgress(newProgress);
      localStorage.setItem('studyProgress', JSON.stringify(newProgress));
  };

  const filteredCategories = useMemo((): Category[] => {
    if (!searchQuery) {
      return WORD_CATEGORIES;
    }
    const lowercasedQuery = searchQuery.toLowerCase();
    
    const relevantCategories: Category[] = [];
    WORD_CATEGORIES.forEach(category => {
        const wordsInCategory = category.words.filter(word =>
            word.english.toLowerCase().includes(lowercasedQuery) ||
            word.vietnamese.toLowerCase().includes(lowercasedQuery)
        );
        if (wordsInCategory.length > 0) {
            relevantCategories.push({ ...category, words: wordsInCategory });
        }
    });
    return relevantCategories;
  }, [searchQuery]);
  
  const filteredWords = useMemo(() => {
      if (!searchQuery) return ALL_WORDS;
      const lowercasedQuery = searchQuery.toLowerCase();
      return ALL_WORDS.filter(word =>
          word.english.toLowerCase().includes(lowercasedQuery) ||
          word.vietnamese.toLowerCase().includes(lowercasedQuery)
      );
  }, [searchQuery]);


  const hasSearchResults = useMemo(() => filteredCategories.length > 0, [filteredCategories]);

  const renderView = () => {
    switch(viewMode) {
      case 'story':
        return <AIStoryView words={ALL_WORDS} studyProgress={studyProgress} />;
      case 'flashcard':
        return (
          <div className="flex-1 flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-slate-800 my-6 text-center flex-shrink-0">Chế độ Flashcard</h2>
            <FlashcardView 
              words={filteredWords} 
              categories={WORD_CATEGORIES}
              studyProgress={studyProgress}
              onUpdateStudyProgress={handleUpdateStudyProgress}
              onResetStudyProgress={handleResetStudyProgress}
            />
          </div>
        );
      case 'quiz':
         return (
          <div className="flex-1 flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-slate-800 my-6 text-center flex-shrink-0">Luyện tập trắc nghiệm</h2>
            <QuizView allWords={ALL_WORDS} wordsForQuiz={filteredWords} categories={WORD_CATEGORIES} />
          </div>
        );
      case 'list':
      default:
        return (
          <div className="flex-grow max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8 py-8">
              {isSidebarOpen && (
                <div className="lg:col-span-3">
                  <Sidebar 
                    categories={WORD_CATEGORIES} 
                    activeCategory={activeCategory} 
                    onCategoryClick={handleCategoryClick}
                  />
                </div>
              )}
              <main 
                ref={mainContentRef} 
                className={`relative transition-all duration-300 ${isSidebarOpen ? 'lg:col-span-9' : 'lg:col-span-12'} w-full mt-8 lg:mt-0 lg:max-h-[calc(100vh-100px)] overflow-y-auto`}
              >
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="hidden lg:flex items-center justify-center absolute top-16 -left-4 z-20 w-8 h-8 bg-white rounded-full shadow-md border hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label={isSidebarOpen ? 'Ẩn chủ đề' : 'Hiện chủ đề'}
                    title={isSidebarOpen ? 'Ẩn chủ đề' : 'Hiện chủ đề'}
                >
                    {isSidebarOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    )}
                </button>
                {searchQuery && !hasSearchResults ? (
                    <div className="text-center py-16">
                        <h3 className="text-xl font-semibold text-slate-600">Không tìm thấy từ nào</h3>
                        <p className="text-slate-500 mt-2">Hãy thử một từ khóa khác.</p>
                    </div>
                ) : (
                   <>
                      <h2 className="text-3xl font-bold text-slate-800 mb-6">Danh sách từ vựng</h2>
                      <WordList categories={filteredCategories} />
                    </>
                )}
              </main>
            </div>
          </div>
        )
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      <Header 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        viewMode={viewMode}
        setViewMode={setViewMode}
        currentUser={currentUser}
        onLoginClick={() => setIsLoginModalOpen(true)}
        onLogoutClick={handleLogout}
      />
      
      {renderView()}

       <footer className="w-full bg-white text-center py-4 border-t mt-auto">
        <p className="text-sm text-slate-500">Bản quyền © 2025 bởi Long Nguyễn</p>
      </footer>
      
      {isLoginModalOpen && (
        <LoginModal 
          onClose={() => setIsLoginModalOpen(false)}
          onLogin={handleLogin}
        />
      )}
    </div>
  );
};

export default App;
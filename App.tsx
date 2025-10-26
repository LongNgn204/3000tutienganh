import React, { useState, useEffect, useRef, useMemo, Suspense, lazy } from 'react';
import Header from './components/Header';
import { WORD_CATEGORIES, ALL_WORDS } from './constants';
import type { User, StudyProgress, StudyStatus, ViewMode, PlacementTestResult } from './types';
import Footer from './components/Footer';
import * as api from './services/api';

// Lazy load components for better performance
const Sidebar = lazy(() => import('./components/Sidebar'));
const WordList = lazy(() => import('./components/WordList'));
const FlashcardView = lazy(() => import('./components/FlashcardView'));
const QuizView = lazy(() => import('./components/QuizView'));
const AIStoryView = lazy(() => import('./components/AIStoryView'));
const DashboardView = lazy(() => import('./components/DashboardView'));
const ConversationView = lazy(() => import('./components/ConversationView'));
const PlacementTestView = lazy(() => import('./components/PlacementTestView'));
const PlacementTestResultView = lazy(() => import('./components/PlacementTestResultView'));
const PronunciationView = lazy(() => import('./components/PronunciationView'));
const GrammarView = lazy(() => import('./components/GrammarView'));
const ListeningView = lazy(() => import('./components/ListeningView'));
const AdvancedGrammarView = lazy(() => import('./components/AdvancedGrammarView'));
const AuthView = lazy(() => import('./components/AuthView'));


const Loader: React.FC = () => (
    <div className="flex-1 flex items-center justify-center h-full">
        <div className="w-14 h-14 border-4 border-slate-200 border-b-indigo-500 rounded-full animate-spin"></div>
    </div>
);

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>(WORD_CATEGORIES[0]?.id || '');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('auth');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [studyProgress, setStudyProgress] = useState<StudyProgress>({});
  const [initialFlashcardFilter, setInitialFlashcardFilter] = useState<'review' | 'unknown' | null>(null);
  const [testResultToShow, setTestResultToShow] = useState<PlacementTestResult | null>(null);
  const [pendingUserName, setPendingUserName] = useState<string | null>(null);


  const mainContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const verifySession = async () => {
        const { user } = await api.checkSession();
        if (user) {
            setCurrentUser(user);
            setStudyProgress(user.studyProgress || {});
            setViewMode('dashboard');
        } else {
            setViewMode('auth');
        }
    };
    verifySession();
  }, []);

  const handleRegister = async (name: string, password: string): Promise<{ success: boolean, message?: string }> => {
    const result = await api.register(name, password);
    if (result.success) {
        setPendingUserName(name);
        setViewMode('placement-test');
    }
    return result;
  };

  const handleLogin = async (name: string, password: string): Promise<{ success: boolean, message?: string }> => {
    const result = await api.login(name, password);
    if (result.success && result.user) {
        if (!result.user.level) { // User registered but didn't complete the placement test
            setPendingUserName(name);
            setViewMode('placement-test');
        } else {
            setCurrentUser(result.user);
            setStudyProgress(result.user.studyProgress || {});
            setViewMode('dashboard');
        }
        return { success: true };
    }
    return { success: false, message: result.message };
  };

  const handlePlacementTestSubmit = (result: PlacementTestResult) => {
      setTestResultToShow(result);
      setViewMode('placement-test-result');
  };

  const handlePlacementTestComplete = async () => {
    if (!pendingUserName || !testResultToShow) return;
    
    const result = await api.completePlacementTest(pendingUserName, testResultToShow);

    if (result.success && result.user) {
        setCurrentUser(result.user);
        setStudyProgress(result.user.studyProgress || {});
    } else {
        console.error("Failed to complete placement test:", result.message);
        // Fallback or show error
        setViewMode('auth');
        return;
    }

    setPendingUserName(null);
    setTestResultToShow(null);
    setViewMode('dashboard');
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    setStudyProgress({});
    setViewMode('auth');
  };
  
  const handleUpdateStudyProgress = async (wordEnglish: string, status: StudyStatus) => {
    if (!currentUser) return;
    const newProgress = { ...studyProgress, [wordEnglish]: status };
    setStudyProgress(newProgress);
    await api.updateProgress(currentUser.name, newProgress);
  };
  
  const handleResetStudyProgress = async (wordKeys: string[]) => {
      if (!currentUser) return;
      const newProgress = { ...studyProgress };
      wordKeys.forEach(key => {
          delete newProgress[key];
      });
      setStudyProgress(newProgress);
      await api.updateProgress(currentUser.name, newProgress);
  };

  const navigateTo = (mode: ViewMode, options?: { initialFilter: 'review' | 'unknown' }) => {
    if (options?.initialFilter) {
      setInitialFlashcardFilter(options.initialFilter);
    } else {
      setInitialFlashcardFilter(null);
    }
    setViewMode(mode);
    setIsMobileSidebarOpen(false);
  };

  const filteredWords = useMemo(() => {
      if (!searchQuery) return ALL_WORDS;
      const lowercasedQuery = searchQuery.toLowerCase();
      return ALL_WORDS.filter(word =>
          word.english.toLowerCase().includes(lowercasedQuery) ||
          word.vietnamese.toLowerCase().includes(lowercasedQuery)
      );
  }, [searchQuery]);


  const renderView = () => {
    switch(viewMode) {
      case 'dashboard':
        return <DashboardView 
                  currentUser={currentUser} 
                  studyProgress={studyProgress}
                  categories={WORD_CATEGORIES}
                  navigateTo={navigateTo}
               />;
      case 'story':
        return <AIStoryView words={ALL_WORDS} studyProgress={studyProgress} />;
      case 'conversation':
        return <ConversationView allWords={ALL_WORDS} studyProgress={studyProgress} currentUser={currentUser} />;
      case 'pronunciation':
        return <PronunciationView words={ALL_WORDS} studyProgress={studyProgress} />;
      case 'grammar':
        return <GrammarView />;
      case 'listening':
        return <ListeningView currentUser={currentUser} />;
      case 'advanced-grammar':
        return <AdvancedGrammarView currentUser={currentUser} />;
      case 'flashcard':
        return <FlashcardView 
              words={filteredWords} 
              categories={WORD_CATEGORIES}
              studyProgress={studyProgress}
              onUpdateStudyProgress={handleUpdateStudyProgress}
              onResetStudyProgress={handleResetStudyProgress}
              initialStudyFilter={initialFlashcardFilter}
              onInitialFilterConsumed={() => setInitialFlashcardFilter(null)}
            />;
      case 'quiz':
         return <QuizView allWords={ALL_WORDS} wordsForQuiz={filteredWords} categories={WORD_CATEGORIES} />;
      case 'list':
      default:
        return <WordList 
                  categories={WORD_CATEGORIES}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                  mainContentRef={mainContentRef}
                />
    }
  };

  // Auth Guard
  if (!currentUser) {
    return (
        <Suspense fallback={<div id="initial-loader"><div className="spinner"></div></div>}>
            {(() => {
                 switch(viewMode) {
                    case 'placement-test':
                        return <PlacementTestView onTestSubmit={handlePlacementTestSubmit} />;
                    case 'placement-test-result':
                        return <PlacementTestResultView result={testResultToShow!} onComplete={handlePlacementTestComplete} />;
                    case 'auth':
                    default:
                        return <AuthView onLogin={handleLogin} onRegister={handleRegister} />;
                 }
            })()}
        </Suspense>
    );
  }

  // Main App Layout
  return (
    <div className={`min-h-screen text-slate-800 flex ${isMobileSidebarOpen ? 'sidebar-open' : ''}`}>
      <Suspense fallback={<div></div>}>
        <Sidebar 
          viewMode={viewMode} 
          navigateTo={navigateTo}
          currentUser={currentUser}
          onLogoutClick={handleLogout}
        />
      </Suspense>
      <div 
        className="fixed inset-0 bg-black/50 z-30 lg:hidden sidebar-overlay opacity-0 pointer-events-none transition-opacity"
        onClick={() => setIsMobileSidebarOpen(false)}
      ></div>

      <div className="flex flex-col flex-1 lg:pl-64">
        <Header 
          viewMode={viewMode}
          onMenuClick={() => setIsMobileSidebarOpen(true)}
        />
        <main className="flex-1 flex flex-col">
          <Suspense fallback={<Loader />}>
            <div className="flex-grow w-full max-w-screen-2xl mx-auto flex flex-col">
              {renderView()}
            </div>
          </Suspense>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default App;
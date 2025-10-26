import React, { useState, useEffect, useRef, useMemo, Suspense, lazy } from 'react';
import Header from './components/Header';
import { WORD_CATEGORIES, ALL_WORDS } from './constants';
import type { User, StudyProgress, ViewMode, PlacementTestResult, StudyRecord, DailyProgress, DailyGoal } from './types';
import Footer from './components/Footer';
import * as api from './services/api';
import * as srsService from './services/srsService';

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
const ReadingRoomView = lazy(() => import('./components/ReadingRoomView'));


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
  const [dailyProgress, setDailyProgress] = useState<DailyProgress | null>(null);
  const [initialFlashcardFilter, setInitialFlashcardFilter] = useState<'review' | 'new' | null>(null);
  const [testResultToShow, setTestResultToShow] = useState<PlacementTestResult | null>(null);
  const [pendingUserName, setPendingUserName] = useState<string | null>(null);


  const mainContentRef = useRef<HTMLDivElement>(null);

  const initializeDailyProgress = (user: User): DailyProgress => {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      const lastProgress = user.dailyProgress;
      let newStreak = 1;

      if (lastProgress) {
          if (lastProgress.date === today) {
              // Already initialized for today
              return lastProgress;
          }
          if (lastProgress.date === yesterdayStr) {
              const allGoalsMet = lastProgress.goals.every(g => g.current >= g.target);
              if (allGoalsMet) {
                  newStreak = lastProgress.streak + 1;
              } else {
                  newStreak = 0; // Streak broken
              }
          } else {
              newStreak = 1; // Not consecutive day
          }
      }

      const newGoals: DailyGoal[] = [
          { id: 'g1', description: 'Học 10 từ mới', type: 'learn_new', target: 10, current: 0 },
          { id: 'g2', description: 'Ôn tập 15 từ SRS', type: 'review_srs', target: 15, current: 0 },
          { id: 'g3', description: 'Luyện giao tiếp 1 lần', type: 'complete_conversation', target: 1, current: 0 },
      ];

      return { date: today, streak: newStreak, goals: newGoals };
  };

  useEffect(() => {
    const verifySession = async () => {
        const { user } = await api.checkSession();
        if (user) {
            setCurrentUser(user);
            setStudyProgress(user.studyProgress || {});
            const newDailyProgress = initializeDailyProgress(user);
            setDailyProgress(newDailyProgress);
            api.updateDailyProgress(user.name, newDailyProgress);
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
            const newDailyProgress = initializeDailyProgress(result.user);
            setDailyProgress(newDailyProgress);
            api.updateDailyProgress(result.user.name, newDailyProgress);
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
        const newDailyProgress = initializeDailyProgress(result.user);
        setDailyProgress(newDailyProgress);
        api.updateDailyProgress(result.user.name, newDailyProgress);
    } else {
        console.error("Failed to complete placement test:", result.message);
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
    setDailyProgress(null);
    setViewMode('auth');
  };
  
  const handleUpdateStudyProgress = async (wordEnglish: string, performance: 'again' | 'good' | 'easy') => {
    if (!currentUser) return;

    const currentRecord = studyProgress[wordEnglish] || srsService.getInitialRecord();
    const isNewWord = !studyProgress[wordEnglish];
    const newRecord = srsService.calculateNextReview(currentRecord, performance);
    
    const newProgress = { ...studyProgress, [wordEnglish]: newRecord };
    setStudyProgress(newProgress);
    await api.updateProgress(currentUser.name, newProgress);

    if (performance !== 'again' && isNewWord) {
      handleGoalUpdate('learn_new', 1);
    }
    handleGoalUpdate('review_srs', 1);
  };

  const handleGoalUpdate = async (type: DailyGoal['type'], amount: number) => {
    if (!currentUser || !dailyProgress) return;

    const newGoals = dailyProgress.goals.map(goal => {
        if (goal.type === type) {
            return { ...goal, current: Math.min(goal.target, goal.current + amount) };
        }
        return goal;
    });

    const newDailyProgress = { ...dailyProgress, goals: newGoals };
    setDailyProgress(newDailyProgress);
    await api.updateDailyProgress(currentUser.name, newDailyProgress);
  }
  
  const handleResetStudyProgress = async (wordKeys: string[]) => {
      if (!currentUser) return;
      const newProgress = { ...studyProgress };
      wordKeys.forEach(key => {
          delete newProgress[key];
      });
      setStudyProgress(newProgress);
      await api.updateProgress(currentUser.name, newProgress);
  };

  const navigateTo = (mode: ViewMode, options?: { initialFilter: 'review' | 'new' }) => {
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
                  dailyProgress={dailyProgress}
                  categories={WORD_CATEGORIES}
                  navigateTo={navigateTo}
               />;
      case 'story':
        return <AIStoryView words={ALL_WORDS} studyProgress={studyProgress} onGoalUpdate={() => handleGoalUpdate('complete_story', 1)} />;
      case 'conversation':
        return <ConversationView allWords={ALL_WORDS} studyProgress={studyProgress} currentUser={currentUser} onGoalUpdate={() => handleGoalUpdate('complete_conversation', 1)} />;
      case 'pronunciation':
        return <PronunciationView words={ALL_WORDS} studyProgress={studyProgress} onGoalUpdate={() => handleGoalUpdate('complete_pronunciation', 1)} />;
      case 'grammar':
        return <GrammarView />;
      case 'listening':
        return <ListeningView currentUser={currentUser} onGoalUpdate={() => handleGoalUpdate('complete_listening', 1)}/>;
      case 'advanced-grammar':
        return <AdvancedGrammarView currentUser={currentUser} onGoalUpdate={() => handleGoalUpdate('complete_adv_grammar', 1)} />;
      case 'reading':
        return <ReadingRoomView currentUser={currentUser} onGoalUpdate={() => handleGoalUpdate('complete_reading', 1)} />;
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
         return <QuizView allWords={ALL_WORDS} wordsForQuiz={filteredWords} categories={WORD_CATEGORIES} onGoalUpdate={() => handleGoalUpdate('complete_quiz', 1)} />;
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
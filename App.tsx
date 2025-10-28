

import React, { useState, useEffect, useRef, useMemo, Suspense, lazy } from 'react';
import Header from './components/Header';
import { WORD_CATEGORIES as CONSTANT_WORD_CATEGORIES, ALL_WORDS as CONSTANT_ALL_WORDS, TYPE_COLORS } from './constants';
import { CHALLENGES } from './challengesData';
import type { User, StudyProgress, ViewMode, PlacementTestResult, StudyRecord, DailyProgress, DailyGoal, Category, Word, ForumPost, ForumReply, StudyPlan, UserStudyPlanInput, CEFRLevel, ChallengeProgress } from './types';
import * as api from './services/api';
import * as srsService from './services/srsService';
import { FORUM_TOPICS, FORUM_POSTS_DATA } from './forumData';
import { GoogleGenAI, Type } from '@google/genai';
import { CONTENT_LIBRARY } from './contentLibrary';

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
const AIWritingView = lazy(() => import('./components/AIWritingView'));
const AIRolePlayView = lazy(() => import('./components/AIRolePlayView'));
const WelcomeView = lazy(() => import('./components/WelcomeView'));
const LandingView = lazy(() => import('./components/LandingView'));
const LeaderboardView = lazy(() => import('./components/LeaderboardView'));
const ChallengesView = lazy(() => import('./components/ChallengesView'));
const VideoLessonsView = lazy(() => import('./components/VideoLessonsView'));
const CommunityForumView = lazy(() => import('./components/CommunityForumView'));
const ForumTopicView = lazy(() => import('./components/ForumTopicView'));
const IPAChartView = lazy(() => import('./components/IPAChartView'));
const AIChatTutorView = lazy(() => import('./components/AIChatTutorView'));
const ProgressDashboardView = lazy(() => import('./components/ProgressDashboardView'));
const VstepExamView = lazy(() => import('./components/VstepExamView'));
const StudyPlanWizardView = lazy(() => import('./components/StudyPlanWizardView'));


const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('landing');
    const [wordCategories, setWordCategories] = useState<Category[]>(CONSTANT_WORD_CATEGORIES);
    const [allWords, setAllWords] = useState<Word[]>(CONSTANT_ALL_WORDS);
    const [studyProgress, setStudyProgress] = useState<StudyProgress>({});
    const [dailyProgress, setDailyProgress] = useState<DailyProgress | null>(null);
    const [challengeProgress, setChallengeProgress] = useState<ChallengeProgress>({});
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
    
    // State for specific views
    const [searchQuery, setSearchQuery] = useState('');
    const [activeWordListCategory, setActiveWordListCategory] = useState(wordCategories[0]?.id || 'all');
    const [initialFlashcardFilter, setInitialFlashcardFilter] = useState<'review' | 'new' | null>(null);
    const [initialFlashcardCategory, setInitialFlashcardCategory] = useState<string | null>(null);
    const [initialContentId, setInitialContentId] = useState<string | null>(null);
    const [forumPosts, setForumPosts] = useState<Record<string, ForumPost[]>>(FORUM_POSTS_DATA);
    const [activeForumTopicId, setActiveForumTopicId] = useState<string | null>(null);


    const mainContentRef = useRef<HTMLDivElement>(null);

    // Initial load - check for existing session
    useEffect(() => {
        const checkUserSession = async () => {
            const { user } = await api.checkSession();
            if (user) {
                handleLoginSuccess(user, true); // Don't show welcome screen on session restore
            }
            // Add a small delay to prevent loader flashing
            setTimeout(() => setIsLoading(false), 300);
        };
        checkUserSession();
    }, []);

    const navigateTo = (mode: ViewMode, options: any = {}) => {
        setViewMode(mode);
        if (mainContentRef.current) {
            mainContentRef.current.scrollTop = 0;
        }
        if (options.initialFilter) {
            setInitialFlashcardFilter(options.initialFilter);
        }
        if (options.initialCategory) {
            setInitialFlashcardCategory(options.initialCategory);
        }
        if (options.targetId) {
            setInitialContentId(options.targetId);
        }
        if (options.topicId) {
            setActiveForumTopicId(options.topicId);
        }
        setIsSidebarOpen(false); // Close sidebar on navigation
    };

    const handleLoginSuccess = (user: User, isSessionRestore = false) => {
        setCurrentUser(user);
        setStudyProgress(user.studyProgress || {});
        setDailyProgress(user.dailyProgress || null);
        setChallengeProgress(user.challengeProgress || {});
        
        // Combine constant words with user's custom words
        const combinedCategories = [...CONSTANT_WORD_CATEGORIES];
        if (user.customWords && user.customWords.length > 0) {
            combinedCategories.push({
                id: 'custom',
                name: 'Từ của bạn',
                level: user.level, // Or a generic level
                words: user.customWords
            });
        }
        setWordCategories(combinedCategories);
        setAllWords(combinedCategories.flatMap(cat => cat.words));
        
        // Navigation logic
        if (!user.placementTestResult) {
            navigateTo('placement-test');
        } else if (isSessionRestore) {
             navigateTo('dashboard');
        } else {
            navigateTo('welcome');
        }

        // Auto-generate study plan if one doesn't exist
        if (user.placementTestResult && !user.studyPlan) {
            generateAndSaveAutomaticStudyPlan(user);
        }
    };

    const handleRegisterSuccess = (user: User) => {
        handleLoginSuccess(user); // Treat register as an immediate login
    };

    const handleLogout = () => {
        api.logout();
        setCurrentUser(null);
        setViewMode('landing');
    };

    const updateAndSaveUser = async (updatedUser: User) => {
        setCurrentUser(updatedUser);
        await api.updateUser(updatedUser);
    };

    const handleUpdateStudyProgress = async (wordEnglish: string, performance: 'again' | 'good' | 'easy') => {
        const currentRecord = studyProgress[wordEnglish] || srsService.getInitialRecord();
        const newRecord = srsService.calculateNextReview(currentRecord, performance);
        
        const updatedProgress = { ...studyProgress, [wordEnglish]: newRecord };
        setStudyProgress(updatedProgress);
        
        if(currentUser) {
            const updatedUser = { ...currentUser, studyProgress: updatedProgress };
            setCurrentUser(updatedUser); // Optimistic update
            await api.updateUser(updatedUser); // Persist
            handleGoalUpdate(performance === 'again' ? 'review_srs' : (currentRecord.srsLevel === 0 ? 'learn_new' : 'review_srs'));
        }
    };
    
    const generateAndSaveAutomaticStudyPlan = async (user: User) => {
        if (!user) return;
        setIsGeneratingPlan(true);

        const cefrOrder: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
        const userLevelIndex = cefrOrder.indexOf(user.level);
        const relevantLevels: CEFRLevel[] = [user.level];
        if (userLevelIndex < cefrOrder.length - 1) {
            relevantLevels.push(cefrOrder[userLevelIndex + 1]);
        }

        const availableFlashcards = CONSTANT_WORD_CATEGORIES
            .filter(cat => relevantLevels.includes(cat.level))
            .map(cat => `{id: "${cat.id}", name: "${cat.name}"}`);
            
        const availableReadings = CONTENT_LIBRARY.reading
            .filter(art => relevantLevels.includes(art.level))
            .map(art => `{id: "${art.id}", title: "${art.title}"}`);

        const availableListenings = CONTENT_LIBRARY.listening
            .filter(ex => relevantLevels.includes(ex.level))
            .map(ex => `{id: "${ex.id}", title: "${ex.title}"}`);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Act as an expert language learning curriculum designer for a Vietnamese learner. Based on the user's CEFR level and a list of available content, create a personalized 7-day study plan.

User's CEFR Level: ${user.level}
Time per day: 30 minutes (default)

**Available Content Catalog (pre-filtered for the user's level):**
- Flashcard Categories: [${availableFlashcards.join(', ')}]
- Reading Articles: [${availableReadings.join(', ')}]
- Listening Exercises: [${availableListenings.join(', ')}]

**CRITICAL Instructions:**
1.  Create a balanced plan for 7 days ("day1" to "day7").
2.  Total duration for each day should be around 30 minutes.
3.  For tasks of type 'flashcard_new', 'flashcard_review', 'reading', or 'listening', you MUST include a 'targetId'.
4.  The 'targetId' **MUST BE CHOSEN EXCLUSIVELY** from the "Available Content Catalog".
5.  The 'description' **MUST CORRESPOND** to the title/name for the chosen 'targetId'.
6.  Return ONLY the valid JSON object.`;

            const taskSchema = {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING }, description: { type: Type.STRING },
                    type: { type: Type.STRING }, duration: { type: Type.INTEGER },
                    completed: { type: Type.BOOLEAN }, targetId: { type: Type.STRING }
                },
                required: ['id', 'description', 'type', 'duration', 'completed']
            };

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash', contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            day1: { type: Type.ARRAY, items: taskSchema }, day2: { type: Type.ARRAY, items: taskSchema },
                            day3: { type: Type.ARRAY, items: taskSchema }, day4: { type: Type.ARRAY, items: taskSchema },
                            day5: { type: Type.ARRAY, items: taskSchema }, day6: { type: Type.ARRAY, items: taskSchema },
                            day7: { type: Type.ARRAY, items: taskSchema },
                        },
                        required: ['day1', 'day2', 'day3', 'day4', 'day5', 'day6', 'day7']
                    }
                }
            });

            const plan: StudyPlan = JSON.parse(response.text);
            const updatedUser = { ...user, studyPlan: plan };
            await updateAndSaveUser(updatedUser);

        } catch (err) {
            console.error("Automatic Study Plan Generation Error:", err);
            // Optionally set an error state to show on the dashboard
        } finally {
            setIsGeneratingPlan(false);
        }
    };

    const handlePlacementTestComplete = async (result: PlacementTestResult) => {
        if (!currentUser) return;
        const updatedUser: User = { ...currentUser, level: result.level, placementTestResult: result, studyPlan: undefined }; // Reset plan on re-test
        await updateAndSaveUser(updatedUser);
        await generateAndSaveAutomaticStudyPlan(updatedUser); // Generate new plan automatically
        navigateTo('placement-test-result');
    };

    const handleLevelChange = async (newLevel: CEFRLevel) => {
        if (!currentUser || currentUser.level === newLevel) return;
        if (confirm(`Bạn có chắc muốn đổi trình độ sang ${newLevel} không? Lộ trình học hiện tại sẽ được thay thế.`)) {
            const updatedUser = { ...currentUser, level: newLevel, studyPlan: undefined };
            await updateAndSaveUser(updatedUser);
            await generateAndSaveAutomaticStudyPlan(updatedUser);
        }
    };
    
    const handleGoalUpdate = async (type: DailyGoal['type']) => {
        // This function will be called from child components after a learning activity is completed.
        // It updates both daily goals and weekly challenges.
        if (!currentUser) return;

        let currentChallengeProgress = { ...(currentUser.challengeProgress || {}) };
        
        CHALLENGES.forEach(challenge => {
            if (challenge.goalType === type) {
                const progress = currentChallengeProgress[challenge.id] || { current: 0, completed: false };
                if (!progress.completed) {
                    progress.current += 1;
                    if (progress.current >= challenge.target) {
                        progress.completed = true;
                        // Maybe trigger a notification here in the future
                    }
                    currentChallengeProgress[challenge.id] = progress;
                }
            }
        });

        const updatedUser = { ...currentUser, challengeProgress: currentChallengeProgress };
        await updateAndSaveUser(updatedUser); // Save the updated progress
    };
    
    const toggleSidebar = () => {
        setIsSidebarCollapsed(prev => !prev);
    };

    const filteredWordsForQuiz = useMemo(() => {
        if (!searchQuery) return allWords;
        const lowercasedQuery = searchQuery.toLowerCase();
        return allWords.filter(word =>
            word.english.toLowerCase().includes(lowercasedQuery) ||
            word.vietnamese.toLowerCase().includes(lowercasedQuery)
        );
    }, [searchQuery, allWords]);
    

    if (isLoading) {
        return (
            <div id="initial-loader">
                <div className="spinner"></div>
            </div>
        );
    }

    if (viewMode === 'landing') {
        return <Suspense fallback={<div/>}><LandingView onStart={() => navigateTo('auth')} /></Suspense>;
    }
    
    if (!currentUser) {
        return (
          <Suspense fallback={<div/>}>
            <AuthView
              onLogin={async (name, password) => {
                const result = await api.login(name, password);
                if (result.success && result.user) handleLoginSuccess(result.user);
                return result;
              }}
              onRegister={async (name, password) => {
                 const result = await api.register(name, password);
                if (result.success && result.user) handleRegisterSuccess(result.user);
                return result;
              }}
            />
          </Suspense>
        );
    }
    
    const renderView = () => {
        switch (viewMode) {
            case 'dashboard':
                return <DashboardView currentUser={currentUser} studyProgress={studyProgress} dailyProgress={dailyProgress} categories={wordCategories} allWords={allWords} navigateTo={navigateTo} isGeneratingPlan={isGeneratingPlan} />;
            case 'list':
                return <WordList 
                    categories={wordCategories} 
                    searchQuery={searchQuery} 
                    setSearchQuery={setSearchQuery}
                    activeCategory={activeWordListCategory}
                    setActiveCategory={setActiveWordListCategory}
                    mainContentRef={mainContentRef}
                    onAddNewWord={async () => {}} // Placeholder for now
                />;
            case 'flashcard':
                 return <FlashcardView 
                    words={allWords} 
                    categories={wordCategories}
                    studyProgress={studyProgress} 
                    onUpdateStudyProgress={handleUpdateStudyProgress}
                    onResetStudyProgress={() => {}} // Placeholder
                    initialStudyFilter={initialFlashcardFilter}
                    onInitialFilterConsumed={() => setInitialFlashcardFilter(null)}
                    initialCategory={initialFlashcardCategory}
                    onInitialCategoryConsumed={() => setInitialFlashcardCategory(null)}
                 />;
            case 'quiz':
                return <QuizView allWords={allWords} wordsForQuiz={filteredWordsForQuiz} categories={wordCategories} onGoalUpdate={() => handleGoalUpdate('complete_quiz')} />;
            case 'grammar':
                return <GrammarView />;
            case 'conversation':
                return <ConversationView allWords={allWords} studyProgress={studyProgress} currentUser={currentUser} onGoalUpdate={() => handleGoalUpdate('complete_conversation')} />;
            case 'pronunciation':
                return <PronunciationView words={allWords} studyProgress={studyProgress} onGoalUpdate={() => handleGoalUpdate('complete_pronunciation')} />;
            case 'story':
                return <AIStoryView words={allWords} studyProgress={studyProgress} onGoalUpdate={() => handleGoalUpdate('complete_story')} />;
            case 'placement-test':
                return <PlacementTestView onTestSubmit={handlePlacementTestComplete} />;
            case 'placement-test-result':
                return currentUser.placementTestResult ? <PlacementTestResultView result={currentUser.placementTestResult} onComplete={() => navigateTo('dashboard')} /> : null;
            case 'listening':
                return <ListeningView currentUser={currentUser} onGoalUpdate={() => handleGoalUpdate('complete_listening')} initialContentId={initialContentId} onInitialContentConsumed={() => setInitialContentId(null)} />;
            case 'advanced-grammar':
                return <AdvancedGrammarView currentUser={currentUser} onGoalUpdate={() => handleGoalUpdate('complete_adv_grammar')} />;
            case 'reading':
                return <ReadingRoomView currentUser={currentUser} onGoalUpdate={() => handleGoalUpdate('complete_reading')} initialContentId={initialContentId} onInitialContentConsumed={() => setInitialContentId(null)} />;
            case 'writing':
                return <AIWritingView currentUser={currentUser} onGoalUpdate={() => handleGoalUpdate('complete_writing')} />;
            case 'role-play':
                return <AIRolePlayView currentUser={currentUser} onGoalUpdate={() => handleGoalUpdate('complete_roleplay')} />;
            case 'welcome':
                return <WelcomeView currentUser={currentUser} onComplete={() => navigateTo('dashboard')} />;
            case 'ipa-chart':
                return <IPAChartView onGoalUpdate={() => handleGoalUpdate('complete_pronunciation')} />;
            case 'challenges':
                 return <ChallengesView currentUser={currentUser} />;
            case 'ai-chat-tutor':
                return <AIChatTutorView currentUser={currentUser} />;
            case 'progress-dashboard':
                return <ProgressDashboardView currentUser={currentUser} allWords={allWords} />;
            case 'vstep-exam':
                return <VstepExamView />;
            default:
                return <DashboardView currentUser={currentUser} studyProgress={studyProgress} dailyProgress={dailyProgress} categories={wordCategories} allWords={allWords} navigateTo={navigateTo} isGeneratingPlan={isGeneratingPlan} />;
        }
    };

    return (
        <div className={`flex h-screen bg-slate-100 ${isSidebarOpen ? 'sidebar-open' : ''}`}>
             <div 
                className="fixed inset-0 bg-black/30 z-30 opacity-0 pointer-events-none transition-opacity lg:hidden sidebar-overlay"
                onClick={() => setIsSidebarOpen(false)}
             ></div>
            <Suspense fallback={<div></div>}>
                <Sidebar 
                    viewMode={viewMode} 
                    navigateTo={navigateTo}
                    currentUser={currentUser}
                    onLogoutClick={handleLogout}
                    onLevelChange={handleLevelChange}
                    isCollapsed={isSidebarCollapsed}
                    onToggle={toggleSidebar}
                />
            </Suspense>
            <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
                <Header 
                    viewMode={viewMode}
                    onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                />
                <main ref={mainContentRef} className="flex-1 overflow-y-auto">
                    <Suspense fallback={
                        <div className="flex items-center justify-center h-full">
                            <div className="w-14 h-14 border-4 border-slate-200 border-b-indigo-500 rounded-full animate-spin"></div>
                        </div>
                    }>
                        {renderView()}
                    </Suspense>
                </main>
            </div>
        </div>
    );
};

export default App;

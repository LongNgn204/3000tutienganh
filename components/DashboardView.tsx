import React, { useMemo, useState, useEffect } from 'react';
import type { User, StudyProgress, Category, ViewMode, CEFRLevel, DailyProgress, DailyGoal, Word, StudyPlanTask } from '../types';
import { LEARNING_IDIOMS } from '../constants';
import * as srsService from '../services/srsService';
import { CEFR_LEVEL_MAP } from '../cefr';
import StudyPlanTaskItem from './StudyPlanTask';

const PlacementTestPrompt: React.FC<{ onStart: () => void }> = ({ onStart }) => (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-2xl shadow-lifted flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
        <div className="text-center sm:text-left">
            <h3 className="text-xl font-bold">Cá nhân hóa lộ trình học của bạn!</h3>
            <p className="opacity-90 mt-1">Làm bài kiểm tra ngắn để AI xác định chính xác trình độ của bạn.</p>
        </div>
        <button
            onClick={onStart}
            className="px-5 py-2.5 bg-white text-indigo-600 font-bold rounded-lg hover:bg-indigo-50 transition-all flex-shrink-0 shadow-sm"
        >
            Làm bài kiểm tra
        </button>
    </div>
);

const CreateStudyPlanPrompt: React.FC<{ onStart: () => void }> = ({ onStart }) => (
    <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-6 rounded-2xl shadow-lifted flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
        <div className="text-center sm:text-left">
            <h3 className="text-xl font-bold">Xây dựng lộ trình học cho riêng bạn!</h3>
            <p className="opacity-90 mt-1">Trả lời vài câu hỏi để AI tạo kế hoạch học tập chi tiết trong 7 ngày.</p>
        </div>
        <button
            onClick={onStart}
            className="px-5 py-2.5 bg-white text-teal-600 font-bold rounded-lg hover:bg-teal-50 transition-all flex-shrink-0 shadow-sm"
        >
            Tạo lộ trình ngay
        </button>
    </div>
);

const SuggestedActivityCard: React.FC<{ 
    icon: React.ReactNode; 
    title: string; 
    description: string;
    onClick: () => void;
}> = ({ icon, title, description, onClick }) => (
    <div 
        onClick={onClick}
        className="bg-white p-5 rounded-2xl shadow-subtle border border-slate-200 flex items-center gap-4 cursor-pointer hover:shadow-lifted hover:-translate-y-1 transition-all"
    >
        <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-fuchsia-100 text-fuchsia-600">
            {icon}
        </div>
        <div>
            <h4 className="font-bold text-slate-800">{title}</h4>
            <p className="text-sm text-slate-500">{description}</p>
        </div>
    </div>
);


const IdiomCard: React.FC = () => {
    const [idiom, setIdiom] = useState(LEARNING_IDIOMS[0]);

    const getNewIdiom = () => {
        const randomIndex = Math.floor(Math.random() * LEARNING_IDIOMS.length);
        setIdiom(LEARNING_IDIOMS[randomIndex]);
    };

    useEffect(() => {
        getNewIdiom();
    }, []);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lifted border border-slate-200 flex flex-col">
            <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 14.95a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414-1.414l-.707-.707zM4 10a1 1 0 01-1-1V7a1 1 0 112 0v2a1 1 0 01-1 1zM10 18a1 1 0 01-1-1v-1a1 1 0 112 0v1a1 1 0 01-1 1zM10 6a4 4 0 100 8 4 4 0 000-8z" /></svg>
                 </div>
                <h3 className="text-lg font-bold text-slate-700">Thành Ngữ Hôm Nay</h3>
            </div>
            <div className="flex-grow mt-4">
                <p className="font-bold text-indigo-700 text-xl">"{idiom.idiom}"</p>
                <p className="text-slate-600 text-sm mt-2">{idiom.meaning}</p>
                <p className="text-xs text-slate-500 mt-2 italic bg-slate-100 p-2 rounded-md border">{idiom.example}</p>
            </div>
            <button onClick={getNewIdiom} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 mt-4 self-start">
                Thành ngữ khác
            </button>
        </div>
    );
}

interface DashboardViewProps {
  currentUser: User | null;
  studyProgress: StudyProgress;
  dailyProgress: DailyProgress | null;
  categories: Category[];
  allWords: Word[];
  navigateTo: (mode: ViewMode, options?: any) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ currentUser, studyProgress, dailyProgress, categories, allWords, navigateTo }) => {

    const [todaysTasks, setTodaysTasks] = useState<StudyPlanTask[]>([]);

    useEffect(() => {
        if (currentUser?.studyPlan) {
            const planForToday = currentUser.studyPlan.day1 || [];
            setTodaysTasks(planForToday);
        }
    }, [currentUser?.studyPlan]);

    const handleTaskComplete = (taskId: string) => {
        setTodaysTasks(prev => prev.map(task => 
            task.id === taskId ? { ...task, completed: true } : task
        ));
    };

    const stats = useMemo(() => {
        const { wordsToReview, newWords } = srsService.getWordsForSession(allWords, studyProgress);
        const learnedCount = allWords.length - newWords.length;
        const learnedPercentage = allWords.length > 0 ? Math.round((learnedCount / allWords.length) * 100) : 0;
        return { 
            reviewCount: wordsToReview.length, 
            newCount: newWords.length,
            learnedCount,
            learnedPercentage,
            totalCount: allWords.length
        };
    }, [studyProgress, allWords]);
    
    const suggestions = useMemo(() => {
        if (!currentUser?.studyPlanInput) return [];
        
        const allSuggestions = [
            { view: 'role-play', title: 'Tình huống nhập vai', description: 'Thực hành giao tiếp trong kịch bản thực tế.', skill: 'Nói & Giao tiếp', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.75.75 0 011.02.043 8.002 8.002 0 0111.985 0 .75.75 0 011.02-.043 9.502 9.502 0 00-14.025 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14.51 15.326a.75.75 0 011.02.043A8.003 8.003 0 0117 18.25a.75.75 0 11-1.44.438 6.503 6.503 0 00-11.12 0 .75.75 0 11-1.44-.438 8.003 8.003 0 012.92-2.88.75.75 0 011.02.043z" /></svg> },
            { view: 'story', title: 'Viết truyện cùng AI', description: 'Học từ vựng trong ngữ cảnh bằng cách tạo truyện.', skill: 'Đọc & Viết', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10.392C3.057 14.71 4.245 14 5.5 14c1.255 0 2.443.29 3.5.804V4.804zM14.5 4c-1.255 0-2.443.29-3.5.804v10.392c1.057.514 2.245.804 3.5.804c1.255 0 2.443-.29 3.5-.804V4.804C16.943 4.29 15.755 4 14.5 4z" /></svg> },
            { view: 'challenges', title: 'Thử thách hàng tuần', description: 'Hoàn thành nhiệm vụ để rèn luyện và nhận thưởng.', skill: 'Tổng hợp', icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 4a1 1 0 112 0v1a1 1 0 11-2 0V4z" clipRule="evenodd" /><path d="M10 8a1 1 0 011 1v4a1 1 0 11-2 0v-4a1 1 0 011-1z" /></svg> },
            { view: 'advanced-grammar', title: 'Ngữ pháp chuyên sâu', description: 'Nâng cao ngữ pháp qua các thử thách từ AI.', skill: 'Từ vựng & Ngữ pháp', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v.755a4.5 4.5 0 016.364 4.108l.353.353a.75.75 0 11-1.06 1.06l-.354-.353a4.5 4.5 0 01-8.107 0l-.353.353a.75.75 0 01-1.06-1.06l.353-.353A4.5 4.5 0 019.25 4.505V3.75A.75.75 0 0110 3zm-2.25 6a2.25 2.25 0 114.5 0 2.25 2.25 0 01-4.5 0z" clipRule="evenodd" /><path d="M12.25 18a.75.75 0 00-1.5 0v-2.19c-2.443-1.01-4.25-3.328-4.25-6.06V9a.75.75 0 011.5 0v.75a4.75 4.75 0 009.5 0V9a.75.75 0 011.5 0v.75c0 2.732-1.807 5.05-4.25 6.06V18z" /></svg> },
            { view: 'video-lessons', title: 'Bài giảng Video', description: 'Học các chủ đề qua bài giảng sinh động.', skill: 'Nghe & Phát âm', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M3.5 2.75a.75.75 0 00-1.5 0v14.5a.75.75 0 001.5 0v-4.392l1.657-.348a6.44 6.44 0 015.686 0l1.657.348V17.25a.75.75 0 001.5 0V2.75a.75.75 0 00-1.5 0v4.392l-1.657.348a6.44 6.44 0 01-5.686 0L3.5 7.142V2.75z" /></svg> }
        ];

        const todaysTaskViews = new Set(todaysTasks.map(t => {
            if (t.type === 'flashcard_new' || t.type === 'flashcard_review') return 'flashcard';
            if (t.type === 'role-play') return 'role-play';
            return t.type as ViewMode;
        }));

        const availableSuggestions = allSuggestions.filter(s => !todaysTaskViews.has(s.view as ViewMode));

        return availableSuggestions.slice(0, 2);
    }, [currentUser?.studyPlanInput, todaysTasks]);

    if (!currentUser) {
      return (
        <div className="flex-1 flex items-center justify-center text-center py-20 px-4 animate-fade-in-up">
          <div>
            <h2 className="text-3xl font-bold text-slate-700">Chào mừng đến với Học Tiếng Anh Cùng AI</h2>
            <p className="text-slate-500 mt-2 max-w-md mx-auto">Vui lòng đăng nhập để bắt đầu lộ trình học được cá nhân hóa dành riêng cho bạn.</p>
          </div>
        </div>
      );
    }

    const showPlacementTestPrompt = !currentUser.placementTestResult;
    const showStudyPlanPrompt = currentUser.placementTestResult && !currentUser.studyPlan;
    const hasStudyPlan = !!currentUser.studyPlan;

    return (
        <div className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
             <div className="relative bg-gradient-to-br from-indigo-600 to-blue-700 text-white p-8 rounded-2xl shadow-xl animate-fade-in-up mb-8 overflow-hidden">
                <div
                    aria-hidden="true"
                    className="absolute inset-0 -z-10"
                    style={{
                        backgroundImage: `
                            radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 20%),
                            radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.1) 0%, transparent 20%)
                        `,
                    }}
                />
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                    Chào mừng trở lại, {currentUser.name}!
                </h2>
                <p className="text-indigo-200 mt-2 text-lg">
                    Lộ trình học của bạn được thiết kế cho trình độ: <strong className="font-bold text-white">{CEFR_LEVEL_MAP[currentUser.level].name}</strong>
                </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {showPlacementTestPrompt && (
                        <PlacementTestPrompt onStart={() => navigateTo('placement-test')} />
                    )}
                    {showStudyPlanPrompt && (
                        <CreateStudyPlanPrompt onStart={() => navigateTo('study-plan-wizard')} />
                    )}
                    
                    {hasStudyPlan && (
                        <>
                            <div className="bg-white p-6 rounded-2xl shadow-lifted border border-slate-200">
                                <h3 className="text-xl font-bold text-slate-800 mb-4">Nhiệm vụ hôm nay</h3>
                                <div className="space-y-3">
                                    {todaysTasks.length > 0 && todaysTasks.some(t => !t.completed) ? (
                                        todaysTasks.map(task => (
                                            <StudyPlanTaskItem 
                                                key={task.id}
                                                task={task}
                                                onStartTask={navigateTo}
                                                onCompleteTask={handleTaskComplete}
                                            />
                                        ))
                                    ) : (
                                        <p className="text-slate-500 text-center py-4">Bạn đã hoàn thành hết nhiệm vụ hôm nay. Tuyệt vời!</p>
                                    )}
                                </div>
                            </div>
                             {suggestions.length > 0 && (
                                <div className="mt-8">
                                    <h3 className="text-xl font-bold text-slate-800 mb-4">Gợi ý cho bạn</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {suggestions.map(s => (
                                            <SuggestedActivityCard 
                                                key={s.view}
                                                icon={s.icon}
                                                title={s.title}
                                                description={s.description}
                                                onClick={() => navigateTo(s.view as ViewMode)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Right Sidebar */}
                <div className="space-y-8">
                    <div className="bg-white p-6 rounded-2xl shadow-lifted border border-slate-200">
                        <h3 className="text-xl font-bold text-slate-700 mb-4">Tiến trình của bạn</h3>
                         <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-base font-medium text-indigo-700">Đã học</span>
                                <span className="text-sm font-medium text-indigo-700">{stats.learnedCount} / {stats.totalCount} từ</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-3">
                                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full" style={{width: `${stats.learnedPercentage}%`}}></div>
                            </div>
                        </div>
                        <div className="mt-6 space-y-3">
                             <div className="flex justify-between items-center text-sm">
                                <span className="flex items-center gap-2 text-slate-600"><span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>Từ cần ôn tập hôm nay</span>
                                <span className="font-semibold">{stats.reviewCount}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="flex items-center gap-2 text-slate-600"><span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>Từ mới</span>
                                <span className="font-semibold">{stats.newCount}</span>
                            </div>
                        </div>
                    </div>
                    <IdiomCard />
                </div>
            </div>
        </div>
    );
};

export default DashboardView;
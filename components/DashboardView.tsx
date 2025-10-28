import React, { useMemo, useState, useEffect } from 'react';
import type { User, StudyProgress, Category, ViewMode, CEFRLevel, DailyProgress, DailyGoal, Word } from '../types';
import { LEARNING_IDIOMS } from '../constants';
import * as srsService from '../services/srsService';
import { CEFR_LEVEL_MAP } from '../cefr';

const PlacementTestPrompt: React.FC<{ onStart: () => void }> = ({ onStart }) => (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
        <div className="text-center sm:text-left">
            <h3 className="text-xl font-bold">Cá nhân hóa lộ trình học của bạn!</h3>
            <p className="opacity-90 mt-1">Làm bài kiểm tra ngắn để AI xác định chính xác trình độ của bạn.</p>
        </div>
        <button
            onClick={onStart}
            className="px-5 py-2.5 bg-white text-indigo-600 font-bold rounded-lg hover:bg-indigo-50 transition-all flex-shrink-0"
        >
            Làm bài kiểm tra
        </button>
    </div>
);


const SkillCard: React.FC<{
    title: string;
    description: string;
    icon: React.ReactNode;
    onClick: () => void;
    buttonText: string;
    gradient: string;
}> = ({ title, description, icon, onClick, buttonText, gradient }) => (
    <div className={`p-6 rounded-2xl flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-white ${gradient}`}>
        <div className="flex items-start gap-4">
             <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                {icon}
            </div>
            <div>
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="text-sm opacity-90 mt-1 h-10">{description}</p>
            </div>
        </div>
        <div className="mt-auto pt-4">
            <button
                onClick={onClick}
                className="w-full px-4 py-2 bg-white/20 backdrop-blur-sm font-semibold rounded-lg hover:bg-white/30 transition-colors"
            >
                {buttonText}
            </button>
        </div>
    </div>
);

const NextLessonCard: React.FC<{
    reviewCount: number;
    newCount: number;
    navigateTo: (mode: ViewMode, options?: { initialFilter: 'review' | 'new' }) => void;
}> = ({ reviewCount, newCount, navigateTo }) => {
    
    let title = "Bắt đầu học từ mới";
    let description = `Bạn có ${newCount} từ chưa học. Hãy bắt đầu chinh phục chúng!`;
    let buttonText = "Học từ mới";
    let onClickAction = () => navigateTo('flashcard', { initialFilter: 'new' });

    if (reviewCount > 0) {
        title = "Ôn tập hôm nay";
        description = `Bạn có ${reviewCount} từ cần ôn tập. Hãy ôn lại để không quên nhé!`;
        buttonText = `Ôn tập ${reviewCount} từ`;
        onClickAction = () => navigateTo('flashcard', { initialFilter: 'review' });
    } else if (newCount === 0) {
        title = "Làm bài trắc nghiệm";
        description = "Bạn đã học hết từ vựng! Hãy củng cố kiến thức bằng một bài trắc nghiệm nhé.";
        buttonText = "Làm trắc nghiệm";
        onClickAction = () => navigateTo('quiz');
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
            <h3 className="text-xl font-bold text-slate-800">{title}</h3>
            <p className="text-slate-500 mt-2">{description}</p>
            <button
                onClick={onClickAction}
                className="w-full mt-6 px-4 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-all transform hover:scale-105"
            >
                {buttonText}
            </button>
        </div>
    );
};

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
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 flex flex-col">
            <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 14.95a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414-1.414l-.707-.707zM4 10a1 1 0 01-1-1V7a1 1 0 112 0v2a1 1 0 01-1 1zM10 18a1 1 0 01-1-1v-1a1 1 0 112 0v1a1 1 0 01-1 1zM10 6a4 4 0 100 8 4 4 0 000-8z" /></svg>
                 </div>
                <h3 className="text-lg font-bold text-slate-700">Thành Ngữ Hôm Nay</h3>
            </div>
            <div className="flex-grow mt-4">
                <p className="font-bold text-indigo-700 text-xl">"{idiom.idiom}"</p>
                <p className="text-slate-600 text-sm mt-2">{idiom.meaning}</p>
                <p className="text-xs text-slate-500 mt-2 italic bg-slate-50 p-2 rounded-md">VD: {idiom.example}</p>
            </div>
            <button onClick={getNewIdiom} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 mt-4 self-start">
                Thành ngữ khác
            </button>
        </div>
    );
}

const DailyGoalsCard: React.FC<{ dailyProgress: DailyProgress | null }> = ({ dailyProgress }) => {
    if (!dailyProgress) return null;

    const allGoalsMet = dailyProgress.goals.every(g => g.current >= g.target);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
            <div className="flex justify-between items-start">
                 <h3 className="text-xl font-bold text-slate-700 mb-4">Mục tiêu hôm nay</h3>
                 <div className="flex items-center gap-2 text-orange-500 font-bold">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.934l-6.5 11.9a1 1 0 001.64 1.065l6.5-11.9a1 1 0 00-.385-1.45z" clipRule="evenodd" /><path fillRule="evenodd" d="M8.343 3.404a1 1 0 011.414 0l6.25 6.25a1 1 0 010 1.414l-6.25 6.25a1 1 0 01-1.414-1.414L13.586 11H3a1 1 0 110-2h10.586L8.343 4.818a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    <span>{dailyProgress.streak} ngày</span>
                 </div>
            </div>
            <div className="space-y-4">
                {dailyProgress.goals.map(goal => {
                    const progress = Math.min(100, (goal.current / goal.target) * 100);
                    const isCompleted = goal.current >= goal.target;
                    return (
                        <div key={goal.id}>
                             <div className="flex justify-between mb-1 text-sm">
                                <span className="font-medium text-slate-600">{goal.description}</span>
                                <span className={`font-semibold ${isCompleted ? 'text-green-600' : 'text-slate-500'}`}>{goal.current}/{goal.target}</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                                <div className={`h-2 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-indigo-600'}`} style={{width: `${progress}%`}}></div>
                            </div>
                        </div>
                    );
                })}
            </div>
            {allGoalsMet && <p className="text-center mt-6 font-semibold text-green-700">🎉 Hoàn thành tất cả mục tiêu! Giữ vững phong độ nhé!</p>}
        </div>
    );
};


interface DashboardViewProps {
  currentUser: User | null;
  studyProgress: StudyProgress;
  dailyProgress: DailyProgress | null;
  categories: Category[];
  allWords: Word[];
  navigateTo: (mode: ViewMode, options?: { initialFilter: 'review' | 'new' }) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ currentUser, studyProgress, dailyProgress, categories, allWords, navigateTo }) => {

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

    return (
        <div className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="lg:col-span-2 bg-gradient-to-br from-indigo-600 to-blue-700 text-white p-8 rounded-2xl shadow-xl animate-fade-in-up">
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                        Chào mừng trở lại, {currentUser.name}!
                    </h2>
                    <p className="text-indigo-200 mt-2 text-lg">
                        Lộ trình học của bạn được thiết kế cho trình độ: <strong className="font-bold text-white">{CEFR_LEVEL_MAP[currentUser.level].name}</strong>
                    </p>
                </div>
                <IdiomCard />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {showPlacementTestPrompt && (
                        <PlacementTestPrompt onStart={() => navigateTo('placement-test')} />
                    )}
                    <NextLessonCard 
                        reviewCount={stats.reviewCount}
                        newCount={stats.newCount}
                        navigateTo={navigateTo}
                    />
                     <div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-6">Tất cả kỹ năng</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <SkillCard 
                                title="Học từ vựng (SRS)"
                                description="Học từ mới và ôn tập theo phương pháp lặp lại ngắt quãng."
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10.392C3.057 14.71 4.245 14 5.5 14c1.255 0 2.443.29 3.5.804V4.804zM14.5 4c-1.255 0-2.443.29-3.5.804v10.392c1.057.514 2.245.804 3.5.804c1.255 0 2.443-.29 3.5-.804V4.804C16.943 4.29 15.755 4 14.5 4z" /></svg>}
                                onClick={() => navigateTo('flashcard')}
                                buttonText="Bắt đầu học"
                                gradient="bg-gradient-to-br from-indigo-500 to-purple-600"
                            />
                             <SkillCard 
                                title="Luyện Đọc"
                                description="Luyện đọc hiểu và học từ vựng trong ngữ cảnh thực tế."
                                icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 text-white"><path d="M9.25 3.321a.75.75 0 011.5 0v1.821a.75.75 0 01-1.5 0V3.321zM11.603 3.38a.75.75 0 00-1.06-1.06l-1.288 1.287a.75.75 0 001.06 1.06l1.288-1.287zM5.457 4.637a.75.75 0 10-1.06-1.06L3.109 4.865a.75.75 0 001.06 1.06l1.288-1.288zM2.5 9.25a.75.75 0 01.75-.75h1.821a.75.75 0 010 1.5H3.25a.75.75 0 01-.75-.75zM14.929 7.671a.75.75 0 00-1.06 1.06l1.287 1.288a.75.75 0 001.06-1.06l-1.287-1.288zM4.637 14.543a.75.75 0 10-1.06 1.06L4.865 16.89a.75.75 0 001.06-1.06l-1.288-1.287zM10 12.25a.75.75 0 01.75.75v1.821a.75.75 0 01-1.5 0v-1.821a.75.75 0 01.75-.75zM8.397 16.62a.75.75 0 00-1.06 1.06l1.288 1.287a.75.75 0 001.06-1.06L8.397 16.62zM12.5 10a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" /><path d="M17.5 9.25a.75.75 0 00-1.5 0v1.821a.75.75 0 001.5 0V9.25zM14.543 15.363a.75.75 0 10-1.06 1.06l1.288 1.288a.75.75 0 001.06-1.06l-1.288-1.288z" /></svg>}
                                onClick={() => navigateTo('reading')}
                                buttonText="Bắt đầu đọc"
                                gradient="bg-gradient-to-br from-sky-500 to-cyan-600"
                            />
                            <SkillCard 
                                title="AI Giao tiếp"
                                description="Thực hành giao tiếp trong các tình huống thực tế với AI."
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" /></svg>}
                                onClick={() => navigateTo('conversation')}
                                buttonText="Bắt đầu hội thoại"
                                gradient="bg-gradient-to-br from-cyan-500 to-blue-600"
                            />
                            <SkillCard 
                                title="AI Luyện Phát Âm"
                                description="Ghi âm và nhận phản hồi tức thì về cách phát âm từ AI."
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8h-1a6 6 0 11-12 0H3a7.001 7.001 0 006 6.93V17H7a1 1 0 100 2h6a1 1 0 100-2h-2v-2.07z" clipRule="evenodd" /></svg>}
                                onClick={() => navigateTo('pronunciation')}
                                buttonText="Luyện phát âm"
                                gradient="bg-gradient-to-br from-teal-500 to-green-600"
                            />
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-8">
                    <DailyGoalsCard dailyProgress={dailyProgress} />
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
                        <h3 className="text-xl font-bold text-slate-700 mb-4">Tiến trình của bạn</h3>
                         <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-base font-medium text-indigo-700">Đã học</span>
                                <span className="text-sm font-medium text-indigo-700">{stats.learnedCount} / {stats.totalCount} từ</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2.5">
                                <div className="bg-indigo-600 h-2.5 rounded-full" style={{width: `${stats.learnedPercentage}%`}}></div>
                            </div>
                        </div>
                        <div className="mt-6 space-y-3">
                             <div className="flex justify-between items-center text-sm">
                                <span className="flex items-center gap-2 text-slate-600"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>Từ cần ôn tập hôm nay</span>
                                <span className="font-semibold">{stats.reviewCount}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="flex items-center gap-2 text-slate-600"><span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>Từ mới</span>
                                <span className="font-semibold">{stats.newCount}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default DashboardView;
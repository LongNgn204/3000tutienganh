import React, { useMemo, useState, useEffect } from 'react';
import type { User, StudyProgress, Category, ViewMode, CEFRLevel } from '../types';
import { LEARNING_IDIOMS } from '../constants';

const CEFR_LEVEL_MAP: Record<CEFRLevel, { name: string, color: string }> = {
    'A1': { name: 'A1 - Mới bắt đầu', color: 'bg-green-100 text-green-800' },
    'A2': { name: 'A2 - Sơ cấp', color: 'bg-blue-100 text-blue-800' },
    'B1': { name: 'B1 - Trung cấp', color: 'bg-yellow-100 text-yellow-800' },
    'B2': { name: 'B2 - Trung cao cấp', color: 'bg-orange-100 text-orange-800' },
    'C1': { name: 'C1 - Cao cấp', color: 'bg-red-100 text-red-800' },
    'C2': { name: 'C2 - Thành thạo', color: 'bg-purple-100 text-purple-800' },
};

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
    unknownCount: number;
    navigateTo: (mode: ViewMode, options?: { initialFilter: 'review' | 'unknown' }) => void;
}> = ({ reviewCount, unknownCount, navigateTo }) => {
    
    let title = "Bắt đầu học từ mới";
    let description = `Bạn có ${unknownCount} từ chưa học. Hãy bắt đầu chinh phục chúng!`;
    let buttonText = "Bắt đầu học";
    let onClickAction = () => navigateTo('flashcard', { initialFilter: 'unknown' });

    if (reviewCount > 0) {
        title = "Ôn tập từ vựng";
        description = `Bạn có ${reviewCount} từ được đánh dấu cần xem lại. Hãy ôn tập ngay!`;
        buttonText = `Ôn tập ${reviewCount} từ`;
        onClickAction = () => navigateTo('flashcard', { initialFilter: 'review' });
    } else if (unknownCount === 0) {
        title = "Làm bài trắc nghiệm";
        description = "Bạn đã học hết từ vựng! Hãy củng cố kiến thức bằng một bài trắc nghiệm nhé.";
        buttonText = "Làm trắc nghiệm";
        onClickAction = () => navigateTo('quiz');
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
            <h3 className="text-xl font-bold text-slate-800">Bài học tiếp theo của bạn</h3>
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


interface DashboardViewProps {
  currentUser: User | null;
  studyProgress: StudyProgress;
  categories: Category[];
  navigateTo: (mode: ViewMode, options?: { initialFilter: 'review' | 'unknown' }) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ currentUser, studyProgress, categories, navigateTo }) => {

    const allWordsCount = useMemo(() => categories.flatMap(c => c.words).length, [categories]);

    const stats = useMemo(() => {
        const progressValues = Object.values(studyProgress);
        const knownCount = progressValues.filter(s => s === 'known').length;
        const reviewCount = progressValues.filter(s => s === 'review').length;
        const unknownCount = allWordsCount - knownCount - reviewCount;
        const learnedPercentage = allWordsCount > 0 ? Math.round(((knownCount + reviewCount) / allWordsCount) * 100) : 0;
        return { knownCount, reviewCount, unknownCount, learnedPercentage };
    }, [studyProgress, allWordsCount]);

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

    return (
        <div className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="lg:col-span-2 bg-gradient-to-br from-indigo-600 to-blue-700 text-white p-8 rounded-2xl shadow-xl animate-fade-in-up">
                    <h2 className="text-4xl font-extrabold tracking-tight">
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
                    <NextLessonCard 
                        reviewCount={stats.reviewCount}
                        unknownCount={stats.unknownCount}
                        navigateTo={navigateTo}
                    />
                     <div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-6">Tất cả kỹ năng</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <SkillCard 
                                title="Từ Vựng & Ngữ Pháp"
                                description="Học từ mới qua Flashcard và tra cứu cẩm nang ngữ pháp."
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10.392C3.057 14.71 4.245 14 5.5 14c1.255 0 2.443.29 3.5.804V4.804zM14.5 4c-1.255 0-2.443.29-3.5.804v10.392c1.057.514 2.245.804 3.5.804c1.255 0 2.443-.29 3.5-.804V4.804C16.943 4.29 15.755 4 14.5 4z" /></svg>}
                                onClick={() => navigateTo('flashcard')}
                                buttonText="Bắt đầu học"
                                gradient="bg-gradient-to-br from-indigo-500 to-purple-600"
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
                            <SkillCard 
                                title="AI Viết truyện"
                                description="Xây dựng câu chuyện ngắn từ các từ vựng đã chọn."
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>}
                                onClick={() => navigateTo('story')}
                                buttonText="Viết truyện ngắn"
                                gradient="bg-gradient-to-br from-rose-500 to-orange-600"
                            />
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-8">
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
                        <h3 className="text-xl font-bold text-slate-700 mb-4">Tiến trình của bạn</h3>
                         <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-base font-medium text-indigo-700">Tổng quan</span>
                                <span className="text-sm font-medium text-indigo-700">{stats.knownCount + stats.reviewCount} / {allWordsCount} từ</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2.5">
                                <div className="bg-indigo-600 h-2.5 rounded-full" style={{width: `${stats.learnedPercentage}%`}}></div>
                            </div>
                        </div>
                        <div className="mt-6 space-y-3">
                             <div className="flex justify-between items-center text-sm">
                                <span className="flex items-center gap-2 text-slate-600"><span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>Đã biết</span>
                                <span className="font-semibold">{stats.knownCount}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="flex items-center gap-2 text-slate-600"><span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>Cần ôn tập</span>
                                <span className="font-semibold">{stats.reviewCount}</span>
                            </div>
                             <div className="flex justify-between items-center text-sm">
                                <span className="flex items-center gap-2 text-slate-600"><span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>Chưa học</span>
                                <span className="font-semibold">{stats.unknownCount}</span>
                            </div>
                        </div>
                    </div>
                    {currentUser.placementTestResult && (
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
                            <h3 className="text-xl font-bold text-slate-700 mb-4">Kết quả đầu vào</h3>
                            <p className="text-slate-600">
                                Trình độ ban đầu của bạn được xác định là <strong className={`font-bold px-2 py-0.5 rounded-md ${CEFR_LEVEL_MAP[currentUser.level].color}`}>{currentUser.level}</strong>. 
                                Lộ trình học được cá nhân hóa dựa trên kết quả này.
                            </p>
                        </div>
                    )}
                </div>

            </div>

        </div>
    );
};

export default DashboardView;

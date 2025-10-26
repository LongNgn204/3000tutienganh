import React, { useMemo } from 'react';
import type { User, StudyProgress, Category, ViewMode, CEFRLevel, PlacementTestResult } from '../types';

const CEFR_LEVEL_MAP: Record<CEFRLevel, { name: string, color: string }> = {
    'A1': { name: 'A1 - Mới bắt đầu', color: 'bg-green-100 text-green-800' },
    'A2': { name: 'A2 - Sơ cấp', color: 'bg-blue-100 text-blue-800' },
    'B1': { name: 'B1 - Trung cấp', color: 'bg-yellow-100 text-yellow-800' },
    'B2': { name: 'B2 - Trung cao cấp', color: 'bg-orange-100 text-orange-800' },
    'C1': { name: 'C1 - Cao cấp', color: 'bg-red-100 text-red-800' },
    'C2': { name: 'C2 - Thành thạo', color: 'bg-purple-100 text-purple-800' },
};

interface SkillCardProps {
    title: string;
    description: string;
    icon: string;
    onClick: () => void;
    buttonText: string;
}

const SkillCard: React.FC<SkillCardProps> = ({ title, description, icon, onClick, buttonText }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-200">
        <div className="flex items-start gap-4">
            <div className="text-3xl">{icon}</div>
            <div>
                <h3 className="text-lg font-bold text-slate-800">{title}</h3>
                <p className="text-sm text-slate-500 mt-1 h-10">{description}</p>
            </div>
        </div>
        <div className="mt-auto pt-4">
            <button
                onClick={onClick}
                className="w-full px-4 py-2 bg-blue-100 text-blue-800 font-semibold rounded-lg hover:bg-blue-200 transition-colors"
            >
                {buttonText}
            </button>
        </div>
    </div>
);

const PlacementTestSummary: React.FC<{ result: PlacementTestResult }> = ({ result }) => {
    const { level, analysis } = result;
    const correctPercentage = analysis.totalQuestions > 0 
        ? Math.round((analysis.score / analysis.totalQuestions) * 100)
        : 0;

    return (
        <div className="bg-slate-100/70 p-6 rounded-xl border border-slate-200">
            <h3 className="text-xl font-bold text-slate-700 mb-4">Kết quả kiểm tra đầu vào</h3>
            <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0 text-center">
                     <p className="text-sm text-slate-500">Trình độ của bạn</p>
                     <p className={`text-2xl font-bold px-3 py-1 rounded-full mt-1 ${CEFR_LEVEL_MAP[level].color}`}>{level}</p>
                </div>
                <div className="w-full">
                    <p className="text-slate-600 font-semibold">Tổng quan</p>
                    <div className="flex items-center gap-4 mt-2">
                        <div className="w-full bg-slate-200 rounded-full h-2.5">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${correctPercentage}%` }}></div>
                        </div>
                        <span className="font-bold text-blue-600">{correctPercentage}%</span>
                    </div>
                     <p className="text-sm text-slate-500 mt-1">Bạn đã trả lời đúng {analysis.score}/{analysis.totalQuestions} câu hỏi.</p>
                </div>
            </div>
        </div>
    );
};


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
        const learnedPercentage = allWordsCount > 0 ? Math.round((knownCount / allWordsCount) * 100) : 0;
        return { knownCount, reviewCount, learnedPercentage };
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
        <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 mb-8 animate-fade-in-up">
                <h2 className="text-3xl font-bold text-slate-800">
                    Chào mừng trở lại, <span className="text-blue-600">{currentUser.name}!</span>
                </h2>
                <p className="text-slate-600 mt-2">
                    Lộ trình học của bạn được thiết kế cho trình độ: <span className={`font-semibold px-2 py-1 rounded-full ${CEFR_LEVEL_MAP[currentUser.level].color}`}>{CEFR_LEVEL_MAP[currentUser.level].name}</span>
                </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <h3 className="text-2xl font-bold text-slate-800 mb-6">Lộ trình học tập của bạn</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SkillCard 
                            title="Từ Vựng & Đọc Hiểu"
                            description={`Ôn tập từ vựng qua thẻ ghi nhớ thông minh.`}
                            icon="📖"
                            onClick={() => navigateTo('flashcard')}
                            buttonText="Ôn tập Flashcard"
                        />
                        <SkillCard 
                            title="Luyện Nói AI"
                            description="Thực hành giao tiếp trong các tình huống thực tế."
                            icon="💬"
                            onClick={() => navigateTo('conversation')}
                            buttonText="Bắt đầu hội thoại"
                        />
                         <SkillCard 
                            title="Luyện Viết AI"
                            description="Xây dựng câu chuyện từ các từ vựng đã chọn."
                            icon="✍️"
                            onClick={() => navigateTo('story')}
                            buttonText="Viết truyện ngắn"
                        />
                         <SkillCard 
                            title="Kiểm tra & Củng cố"
                            description="Làm các bài trắc nghiệm để củng cố kiến thức."
                            icon="🎯"
                            onClick={() => navigateTo('quiz')}
                            buttonText="Làm bài trắc nghiệm"
                        />
                    </div>
                </div>

                <div className="space-y-8">
                    {currentUser.placementTestResult && (
                        <PlacementTestSummary result={currentUser.placementTestResult} />
                    )}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
                        <h3 className="text-xl font-bold text-slate-700 mb-4">Tiến trình từ vựng</h3>
                         <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-base font-medium text-blue-700">Đã học</span>
                                <span className="text-sm font-medium text-blue-700">{stats.knownCount} / {allWordsCount} từ</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2.5">
                                <div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${stats.learnedPercentage}%`}}></div>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-between">
                            <button onClick={() => navigateTo('flashcard', { initialFilter: 'review' })} className="text-sm font-semibold text-yellow-600 hover:underline">
                                Cần ôn: {stats.reviewCount} từ
                            </button>
                            <button onClick={() => navigateTo('list')} className="text-sm font-semibold text-slate-600 hover:underline">
                                Xem tất cả
                            </button>
                        </div>
                    </div>
                     <div className="bg-slate-100 p-6 rounded-xl flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-300">
                        <h3 className="text-lg font-bold text-slate-600">Sắp ra mắt</h3>
                        <p className="text-sm text-slate-500 mt-1">Các module Luyện Nghe và Ngữ pháp chuyên sâu sẽ sớm được cập nhật!</p>
                        <div className="text-3xl mt-3">🎧📝</div>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default DashboardView;

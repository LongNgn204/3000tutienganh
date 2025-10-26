import React, { useMemo } from 'react';
import type { User, StudyProgress, Category, ViewMode } from '../types';

interface DashboardViewProps {
  currentUser: User | null;
  studyProgress: StudyProgress;
  categories: Category[];
  navigateTo: (mode: ViewMode, options?: { initialFilter: 'review' | 'unknown' }) => void;
}

const StatCard: React.FC<{ title: string; value: number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => {
    return (
        <div className={`bg-white p-6 rounded-xl shadow-lg border-l-4 ${color} flex items-center space-x-4`}>
            <div className="text-3xl">{icon}</div>
            <div>
                <p className="text-slate-500 text-sm font-medium">{title}</p>
                <p className="text-3xl font-bold text-slate-800">{value}</p>
            </div>
        </div>
    );
};

const ProgressCircle: React.FC<{ percentage: number }> = ({ percentage }) => {
    const circumference = 2 * Math.PI * 54; // 2 * pi * radius
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative w-48 h-48">
            <svg className="w-full h-full" viewBox="0 0 120 120">
                <circle
                    className="text-slate-200"
                    strokeWidth="12"
                    stroke="currentColor"
                    fill="transparent"
                    r="54"
                    cx="60"
                    cy="60"
                />
                <circle
                    className="text-blue-600"
                    strokeWidth="12"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="54"
                    cx="60"
                    cy="60"
                    style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
                    transform="rotate(-90 60 60)"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-blue-700">{Math.round(percentage)}%</span>
            </div>
        </div>
    );
};


const DashboardView: React.FC<DashboardViewProps> = ({ currentUser, studyProgress, categories, navigateTo }) => {

    const allWordsCount = useMemo(() => categories.flatMap(c => c.words).length, [categories]);

    const stats = useMemo(() => {
        const progressValues = Object.values(studyProgress);
        const knownCount = progressValues.filter(s => s === 'known').length;
        const reviewCount = progressValues.filter(s => s === 'review').length;
        const unknownCount = allWordsCount - knownCount - reviewCount;
        const overallPercentage = allWordsCount > 0 ? (knownCount / allWordsCount) * 100 : 0;
        return { knownCount, reviewCount, unknownCount, overallPercentage };
    }, [studyProgress, allWordsCount]);

    const masteryByCategory = useMemo(() => {
        return categories.map(category => {
            const total = category.words.length;
            if (total === 0) return { name: category.name, percentage: 0 };
            
            const known = category.words.filter(word => studyProgress[word.english] === 'known').length;
            return {
                id: category.id,
                name: category.name,
                percentage: (known / total) * 100,
            };
        });
    }, [categories, studyProgress]);
    
    if (!currentUser) {
      return (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-slate-700">Vui lòng đăng nhập</h2>
          <p className="text-slate-500 mt-2">Đăng nhập để xem tiến độ học tập của bạn.</p>
        </div>
      );
    }

    return (
        <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-6">
                Tổng quan tiến độ của <span className="text-blue-600">{currentUser.name}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Overall Progress */}
                <div className="lg:col-span-1 md:col-span-2 bg-white p-6 rounded-xl shadow-lg flex flex-col items-center justify-center text-center">
                    <h3 className="text-lg font-semibold text-slate-700 mb-4">Tiến độ tổng thể</h3>
                    <ProgressCircle percentage={stats.overallPercentage} />
                    <p className="text-slate-500 mt-4 text-sm">Bạn đã học được {stats.knownCount} trên {allWordsCount} từ.</p>
                </div>

                {/* Stat Cards */}
                <div className="lg:col-span-3 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <StatCard 
                        title="Tổng số từ đã học" 
                        value={stats.knownCount} 
                        color="border-green-500"
                        icon={<span className="text-green-500">🎓</span>} 
                    />
                    <StatCard 
                        title="Từ cần ôn tập" 
                        value={stats.reviewCount} 
                        color="border-yellow-500"
                        icon={<span className="text-yellow-500">📚</span>} 
                    />
                    <StatCard 
                        title="Từ chưa học" 
                        value={stats.unknownCount} 
                        color="border-slate-400"
                        icon={<span className="text-slate-400">📖</span>}
                    />
                    <div className="bg-blue-50 p-6 rounded-xl shadow-lg border-l-4 border-blue-500 flex flex-col justify-center">
                        <h4 className="text-slate-700 font-semibold mb-3">Bắt đầu ôn tập</h4>
                        <div className="space-y-2">
                             <button
                                onClick={() => navigateTo('flashcard', { initialFilter: 'review' })}
                                disabled={stats.reviewCount === 0}
                                className="w-full text-left text-sm font-semibold text-blue-800 bg-blue-200/50 hover:bg-blue-200/80 px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                             >
                                Ôn tập {stats.reviewCount} từ cần xem lại
                            </button>
                             <button
                                onClick={() => navigateTo('flashcard', { initialFilter: 'unknown' })}
                                disabled={stats.unknownCount === 0}
                                className="w-full text-left text-sm font-semibold text-slate-800 bg-slate-200/50 hover:bg-slate-200/80 px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                             >
                                Học từ mới
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mastery by Category */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Mức độ thành thạo theo chủ đề</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                    {masteryByCategory.map(category => (
                        <div key={category.id}>
                            <div className="flex justify-between items-center mb-1">
                                <p className="text-sm font-medium text-slate-700">{category.name}</p>
                                <p className="text-sm font-semibold text-blue-600">{Math.round(category.percentage)}%</p>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2.5">
                                <div 
                                    className="bg-blue-600 h-2.5 rounded-full" 
                                    style={{ width: `${category.percentage}%`, transition: 'width 0.5s ease-in-out' }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardView;

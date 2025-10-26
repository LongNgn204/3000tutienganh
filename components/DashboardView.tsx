import React, { useMemo } from 'react';
import type { User, StudyProgress, Category, ViewMode, CEFRLevel } from '../types';

const CEFR_LEVEL_MAP: Record<CEFRLevel, string> = {
    'A1': 'A1 - Mới bắt đầu',
    'A2': 'A2 - Sơ cấp',
    'B1': 'B1 - Trung cấp',
    'B2': 'B2 - Trung cao cấp',
    'C1': 'C1 - Cao cấp',
    'C2': 'C2 - Thành thạo',
};

interface SkillCardProps {
    title: string;
    description: string;
    icon: string;
    onClick: () => void;
    buttonText: string;
}

const SkillCard: React.FC<SkillCardProps> = ({ title, description, icon, onClick, buttonText }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col hover:shadow-xl transition-shadow duration-300 border border-slate-200">
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
        return { knownCount, reviewCount };
    }, [studyProgress]);

    if (!currentUser) {
      return (
        <div className="flex-1 flex items-center justify-center text-center py-20 px-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-700">Chào mừng đến với Học Tiếng Anh Cùng AI</h2>
            <p className="text-slate-500 mt-2 max-w-md mx-auto">Vui lòng đăng nhập để bắt đầu lộ trình học được cá nhân hóa dành riêng cho bạn.</p>
          </div>
        </div>
      );
    }

    return (
        <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 mb-8">
                <h2 className="text-3xl font-bold text-slate-800">
                    Chào mừng trở lại, <span className="text-blue-600">{currentUser.name}!</span>
                </h2>
                <p className="text-slate-600 mt-2">
                    Trình độ hiện tại của bạn: <span className="font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{CEFR_LEVEL_MAP[currentUser.level]}</span>
                </p>
            </div>
            
            <h3 className="text-2xl font-bold text-slate-800 mb-6">Lộ trình học tập của bạn</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <SkillCard 
                    title="Từ Vựng & Đọc Hiểu"
                    description={`Đã học ${stats.knownCount}/${allWordsCount} từ. ${stats.reviewCount} từ cần ôn tập.`}
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
                <SkillCard 
                    title="Tra cứu & Khám phá"
                    description="Khám phá toàn bộ danh sách từ và giải thích của AI."
                    icon="🧠"
                    onClick={() => navigateTo('list')}
                    buttonText="Xem danh sách từ"
                />
                <div className="bg-slate-100 p-6 rounded-xl flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-300">
                    <h3 className="text-lg font-bold text-slate-600">Sắp ra mắt</h3>
                    <p className="text-sm text-slate-500 mt-1">Các module Luyện Nghe và Ngữ pháp chuyên sâu sẽ sớm được cập nhật!</p>
                    <div className="text-3xl mt-3">🎧📝</div>
                </div>
            </div>

        </div>
    );
};

export default DashboardView;

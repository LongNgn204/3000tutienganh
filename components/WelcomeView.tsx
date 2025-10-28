import React from 'react';
import type { User, CEFRLevel } from '../types';

interface WelcomeViewProps {
  currentUser: User | null;
  onComplete: () => void;
}

const CEFR_LEVEL_MAP: Record<CEFRLevel, { name: string, color: string }> = {
    'A1': { name: 'A1 - Mới bắt đầu', color: 'text-green-600' },
    'A2': { name: 'A2 - Sơ cấp', color: 'text-blue-600' },
    'B1': { name: 'B1 - Trung cấp', color: 'text-yellow-600' },
    'B2': { name: 'B2 - Trung cao cấp', color: 'text-orange-600' },
    'C1': { name: 'C1 - Cao cấp', color: 'text-red-600' },
    'C2': { name: 'C2 - Thành thạo', color: 'text-purple-600' },
};

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, description: string }> = ({ icon, title, description }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
            {icon}
        </div>
        <h3 className="text-lg font-bold text-slate-800 mt-4">{title}</h3>
        <p className="text-slate-500 mt-2 text-sm flex-grow">{description}</p>
    </div>
);

const updates = [
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        title: "Mở rộng kho từ vựng",
        description: "Hàng trăm từ vựng mới đã được bổ sung vào tất cả các cấp độ, giúp bạn học sâu hơn và đa dạng hơn."
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
        title: "Giao diện được tinh chỉnh",
        description: "Trải nghiệm mượt mà hơn trên mọi thiết bị, từ điện thoại di động đến máy tính để bàn."
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 5.732z" /></svg>,
        title: "Thêm từ vựng của riêng bạn",
        description: "Tính năng mới cho phép bạn tự thêm, lưu trữ và ôn tập những từ vựng bạn gặp trong cuộc sống hàng ngày."
    }
];


const WelcomeView: React.FC<WelcomeViewProps> = ({ currentUser, onComplete }) => {
  if (!currentUser) return null;

  const userLevelInfo = CEFR_LEVEL_MAP[currentUser.level] || { name: currentUser.level, color: 'text-slate-600' };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 w-full animate-fade-in-up">
        <div className="w-full max-w-5xl text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight">
                Chào mừng, <span className="text-indigo-600">{currentUser.name}</span>!
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-slate-600">
                AI đã xác định lộ trình học phù hợp cho bạn ở trình độ <strong className={`font-bold ${userLevelInfo.color}`}>{userLevelInfo.name}</strong>.
            </p>
            <p className="mt-8 text-2xl font-bold text-slate-700">Đây là những gì đang chờ đợi bạn:</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                <FeatureCard 
                    title="Học & Ôn tập"
                    description="Xây dựng vốn từ vựng vững chắc với flashcards SRS, luyện đọc hiểu và cải thiện kỹ năng viết cùng AI."
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
                />
                 <FeatureCard 
                    title="Giao tiếp & Nhập vai"
                    description="Tự tin giao tiếp qua các cuộc hội thoại và tình huống nhập vai thực tế với AI."
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>}
                />
                 <FeatureCard 
                    title="Nghe & Phát âm"
                    description="Cải thiện kỹ năng nghe và nhận phản hồi tức thì về phát âm để nói chuẩn như người bản xứ."
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>}
                />
                 <FeatureCard 
                    title="Ngữ pháp & Thử thách"
                    description="Nắm vững các chủ điểm ngữ pháp từ cơ bản đến nâng cao và thử thách bản thân với AI."
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
            </div>
            
             <div className="mt-12 w-full max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold text-slate-700 text-center mb-6">Có gì mới trong phiên bản này?</h2>
                <div className="space-y-4 text-left">
                    {updates.map((update, index) => (
                        <div key={index} className="bg-white p-4 rounded-xl shadow-md border border-slate-200 flex items-center gap-4 hover:border-indigo-300 transition-colors">
                            <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                                {update.icon}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">{update.title}</h3>
                                <p className="text-sm text-slate-500">{update.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <button
                onClick={onComplete}
                className="mt-12 px-10 py-4 bg-indigo-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-indigo-700 transition-all transform hover:scale-105"
            >
                Bắt đầu hành trình
            </button>
        </div>
    </div>
  );
};

export default WelcomeView;
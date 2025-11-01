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

const FeatureCard: React.FC<{ title: string, description: string, imageUrl: string }> = ({ title, description, imageUrl }) => (
    <div 
        className="relative text-white p-6 rounded-2xl shadow-lifted overflow-hidden flex flex-col justify-end h-64 bg-cover bg-center transition-transform duration-300 hover:scale-105 group"
        style={{ backgroundImage: `url(${imageUrl})` }}
    >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent transition-all duration-300 group-hover:from-black/80"></div>
        <div className="relative z-10">
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="text-sm mt-1 opacity-90">{description}</p>
        </div>
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
    <div className="flex-1 flex flex-col items-center justify-start py-12 px-4 sm:px-6 lg:px-8 w-full animate-fade-in-up">
        <div className="w-full max-w-6xl">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 bg-white p-8 md:p-12 rounded-2xl shadow-lifted border border-slate-200">
                <div className="text-center lg:text-left flex-1">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight">
                        Chào mừng, <span className="text-indigo-600">{currentUser.name}</span>!
                    </h1>
                    <p className="mt-4 text-lg sm:text-xl text-slate-600">
                        Lộ trình học của bạn đã được cá nhân hóa cho trình độ <strong className={`font-bold ${userLevelInfo.color}`}>{userLevelInfo.name}</strong>.
                    </p>
                    <p className="mt-4 text-slate-500 max-w-xl">
                        Hãy sẵn sàng khám phá các tính năng học tập thông minh, từ flashcard SRS đến các tình huống nhập vai thực tế, tất cả đều được thiết kế để giúp bạn tiến bộ nhanh nhất.
                    </p>
                </div>
                <div className="flex-shrink-0">
                    <img 
                        src="https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=800&auto=format&fit=crop" 
                        alt="Học sinh học tập cùng nhau" 
                        className="w-full max-w-sm h-auto rounded-2xl shadow-lg"
                    />
                </div>
            </div>

            <div className="mt-16">
                 <h2 className="text-3xl font-bold text-slate-800 text-center mb-8">Hành trình của bạn bắt đầu từ đây</h2>
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <FeatureCard 
                        title="Học & Ôn tập"
                        description="Xây dựng vốn từ vựng vững chắc với flashcards SRS, luyện đọc và viết cùng AI."
                        imageUrl="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=800&auto=format&fit=crop"
                    />
                    <FeatureCard 
                        title="Giao tiếp & Nhập vai"
                        description="Tự tin giao tiếp qua các cuộc hội thoại và tình huống nhập vai thực tế với AI."
                        imageUrl="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop"
                    />
                    <FeatureCard 
                        title="Nghe & Phát âm"
                        description="Cải thiện kỹ năng nghe và nhận phản hồi tức thì về phát âm để nói chuẩn hơn."
                        imageUrl="https://images.unsplash.com/photo-1593121925328-9a908a38c29b?q=80&w=800&auto=format&fit=crop"
                    />
                    <FeatureCard 
                        title="Ngữ pháp & Thử thách"
                        description="Nắm vững các chủ điểm ngữ pháp và thử thách bản thân với các bài tập từ AI."
                        imageUrl="https://images.unsplash.com/photo-1456324504439-367cee3b3c32?q=80&w=800&auto=format&fit=crop"
                    />
                </div>
            </div>
            
             <div className="mt-16 w-full max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold text-slate-700 text-center mb-6">Có gì mới trong phiên bản này?</h2>
                <div className="space-y-4 text-left">
                    {updates.map((update, index) => (
                        <div key={index} className="bg-white p-4 rounded-xl shadow-subtle border border-slate-200 flex items-center gap-4 hover:border-indigo-300 transition-colors">
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

            <div className="text-center">
                <button
                    onClick={onComplete}
                    className="mt-12 px-10 py-4 bg-indigo-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-indigo-700 transition-all transform hover:scale-105"
                >
                    Bắt đầu hành trình
                </button>
            </div>
        </div>
    </div>
  );
};

export default WelcomeView;
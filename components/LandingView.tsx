import React from 'react';

interface LandingViewProps {
  onStart: () => void;
}

const Feature: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="text-center p-4">
    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 mx-auto mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-800">{title}</h3>
    <p className="mt-2 text-slate-500">{description}</p>
  </div>
);

const LandingView: React.FC<LandingViewProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-white text-slate-800 animate-fade-in">
      <header className="absolute top-0 left-0 right-0 p-6 z-10">
        <h1 className="text-2xl font-extrabold tracking-tight">
            Học Tiếng Anh <span className="text-indigo-600">Cùng AI</span>
        </h1>
      </header>
      
      <main>
        {/* Hero Section */}
        <section className="relative flex items-center justify-center h-screen bg-slate-50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-blue-50"></div>
          <div className="relative z-10 text-center px-4">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter text-slate-900">
              Chinh phục Tiếng Anh với Lộ trình Cá nhân hóa
            </h2>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-600">
              Nền tảng duy nhất bạn cần để thành thạo cả 4 kỹ năng Nghe - Nói - Đọc - Viết với sự trợ giúp của Trí tuệ nhân tạo.
            </p>
            <button
              onClick={onStart}
              className="mt-10 px-10 py-4 bg-indigo-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-indigo-700 transition-all transform hover:scale-105"
            >
              Bắt đầu học ngay
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">Học tập toàn diện, tiến bộ vượt bậc</h2>
              <p className="mt-4 text-lg text-slate-500">Mọi công cụ bạn cần đều ở đây.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Feature
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12v6a2 2 0 002 2h10a2 2 0 002-2v-6" /></svg>}
                title="Flashcard Thông Minh"
                description="Học từ vựng hiệu quả với phương pháp lặp lại ngắt quãng (SRS) đã được khoa học chứng minh."
              />
              <Feature
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>}
                title="Luyện Giao Tiếp AI"
                description="Tự tin trò chuyện và nhập vai trong các tình huống thực tế với đối tác AI luôn sẵn sàng 24/7."
              />
              <Feature
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 5.732z" /></svg>}
                title="Chữa Bài Viết AI"
                description="Nhận phản hồi chi tiết về ngữ pháp, từ vựng và cấu trúc để hoàn thiện kỹ năng viết của bạn."
              />
              <Feature
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
                title="Lộ Trình CEFR"
                description="Học theo lộ trình chuẩn Châu Âu, được AI cá nhân hóa dựa trên bài kiểm tra đầu vào của bạn."
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingView;

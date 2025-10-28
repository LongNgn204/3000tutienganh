import React from 'react';

interface LandingViewProps {
  onStart: () => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="bg-white p-6 rounded-xl shadow-lifted border border-slate-200 text-center transform transition-transform duration-300 hover:-translate-y-2">
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 mx-auto mb-5">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-800">{title}</h3>
        <p className="mt-2 text-slate-500">{description}</p>
    </div>
);

const StepCard: React.FC<{ number: string; title: string; description: string }> = ({ number, title, description }) => (
    <div className="relative pl-16">
        <div className="absolute left-0 top-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-600 text-white font-bold text-xl shadow-md">
            {number}
        </div>
        <h3 className="text-xl font-bold text-slate-800">{title}</h3>
        <p className="mt-2 text-slate-500">{description}</p>
    </div>
);

const LandingView: React.FC<LandingViewProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 animate-fade-in">
        <header className="bg-white/80 backdrop-blur-lg fixed top-0 left-0 right-0 p-4 z-20 border-b border-slate-200">
            <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
                <h1 className="text-2xl font-extrabold tracking-tight cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
                    Học Tiếng Anh <span className="text-indigo-600">Cùng AI</span>
                </h1>
                <button onClick={onStart} className="px-5 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm transform hover:scale-105">
                    Đăng nhập
                </button>
            </div>
        </header>
      
        <main>
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-28 text-center bg-white overflow-hidden">
                <div className="absolute -top-20 -left-20 w-72 h-72 bg-indigo-100 rounded-full opacity-50"></div>
                <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-blue-100 rounded-full opacity-50"></div>
                <div className="relative max-w-4xl mx-auto px-4">
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
                        Bắt đầu học miễn phí
                    </button>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section id="features" className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">Tại sao chọn chúng tôi?</h2>
                        <p className="mt-4 text-lg text-slate-500">Học tập thông minh hơn, không chỉ chăm chỉ hơn.</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                       <FeatureCard
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" /></svg>}
                            title="Lộ trình học Cá nhân hóa"
                            description="AI phân tích trình độ và tạo kế hoạch học tập hàng ngày dành riêng cho bạn."
                        />
                        <FeatureCard
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" /></svg>}
                            title="Luyện tập 4 kỹ năng"
                            description="Cải thiện toàn diện Nghe, Nói, Đọc, Viết qua các bài tập tương tác đa dạng."
                        />
                        <FeatureCard
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>}
                            title="Phản hồi Tức thì từ AI"
                            description="Nhận xét chi tiết về phát âm, ngữ pháp và bài viết của bạn ngay lập tức."
                        />
                        <FeatureCard
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor"><path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" /><path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" /></svg>}
                            title="Học từ vựng Thông minh"
                            description="Ghi nhớ từ vựng lâu hơn với phương pháp lặp lại ngắt quãng (SRS) đã được khoa học chứng minh."
                        />
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-24 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">Bắt đầu trong 3 bước đơn giản</h2>
                    </div>
                    <div className="space-y-16">
                       <StepCard
                           number="1"
                           title="Làm bài test đầu vào"
                           description="Hoàn thành bài kiểm tra nhanh để AI xác định chính xác trình độ CEFR của bạn. Điều này giúp chúng tôi xây dựng nền tảng vững chắc cho lộ trình học của bạn."
                       />
                       <StepCard
                           number="2"
                           title="Nhận lộ trình học cá nhân"
                           description="Dựa trên kết quả và mục tiêu của bạn, AI sẽ tự động tạo ra một kế hoạch học tập chi tiết theo từng ngày, tập trung vào những kỹ năng bạn cần cải thiện nhất."
                       />
                       <StepCard
                           number="3"
                           title="Học và Luyện tập hàng ngày"
                           description="Hoàn thành các nhiệm vụ được giao, từ học từ vựng, luyện nghe, đến thực hành giao tiếp trong các tình huống thực tế với AI."
                       />
                    </div>
                </div>
            </section>
            
            {/* Privacy & Offline Section */}
            <section id="privacy" className="py-24 bg-slate-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="flex justify-center mb-6">
                        <div className="flex items-center justify-center h-20 w-20 rounded-full bg-indigo-100 text-indigo-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.417l4.5-4.5a.5.5 0 01.707 0l3.793 3.793a.5.5 0 01.707 0l4.5-4.5a12.02 12.02 0 00-2.382-8.984z" />
                            </svg>
                        </div>
                    </div>
                    <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">An Toàn, Riêng Tư và Linh Hoạt</h2>
                    <p className="mt-4 text-lg text-slate-500 max-w-3xl mx-auto">
                        Chúng tôi tôn trọng quyền riêng tư của bạn. Toàn bộ tiến trình học tập được lưu trữ an toàn ngay trên thiết bị của bạn. Điều này cho phép bạn học mọi lúc, mọi nơi, ngay cả khi không có kết nối internet.
                    </p>
                </div>
            </section>

            {/* Future Updates Section */}
            <section id="future-updates" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">Các tính năng Sắp ra mắt</h2>
                        <p className="mt-4 text-lg text-slate-500">Chúng tôi không ngừng cải tiến để mang lại trải nghiệm học tập tốt nhất.</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                       <FeatureCard
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.75.75 0 011.02.043 8.002 8.002 0 0111.985 0 .75.75 0 011.02-.043 9.502 9.502 0 00-14.025 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14.51 15.326a.75.75 0 011.02.043A8.003 8.003 0 0117 18.25a.75.75 0 11-1.44.438 6.503 6.503 0 00-11.12 0 .75.75 0 11-1.44-.438 8.003 8.003 0 012.92-2.88.75.75 0 011.02.043z" /></svg>}
                            title="Diễn đàn Cộng đồng"
                            description="Kết nối, hỏi đáp và chia sẻ kinh nghiệm học tập với hàng ngàn người học khác."
                        />
                        <FeatureCard
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor"><path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" /><path d="M15 7v2a2 2 0 01-2 2H9.88a1 1 0 01-.7-.29l-1.42-1.42A2 2 0 005.12 9H5a2 2 0 01-2-2V5a2 2 0 012-2h7a2 2 0 012 2v2z" /></svg>}
                            title="Luyện nói Nhóm"
                            description="Tham gia các phòng luyện nói theo chủ đề, thực hành giao tiếp với các bạn học cùng trình độ."
                        />
                        <FeatureCard
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.868 2.884c.321-.772 1.415-.772 1.736 0l1.681 4.06c.064.155.19.288.348.348l4.06 1.681c.772.321.772 1.415 0 1.736l-4.06 1.681a.5.5 0 00-.348.348l-1.681 4.06c-.321.772-1.415-.772-1.736 0l-1.681-4.06a.5.5 0 00-.348-.348l-4.06-1.681c-.772-.321-.772-1.415 0-1.736l4.06-1.681a.5.5 0 00.348-.348l1.681-4.06zM2.08 13.75a.5.5 0 01.696-.696l1.303 1.303a.5.5 0 01-.696.696l-1.303-1.303zM15 4a.5.5 0 01.696-.696l1.303 1.303a.5.5 0 01-.696.696l-1.303-1.303z" clipRule="evenodd" /></svg>}
                            title="Nội dung Cá nhân hóa"
                            description="AI sẽ tự động đề xuất các bài báo, video và bài nghe phù hợp với sở thích cá nhân của bạn."
                        />
                        <FeatureCard
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor"><path d="M17.926 5.385a.999.999 0 00-.773-.832l-5.32-1.121a.999.999 0 00-.666 0L5.845 4.553a1 1 0 00-.773.832L4.08 11.23a1 1 0 00.258.854l3.58 3.58a1 1 0 00.707.293h2.75a1 1 0 00.707-.293l3.58-3.58a1 1 0 00.258-.854l.993-5.845zM9 13H7V9h2v4zm4 0h-2V9h2v4z" /><path d="M5 18a1 1 0 001 1h8a1 1 0 001-1v-1H5v1z" /></svg>}
                            title="Gamification & Phần thưởng"
                            description="Thu thập huy hiệu, hoàn thành chuỗi học tập và leo hạng để việc học trở nên thú vị hơn."
                        />
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-24 bg-indigo-700 text-white">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-4xl font-extrabold tracking-tight">Sẵn sàng để bắt đầu?</h2>
                    <p className="mt-4 text-lg text-indigo-200">
                        Tạo tài khoản và nhận lộ trình học cá nhân hóa của bạn ngay hôm nay.
                    </p>
                    <button
                        onClick={onStart}
                        className="mt-10 px-10 py-4 bg-white text-indigo-700 font-bold text-lg rounded-lg shadow-lg hover:bg-indigo-50 transition-all transform hover:scale-105"
                    >
                        Tham gia ngay
                    </button>
                </div>
            </section>
        </main>
        
        <footer className="bg-slate-100 text-slate-500 py-8">
            <div className="max-w-7xl mx-auto px-4 text-center text-sm">
                <p>&copy; {new Date().getFullYear()} Học Tiếng Anh Cùng AI. Phát triển bởi Long Nguyễn.</p>
            </div>
        </footer>
    </div>
  );
};

export default LandingView;
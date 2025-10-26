import React, { useState } from 'react';
import type { PlacementTestResult, CEFRLevel } from '../types';

const CEFR_LEVEL_MAP: Record<CEFRLevel, { name: string, color: string, description: string }> = {
    'A1': { name: 'A1 - Mới bắt đầu', color: 'bg-green-100 text-green-800', description: 'Có thể hiểu và sử dụng các mẫu câu quen thuộc, cơ bản.' },
    'A2': { name: 'A2 - Sơ cấp', color: 'bg-blue-100 text-blue-800', description: 'Có thể giao tiếp trong các tình huống đơn giản, quen thuộc.' },
    'B1': { name: 'B1 - Trung cấp', color: 'bg-yellow-100 text-yellow-800', description: 'Có thể xử lý hầu hết các tình huống khi đi du lịch, thảo luận về các chủ đề quen thuộc.' },
    'B2': { name: 'B2 - Trung cao cấp', color: 'bg-orange-100 text-orange-800', description: 'Có thể tương tác một cách trôi chảy, tự nhiên và hiểu các văn bản phức tạp.' },
    'C1': { name: 'C1 - Cao cấp', color: 'bg-red-100 text-red-800', description: 'Có thể sử dụng ngôn ngữ linh hoạt cho các mục đích xã hội, học thuật và chuyên môn.' },
    'C2': { name: 'C2 - Thành thạo', color: 'bg-purple-100 text-purple-800', description: 'Có thể hiểu dễ dàng gần như mọi thứ nghe hoặc đọc được.' },
};

const PerformanceBar: React.FC<{ level: string, percentage: number, color: string }> = ({ level, percentage, color }) => (
    <div className="flex items-center gap-4">
        <span className="w-12 font-semibold text-slate-600">{level}</span>
        <div className="w-full bg-slate-200 rounded-full h-4">
            <div className={`h-4 rounded-full ${color.split(' ')[0]}`} style={{ width: `${percentage}%` }}></div>
        </div>
        <span className="w-12 font-bold text-slate-700 text-right">{percentage}%</span>
    </div>
);

interface PlacementTestResultViewProps {
  result: PlacementTestResult;
  onComplete: () => void;
}

const PlacementTestResultView: React.FC<PlacementTestResultViewProps> = ({ result, onComplete }) => {
    const { level, analysis } = result;
    const [showIncorrect, setShowIncorrect] = useState(false);

    return (
        <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 text-center">
                <h1 className="text-3xl font-bold text-slate-800">Kết quả của bạn</h1>
                <p className="text-slate-600 mt-2">AI đã phân tích bài làm và xác định trình độ tiếng Anh hiện tại của bạn.</p>

                <div className={`mt-8 inline-block px-8 py-4 rounded-xl border-4 ${CEFR_LEVEL_MAP[level].color.replace('bg-', 'border-').replace('-100', '-200')}`}>
                    <p className="text-lg font-semibold">Trình độ của bạn là</p>
                    <p className={`text-5xl font-extrabold ${CEFR_LEVEL_MAP[level].color.split(' ')[1]}`}>{level}</p>
                    <p className="mt-2 font-medium">{CEFR_LEVEL_MAP[level].name}</p>
                </div>
                <p className="mt-4 max-w-2xl mx-auto text-slate-600">{CEFR_LEVEL_MAP[level].description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Phân tích theo cấp độ</h2>
                    <div className="space-y-4">
                        {(['A1', 'A2', 'B1', 'B2', 'C1'] as CEFRLevel[]).map(lvl => {
                           const performance = analysis.performanceByLevel[lvl];
                           if (!performance || performance.total === 0) return null;
                           return (
                             <PerformanceBar 
                                key={lvl} 
                                level={lvl} 
                                percentage={performance.percentage}
                                color={CEFR_LEVEL_MAP[lvl].color}
                             />
                           );
                        })}
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Tổng kết</h2>
                    <div className="space-y-3 text-lg">
                        <div className="flex justify-between">
                            <span className="text-slate-600">Tổng số câu hỏi:</span>
                            <span className="font-bold text-slate-800">{analysis.totalQuestions}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-600">Số câu đúng:</span>
                            <span className="font-bold text-green-600">{analysis.score}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-600">Số câu sai:</span>
                            <span className="font-bold text-red-600">{analysis.incorrectQuestions.length}</span>
                        </div>
                    </div>
                     {analysis.incorrectQuestions.length > 0 && (
                        <button onClick={() => setShowIncorrect(!showIncorrect)} className="text-blue-600 font-semibold mt-4 hover:underline">
                           {showIncorrect ? 'Ẩn câu sai' : 'Xem lại các câu sai'}
                        </button>
                    )}
                </div>
            </div>

            {showIncorrect && analysis.incorrectQuestions.length > 0 && (
                <div className="bg-white mt-8 p-6 rounded-xl shadow-lg border border-slate-200 animate-fade-in">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Xem lại câu trả lời sai</h2>
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                        {analysis.incorrectQuestions.map((item, index) => (
                            <div key={index} className="p-4 bg-slate-50 rounded-lg border">
                                <p className="font-semibold text-slate-700"><span className="font-bold text-blue-600">Câu hỏi (Cấp độ {item.level}):</span> {item.questionText}</p>
                                <p className="mt-2 text-red-600"><span className="font-semibold">Bạn chọn:</span> {item.userAnswer}</p>
                                <p className="mt-1 text-green-600"><span className="font-semibold">Đáp án đúng:</span> {item.correctAnswer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            <div className="mt-10 text-center">
                <button
                    onClick={onComplete}
                    className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg shadow-md transition-all transform hover:scale-105"
                >
                    Bắt đầu lộ trình học
                </button>
            </div>
        </div>
    );
};

export default PlacementTestResultView;
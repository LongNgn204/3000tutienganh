import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import type { CEFRLevel } from '../types';

interface PlacementTestViewProps {
  onTestComplete: (level: CEFRLevel) => void;
}

const questions = [
  // A1 Level
  { id: 'q1', text: 'She ___ a doctor.', options: ['is', 'are', 'am'], correctAnswer: 'is', level: 'A1' },
  { id: 'q2', text: '___ are you from?', options: ['What', 'Where', 'Who'], correctAnswer: 'Where', level: 'A1' },
  // A2 Level
  { id: 'q3', text: 'I saw ___ good film last night.', options: ['a', 'an', 'the'], correctAnswer: 'a', level: 'A2' },
  { id: 'q4', text: 'He ___ to work by bus yesterday.', options: ['go', 'goes', 'went'], correctAnswer: 'went', level: 'A2' },
  // B1 Level
  { id: 'q5', text: "I haven't seen him ___ last year.", options: ['since', 'for', 'in'], correctAnswer: 'since', level: 'B1' },
  { id: 'q6', text: 'If you ___ harder, you would pass the exam.', options: ['study', 'studied', 'have studied'], correctAnswer: 'studied', level: 'B1' },
  { id: 'q7', text: 'This book is not as interesting ___ the last one.', options: ['as', 'than', 'so'], correctAnswer: 'as', level: 'B1' },
  // B2 Level
  { id: 'q8', text: 'By the time the police arrived, the thief ___.', options: ['has escaped', 'had escaped', 'escaped'], correctAnswer: 'had escaped', level: 'B2' },
  { id: 'q9', text: 'I wish I ___ that. It was a mistake.', options: ["didn't say", "hadn't said", "wouldn't say"], correctAnswer: "hadn't said", level: 'B2' },
  { id: 'q10', text: 'The report ___ be finished by tomorrow.', options: ['must', 'can', 'should'], correctAnswer: 'must', level: 'B2' },
  // C1 Level
  { id: 'q11', text: '___ the bad weather, the match went ahead.', options: ['Despite', 'Although', 'However'], correctAnswer: 'Despite', level: 'C1' },
  { id: 'q12', text: 'The proliferation of digital media has fundamentally altered how we consume information. While it offers unprecedented access to knowledge, it also presents challenges related to information overload and the spread of misinformation. What is a major challenge mentioned?', options: ['Limited access to knowledge', 'The spread of false information', 'The high cost of digital media'], correctAnswer: 'The spread of false information', level: 'C1' },
  { id: 'q13', text: 'Not only ___ the exam, but he also got the highest score.', options: ['he passed', 'did he pass', 'he did pass'], correctAnswer: 'did he pass', level: 'C1' },
];

const PlacementTestView: React.FC<PlacementTestViewProps> = ({ onTestComplete }) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isApiKeySelected, setIsApiKeySelected] = useState(false);

  useEffect(() => {
    window.aistudio?.hasSelectedApiKey().then(setIsApiKeySelected);
  }, []);

  const handleSelectKey = async () => {
    await window.aistudio.openSelectKey();
    setIsApiKeySelected(true);
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };
  
  const isAllAnswered = Object.keys(answers).length === questions.length;

  const handleSubmit = async () => {
    if (!isAllAnswered) {
        alert("Vui lòng trả lời tất cả các câu hỏi.");
        return;
    }
    setIsLoading(true);
    setError(null);

    const submissionText = questions.map(q => 
      `Question: "${q.text}"\nCorrect Answer: "${q.correctAnswer}"\nUser's Answer: "${answers[q.id]}"`
    ).join('\n\n');

    const prompt = `As an expert English language assessor, please evaluate the following answers to a placement test and determine the user's CEFR level (A1, A2, B1, B2, C1, or C2). The questions are ordered by increasing difficulty. Consider the overall pattern of correct and incorrect answers.

Here are the user's answers:
${submissionText}

Based on these answers, the user's CEFR level is:
Return ONLY the level designation (e.g., "B1"), and nothing else.`;

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        
        const level = response.text.trim().toUpperCase() as CEFRLevel;
        const validLevels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
        
        if (validLevels.includes(level)) {
            onTestComplete(level);
        } else {
            console.error("Invalid level from AI:", level);
            setError("Không thể xác định trình độ. Vui lòng thử lại.");
            onTestComplete('A2'); // Fallback to a default level
        }

    } catch (err) {
        console.error("Gemini API Error:", err);
        const errorMessage = (err as any).message || '';
        if (errorMessage.includes('API key expired') || errorMessage.includes('API_KEY_INVALID')) {
            setError("API key của bạn không hợp lệ. Vui lòng chọn một key mới để nộp bài.");
            setIsApiKeySelected(false);
        } else {
            setError("AI đánh giá đã gặp lỗi. Vui lòng thử lại sau.");
        }
        setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full">
                 <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <h2 className="text-2xl font-bold text-slate-800">AI đang đánh giá bài làm...</h2>
                <p className="text-slate-500 mt-2">Vui lòng chờ trong giây lát.</p>
            </div>
        </div>
    );
  }

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
            <h1 className="text-3xl font-bold text-slate-800 text-center">Bài Kiểm Tra Trình Độ</h1>
            <p className="text-slate-600 text-center mt-2 mb-8">Hãy chọn đáp án đúng nhất cho các câu hỏi dưới đây để AI xác định trình độ của bạn.</p>
            
            {error && <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">{error}</div>}

            <div className="space-y-8">
                {questions.map((q, index) => (
                    <div key={q.id} className="border-t pt-6">
                        <p className="font-semibold text-lg text-slate-700">
                            <span className="text-blue-600 font-bold mr-2">Câu {index + 1}:</span> 
                            {q.text}
                        </p>
                        <div className="mt-4 space-y-3">
                            {q.options.map(option => (
                                <label key={option} className="flex items-center p-3 rounded-lg border border-slate-200 has-[:checked]:bg-blue-50 has-[:checked]:border-blue-400 cursor-pointer transition-colors">
                                    <input 
                                        type="radio"
                                        name={q.id}
                                        value={option}
                                        checked={answers[q.id] === option}
                                        onChange={() => handleAnswerChange(q.id, option)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                                    />
                                    <span className="ml-3 text-slate-800">{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-10 text-center">
                 {isApiKeySelected ? (
                    <button
                        onClick={handleSubmit}
                        disabled={!isAllAnswered || isLoading}
                        className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg shadow-md transition-all transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:scale-100"
                    >
                        Nộp bài và Xem kết quả
                    </button>
                 ) : (
                    <div className="max-w-md mx-auto">
                        <p className="text-sm text-slate-600 mb-4">Vui lòng chọn API Key để AI có thể chấm bài.</p>
                        <button
                            onClick={handleSelectKey}
                            className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-md transition-all transform hover:scale-105"
                        >
                            Chọn API Key
                        </button>
                        <p className="text-xs text-slate-500 mt-2">Tính năng này yêu cầu API key của riêng bạn. <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline">Tìm hiểu thêm về thanh toán</a>.</p>
                    </div>
                 )}
            </div>
        </div>
    </div>
  );
};

export default PlacementTestView;

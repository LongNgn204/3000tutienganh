import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import type { User } from '../types';

interface AIWritingViewProps {
  currentUser: User | null;
  onGoalUpdate: () => void;
}

interface WritingTopic {
    topic: string;
    level: string;
}

interface Feedback {
    overall: string;
    corrections: { original: string; corrected: string; explanation: string; }[];
    suggestions: string[];
}

const parseMarkdown = (text: string) => {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/`([^`]+)`/g, '<code class="bg-slate-200 text-slate-800 px-1 py-0.5 rounded">$1</code>')
        .replace(/\n/g, '<br />');
};

const AIWritingView: React.FC<AIWritingViewProps> = ({ currentUser, onGoalUpdate }) => {
    const [status, setStatus] = useState<'idle' | 'fetching' | 'ready' | 'checking' | 'feedback'>('idle');
    const [topic, setTopic] = useState<WritingTopic | null>(null);
    const [userText, setUserText] = useState('');
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [error, setError] = useState<string | null>(null);

    const getNewTopic = async () => {
        setStatus('fetching');
        setError(null);
        setTopic(null);
        setUserText('');
        setFeedback(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const userLevel = currentUser?.level || 'B1';
            const prompt = `Generate a simple and engaging writing prompt for a ${userLevel}-level English learner from Vietnam. The topic should be about daily life, hobbies, or personal experiences.
Return a single, valid JSON object with two keys:
1. "topic": A string containing the writing prompt in English (e.g., "Describe your favorite holiday and what you like to do on that day.").
2. "level": The CEFR level the prompt is suitable for (e.g., "${userLevel}").`;

            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            const jsonText = response.text.replace(/```json|```/g, '').trim();
            const parsedTopic = JSON.parse(jsonText);
            setTopic(parsedTopic);
            setStatus('ready');

        } catch (err) {
            console.error("Gemini Topic Generation Error:", err);
            setError("Rất tiếc, không thể tạo chủ đề mới lúc này. Vui lòng thử lại.");
            setStatus('idle');
        }
    };

    useEffect(() => {
        getNewTopic();
    }, []);

    const handleSubmit = async () => {
        if (!userText.trim() || !topic) return;
        setStatus('checking');
        setError(null);
        setFeedback(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `As an English teacher evaluating a piece of writing from a Vietnamese learner, please provide feedback on the following text.
- Writing Prompt: "${topic.topic}"
- User's Text: "${userText}"

Provide your feedback in a single, valid JSON object with three keys, all with content in Vietnamese:
1. "overall": A string with a general, encouraging comment on the user's writing.
2. "corrections": An array of objects. Each object should have three keys: "original" (the incorrect phrase from the user's text), "corrected" (the corrected version), and "explanation" (a brief explanation of the grammar/spelling error). If there are no errors, return an empty array [].
3. "suggestions": An array of strings with suggestions for improvement, such as using better vocabulary or more complex sentence structures.

Example response:
{
  "overall": "Viết tốt lắm! Bạn đã diễn đạt được ý tưởng của mình một cách rõ ràng.",
  "corrections": [
    {
      "original": "I am go to school",
      "corrected": "I go to school",
      "explanation": "Sau 'am' chúng ta dùng V-ing (I am going) cho thì hiện tại tiếp diễn, hoặc dùng động từ thường (go) cho thì hiện tại đơn."
    }
  ],
  "suggestions": [
    "Thay vì dùng 'very good', bạn có thể thử dùng 'excellent' hoặc 'fantastic'.",
    "Thử kết hợp hai câu đơn thành một câu phức để bài viết mượt mà hơn."
  ]
}`;

            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            const jsonText = response.text.replace(/```json|```/g, '').trim();
            const parsedFeedback = JSON.parse(jsonText);
            setFeedback(parsedFeedback);
            setStatus('feedback');
            onGoalUpdate();

        } catch (err) {
            console.error("Gemini Feedback Error:", err);
            setError("AI không thể phân tích bài viết lúc này. Vui lòng thử lại.");
            setStatus('ready');
        }
    };

    const renderMainContent = () => {
        if (status === 'idle' || status === 'fetching') {
            return (
                 <div className="flex items-center justify-center h-48">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-slate-200 border-b-indigo-500 rounded-full animate-spin"></div>
                        <p className="text-slate-500 font-semibold">AI đang chuẩn bị chủ đề...</p>
                    </div>
                </div>
            );
        }

        if (error) {
            return <p className="text-red-500 bg-red-50 p-4 rounded-md text-center">{error}</p>;
        }

        if (topic) {
            return (
                <div className="animate-fade-in">
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <p className="font-semibold text-slate-700">Chủ đề (Trình độ {topic.level}):</p>
                        <p className="text-lg text-indigo-800 mt-2">"{topic.topic}"</p>
                    </div>
                    <textarea
                        value={userText}
                        onChange={(e) => setUserText(e.target.value)}
                        placeholder="Viết bài của bạn ở đây..."
                        className="w-full mt-4 p-3 border-2 border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
                        rows={8}
                        disabled={status === 'checking' || status === 'feedback'}
                    />
                    <button
                        onClick={handleSubmit}
                        disabled={!userText.trim() || status === 'checking' || status === 'feedback'}
                        className="mt-4 w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition-all transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-not-allowed"
                    >
                        {status === 'checking' ? 'AI đang chấm bài...' : 'Kiểm tra bài viết'}
                    </button>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-start p-4 sm:p-6 lg:p-8 w-full animate-fade-in">
            <div className="w-full max-w-3xl text-center mb-6">
                <h2 className="text-3xl font-bold text-slate-800">Luyện Viết Cùng AI</h2>
                <p className="text-lg text-slate-600 mt-2">Hoàn thiện kỹ năng viết của bạn với sự trợ giúp từ AI.</p>
            </div>
            
            <div className="w-full max-w-3xl space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 min-h-[400px]">
                    {renderMainContent()}
                </div>

                {status === 'feedback' && feedback && (
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 animate-fade-in">
                        <h3 className="text-2xl font-bold text-slate-800 mb-4">Nhận xét từ AI</h3>
                        <div className="space-y-6">
                            <div>
                                <h4 className="font-semibold text-lg text-indigo-700 mb-2">Nhận xét chung</h4>
                                <p className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">{feedback.overall}</p>
                            </div>

                            {feedback.corrections && feedback.corrections.length > 0 && (
                                <div>
                                    <h4 className="font-semibold text-lg text-orange-700 mb-2">Sửa lỗi</h4>
                                    <div className="space-y-3">
                                        {feedback.corrections.map((item, index) => (
                                            <div key={index} className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                                                <p className="text-slate-500 line-through">"{item.original}"</p>
                                                <p className="font-semibold text-green-700">→ "{item.corrected}"</p>
                                                <p className="text-sm text-slate-600 mt-2" dangerouslySetInnerHTML={{ __html: parseMarkdown(item.explanation) }}></p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                             {feedback.suggestions && feedback.suggestions.length > 0 && (
                                <div>
                                    <h4 className="font-semibold text-lg text-blue-700 mb-2">Gợi ý nâng cao</h4>
                                    <ul className="list-disc list-inside space-y-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                        {feedback.suggestions.map((item, index) => (
                                            <li key={index} className="text-slate-700">{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                
                <div className="text-center pt-4">
                    <button 
                        onClick={getNewTopic}
                        disabled={status === 'fetching' || status === 'checking'}
                        className="px-6 py-2 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors disabled:bg-slate-400"
                    >
                        Thử chủ đề khác
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AIWritingView;

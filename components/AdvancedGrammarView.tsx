import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import type { User } from '../types';

interface AdvancedGrammarViewProps {
  currentUser: User | null;
}

interface Challenge {
    question: string;
    task: string;
}

interface Feedback {
    isCorrect: boolean;
    correctAnswer: string;
    explanation: string;
}

// Simple parser for AI response
const parseMarkdown = (text: string) => {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/`([^`]+)`/g, '<code class="bg-slate-200 text-slate-800 px-1 py-0.5 rounded">$1</code>')
        .replace(/\n/g, '<br />');
};

const AdvancedGrammarView: React.FC<AdvancedGrammarViewProps> = ({ currentUser }) => {
    const [status, setStatus] = useState<'idle' | 'fetching' | 'ready' | 'checking' | 'feedback'>('idle');
    const [challenge, setChallenge] = useState<Challenge | null>(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [error, setError] = useState<string | null>(null);

    const getNewChallenge = async () => {
        setStatus('fetching');
        setError(null);
        setChallenge(null);
        setUserAnswer('');
        setFeedback(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const userLevel = currentUser?.level || 'B1';
            const prompt = `Create an advanced grammar challenge for a ${userLevel}-level English learner. The challenge could be error correction, sentence transformation (e.g., active to passive), or using a specific grammar structure.
Return a single, valid JSON object with two keys:
1. "question": A string describing the task for the user (e.g., "Find and correct the mistake in the sentence below." or "Rewrite the following sentence using the passive voice.").
2. "task": The sentence for the user to work with.

Example response: {"question": "Rewrite this sentence using the past perfect tense.", "task": "When she arrived, the movie started."}`;

            const response = await ai.models.generateContent({
                model: 'gemini-1.5-flash',
                contents: prompt,
            });
            
            const jsonText = response.text.replace(/```json|```/g, '').trim();
            const parsedChallenge = JSON.parse(jsonText);
            setChallenge(parsedChallenge);
            setStatus('ready');

        } catch (err) {
            console.error("Gemini Challenge Generation Error:", err);
            setError("Rất tiếc, không thể tạo thử thách mới lúc này. Vui lòng thử lại.");
            setStatus('idle');
        }
    };

    useEffect(() => {
        getNewChallenge();
    }, []);

    const handleSubmit = async () => {
        if (!userAnswer.trim() || !challenge) return;
        setStatus('checking');
        setError(null);
        setFeedback(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const userLevel = currentUser?.level || 'B1';
            const prompt = `As an expert English grammar teacher for a ${userLevel}-level Vietnamese learner, please evaluate the user's answer to a grammar challenge.
- The challenge was: "${challenge.question}"
- The original sentence/task was: "${challenge.task}"
- The user's answer is: "${userAnswer}"

Please provide your evaluation in a single, valid JSON object with three keys:
1. "isCorrect": A boolean (true if the user's answer is grammatically correct and fulfills the task, otherwise false).
2. "correctAnswer": A string containing the most appropriate correct answer.
3. "explanation": A string containing a clear, concise explanation in Vietnamese about the grammar rule, explaining why the user's answer is right or wrong and why the correct answer is correct.`;

            const response = await ai.models.generateContent({
                model: 'gemini-1.5-flash',
                contents: prompt,
            });

            const jsonText = response.text.replace(/```json|```/g, '').trim();
            const parsedFeedback = JSON.parse(jsonText);
            setFeedback(parsedFeedback);
            setStatus('feedback');

        } catch (err) {
            console.error("Gemini Feedback Error:", err);
            setError("AI không thể phân tích câu trả lời lúc này. Vui lòng thử lại.");
            setStatus('ready');
        }
    };

    const renderMainContent = () => {
        if (status === 'idle' || status === 'fetching') {
            return (
                 <div className="flex items-center justify-center h-48">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-slate-200 border-b-indigo-500 rounded-full animate-spin"></div>
                        <p className="text-slate-500 font-semibold">AI đang chuẩn bị thử thách...</p>
                    </div>
                </div>
            );
        }

        if (error) {
            return <p className="text-red-500 bg-red-50 p-4 rounded-md text-center">{error}</p>;
        }

        if (challenge) {
            return (
                <div>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <p className="font-semibold text-slate-700">{challenge.question}</p>
                        <p className="text-lg text-indigo-800 mt-2 italic">"{challenge.task}"</p>
                    </div>
                    <textarea
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="Nhập câu trả lời của bạn ở đây..."
                        className="w-full mt-4 p-3 border-2 border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
                        rows={3}
                        disabled={status === 'checking' || status === 'feedback'}
                    />
                    <button
                        onClick={handleSubmit}
                        disabled={!userAnswer.trim() || status === 'checking' || status === 'feedback'}
                        className="mt-4 w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition-all transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-not-allowed"
                    >
                        {status === 'checking' ? 'Đang kiểm tra...' : 'Nộp bài'}
                    </button>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-start p-4 sm:p-6 lg:p-8 w-full animate-fade-in">
            <div className="w-full max-w-3xl text-center mb-6">
                <h2 className="text-3xl font-bold text-slate-800">Ngữ pháp Chuyên sâu</h2>
                <p className="text-lg text-slate-600 mt-2">Nâng cao kỹ năng ngữ pháp của bạn qua các thử thách từ AI.</p>
            </div>
            
            <div className="w-full max-w-3xl space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 min-h-[300px]">
                    {renderMainContent()}
                </div>

                {status === 'feedback' && feedback && (
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 animate-fade-in">
                        <div className={`p-4 rounded-lg mb-4 text-center font-bold text-lg ${feedback.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {feedback.isCorrect ? 'Chính xác! 🎉' : 'Chưa đúng lắm!'}
                        </div>
                        <div>
                            <p className="font-semibold text-slate-700">Đáp án đúng:</p>
                            <p className="text-lg text-green-700 p-2 bg-green-50 rounded mt-1">"{feedback.correctAnswer}"</p>
                        </div>
                        <div className="mt-4">
                            <p className="font-semibold text-slate-700">Giải thích từ AI:</p>
                            <div 
                                className="text-slate-600 mt-1 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: parseMarkdown(feedback.explanation) }}
                            />
                        </div>
                    </div>
                )}
                
                <div className="text-center pt-4">
                    <button 
                        onClick={getNewChallenge}
                        disabled={status === 'fetching' || status === 'checking'}
                        className="px-6 py-2 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors disabled:bg-slate-400"
                    >
                        Thử thách khác
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdvancedGrammarView;

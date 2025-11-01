import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import SpeakerButton from './SpeakerButton';
import type { User } from '../types';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface ListeningViewProps {
  currentUser: User | null;
  onGoalUpdate: () => void;
}

const ListeningView: React.FC<ListeningViewProps> = ({ currentUser, onGoalUpdate }) => {
    const [status, setStatus] = useState<'idle' | 'fetching' | 'ready' | 'listening' | 'analyzing' | 'feedback'>('idle');
    const [sentence, setSentence] = useState('');
    const [userTranscript, setUserTranscript] = useState('');
    const [feedback, setFeedback] = useState<{ score: number, comment: string } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const recognitionRef = useRef<any>(null);

    const getNewSentence = async () => {
        setStatus('fetching');
        setError(null);
        setSentence('');
        setUserTranscript('');
        setFeedback(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const userLevel = currentUser?.level || 'A2';
            const prompt = `Create one simple but complete English sentence for a ${userLevel}-level Vietnamese learner to practice listening and speaking. The sentence should be common and practical. Do not add any quotation marks or extra text. Just return the sentence itself.`;

            const response = await ai.models.generateContent({
                model: 'gemini-1.5-flash',
                contents: prompt,
            });

            setSentence(response.text.trim());
            setStatus('ready');
        } catch (err) {
            console.error("Gemini Sentence Generation Error:", err);
            setError("Rất tiếc, không thể tạo câu mới lúc này. Vui lòng thử lại.");
            setStatus('idle');
        }
    };

    const analyzePronunciation = async (transcript: string) => {
        setStatus('analyzing');
        setError(null);
        setFeedback(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `As an English pronunciation coach, evaluate a user's pronunciation of a sentence.
- The original sentence was: "${sentence}"
- The user pronounced it as: "${transcript}"

Please provide your evaluation in a valid JSON object format with two keys:
1.  "score": An integer from 0 to 100 representing the accuracy and clarity of the pronunciation.
2.  "comment": A short, constructive feedback in Vietnamese, encouraging the user and pointing out one main area for improvement if needed.

Example response: {"score": 85, "comment": "Làm tốt lắm! Âm cuối của từ 'like' bạn phát âm rất rõ. Lần tới hãy thử nhấn mạnh hơn vào từ 'really' nhé."}`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-1.5-flash',
                contents: prompt,
            });
            
            const jsonText = response.text.replace(/```json|```/g, '').trim();
            const parsedFeedback = JSON.parse(jsonText);
            setFeedback(parsedFeedback);
            setStatus('feedback');
            onGoalUpdate(); // Mark goal as completed after feedback

        } catch (err) {
            console.error("Gemini Feedback Error:", err);
            setError("AI không thể phân tích phát âm lúc này. Vui lòng thử lại.");
            setStatus('ready'); // Revert to ready state
        }
    };

    useEffect(() => {
        getNewSentence();

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setError('Trình duyệt của bạn không hỗ trợ nhận dạng giọng nói. Vui lòng thử trên Chrome.');
            return;
        }
        
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-US';
        recognition.interimResults = false;

        recognition.onstart = () => setStatus('listening');
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setUserTranscript(transcript);
            analyzePronunciation(transcript);
        };
        recognition.onerror = (event: any) => {
            console.error('SpeechRecognition error:', event.error);
            setError('Đã xảy ra lỗi khi ghi âm. Vui lòng đảm bảo bạn đã cấp quyền micro.');
            setStatus('ready');
        };
        recognition.onend = () => {
            if (status === 'listening') setStatus('ready');
        };

        recognitionRef.current = recognition;
    }, []);

    const handleMicClick = () => {
        if (status === 'listening') {
            recognitionRef.current?.stop();
        } else if (status === 'ready' || status === 'feedback') {
            setUserTranscript('');
            setFeedback(null);
            recognitionRef.current?.start();
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-500';
        if (score >= 50) return 'text-yellow-500';
        return 'text-red-500';
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-start p-4 sm:p-6 lg:p-8 w-full animate-fade-in">
            <div className="w-full max-w-3xl text-center mb-6">
                <h2 className="text-3xl font-bold text-slate-800">Luyện Nghe và Nói Cùng AI</h2>
                <p className="text-lg text-slate-600 mt-2">Nghe câu mẫu, lặp lại và nhận phản hồi tức thì từ AI.</p>
            </div>
            
            <div className="w-full max-w-3xl space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-700 mb-3 text-center">Câu của AI</h3>
                    {status === 'fetching' ? (
                        <div className="h-12 flex items-center justify-center text-slate-500">Đang tạo câu mới...</div>
                    ) : (
                        <div className="flex items-center justify-center gap-4">
                            <p className="text-2xl font-bold text-center text-indigo-700 flex-grow">"{sentence}"</p>
                            <SpeakerButton textToSpeak={sentence} ariaLabel="Nghe câu mẫu"/>
                        </div>
                    )}
                </div>

                <div className="flex flex-col items-center justify-center gap-4">
                    <button 
                        onClick={handleMicClick}
                        disabled={status !== 'ready' && status !== 'feedback' && status !== 'listening'}
                        className={`w-24 h-24 rounded-full flex items-center justify-center shadow-xl transition-all
                            ${status === 'listening' ? 'bg-red-500 hover:bg-red-600 animate-pulse scale-110' : 'bg-blue-600 hover:bg-blue-700'}
                            disabled:bg-slate-400 disabled:cursor-not-allowed
                        `}
                        aria-label={status === 'listening' ? 'Dừng ghi âm' : 'Bắt đầu ghi âm'}
                    >
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8h-1a6 6 0 11-12 0H3a7.001 7.001 0 006 6.93V17H7a1 1 0 100 2h6a1 1 0 100-2h-2v-2.07z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <p className="font-semibold text-slate-600 h-6">
                       {status === 'listening' && 'Đang lắng nghe...'}
                       {status === 'analyzing' && 'AI đang phân tích...'}
                       {(status === 'ready' || status === 'feedback' || status === 'idle') && 'Nhấn để nói'}
                    </p>
                </div>

                {error && <p className="text-red-500 bg-red-50 p-3 rounded-md text-center">{error}</p>}
                
                {(userTranscript || feedback) && (
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 animate-fade-in">
                        <h3 className="text-lg font-semibold text-slate-700 mb-2">Kết quả của bạn</h3>
                        <p className="text-xl text-slate-800 italic p-3 bg-slate-50 rounded-md">"{userTranscript}"</p>
                        
                        {status === 'analyzing' && <div className="mt-4 text-slate-500">Đang phân tích...</div>}
                        {feedback && (
                            <div className="mt-4 pt-4 border-t">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-md font-semibold text-slate-700">Đánh giá từ AI:</h4>
                                    <p className={`text-3xl font-bold ${getScoreColor(feedback.score)}`}>{feedback.score}<span className="text-lg">/100</span></p>
                                </div>
                                <p className="text-md text-slate-600 mt-2 p-3 bg-blue-50 rounded-md border border-blue-200">{feedback.comment}</p>
                            </div>
                        )}
                    </div>
                )}
                
                <div className="text-center pt-4">
                    <button 
                        onClick={getNewSentence}
                        disabled={status === 'fetching' || status === 'analyzing'}
                        className="px-6 py-2 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors disabled:bg-slate-400"
                    >
                        Thử câu khác
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ListeningView;
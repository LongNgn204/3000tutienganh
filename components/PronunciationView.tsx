import React, { useState, useEffect, useMemo, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import type { Word, StudyProgress } from '../types';
import SpeakerButton from './SpeakerButton';
import * as srsService from '../services/srsService';

// Add SpeechRecognition to the window interface for browsers that support it
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

interface PronunciationViewProps {
  words: Word[];
  studyProgress: StudyProgress;
  onGoalUpdate: () => void;
}

interface Feedback {
    score: number;
    comment: string;
    specifics: { phoneme: string; feedback: string; }[];
}

const PronunciationView: React.FC<PronunciationViewProps> = ({ words, studyProgress, onGoalUpdate }) => {
    const [targetWord, setTargetWord] = useState<Word | null>(null);
    const [status, setStatus] = useState<'idle' | 'listening' | 'analyzing' | 'feedback'>('idle');
    const [transcript, setTranscript] = useState('');
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    const recognitionRef = useRef<any>(null);

    const getNewWord = () => {
        const reviewWords = srsService.getWordsToReview(words, studyProgress);
        const unknownWords = srsService.getNewWords(words, studyProgress);
        
        let pool = [];
        if (reviewWords.length > 0) pool.push(...reviewWords);
        if (unknownWords.length > 0) pool.push(...unknownWords);
        if (pool.length === 0) pool.push(...words);
        
        const shuffledPool = shuffleArray(pool);
        setTargetWord(shuffledPool[0]);
        setTranscript('');
        setFeedback(null);
        setError(null);
        setStatus('idle');
    };

    useEffect(() => {
        if (words.length > 0) {
            getNewWord();
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setError('Trình duyệt của bạn không hỗ trợ nhận dạng giọng nói. Vui lòng thử trên Chrome.');
            return;
        }
        
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-US';
        recognition.interimResults = true;

        recognition.onstart = () => {
            setStatus('listening');
            setTranscript('');
            setFeedback(null);
        };

        recognition.onresult = (event: any) => {
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                  const finalTranscript = event.results[i][0].transcript;
                  setTranscript(finalTranscript);
                  recognition.stop();
                  callGeminiForFeedback(finalTranscript);
                } else {
                  interimTranscript += event.results[i][0].transcript;
                  setTranscript(interimTranscript);
                }
            }
        };

        recognition.onerror = (event: any) => {
            console.error('SpeechRecognition error:', event.error);
            setError('Đã xảy ra lỗi khi ghi âm. Vui lòng thử lại.');
            setStatus('idle');
        };

        recognition.onend = () => {
            if (status === 'listening') { // Ended without a final result
              setStatus('idle');
            }
        };

        recognitionRef.current = recognition;
    }, [words]);

    const callGeminiForFeedback = async (userTranscript: string) => {
        if (!targetWord) return;
        setStatus('analyzing');
        setError(null);
        setFeedback(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `As an expert English pronunciation coach, evaluate a user's pronunciation for a Vietnamese learner.
- The target word is: "${targetWord.english}" (phonetics: ${targetWord.pronunciation}).
- The user said: "${userTranscript}".

Please provide your evaluation in a valid JSON object with three keys:
1. "score": An integer from 0 to 100 on how accurate the pronunciation was.
2. "comment": A short, overall constructive feedback in Vietnamese.
3. "specifics": An array of objects, where each object has "phoneme" (the specific sound) and "feedback" (a short comment in Vietnamese on that sound). If pronunciation is perfect, return an empty array [].

Example for a mistake: 
{
  "score": 65,
  "comment": "Khá tốt! Bạn cần chú ý một vài âm cuối.",
  "specifics": [
    { "phoneme": "/t/", "feedback": "Âm /t/ ở cuối từ 'cat' chưa được bật ra rõ ràng." }
  ]
}

Example for a good attempt:
{
  "score": 95,
  "comment": "Rất tốt! Phát âm của bạn rất rõ ràng và chính xác.",
  "specifics": []
}`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt
            });
            
            const jsonText = response.text.replace(/```json|```/g, '').trim();
            const parsedFeedback = JSON.parse(jsonText);
            setFeedback(parsedFeedback);
            onGoalUpdate();

        } catch (err) {
            console.error("Gemini API Error:", err);
            setError("Rất tiếc, AI không thể phản hồi lúc này. Vui lòng thử lại sau.");
        } finally {
            setStatus('feedback');
        }
    };

    const handleMicClick = () => {
        if (status === 'listening') {
            recognitionRef.current?.stop();
        } else {
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
            <div className="w-full max-w-2xl text-center mb-6">
                <h2 className="text-3xl font-bold text-slate-800">Luyện Phát Âm Cùng AI</h2>
                <p className="text-lg text-slate-600 mt-2">Ghi âm và nhận phản hồi tức thì để cải thiện phát âm của bạn.</p>
            </div>

            <div className="w-full max-w-2xl">
                {targetWord && (
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 text-center mb-6">
                        <div className="flex justify-between items-center">
                           <p className="text-slate-500">Từ cần luyện tập:</p>
                           <SpeakerButton textToSpeak={targetWord.english} ariaLabel={`Phát âm từ ${targetWord.english}`} />
                        </div>
                        <h3 className="text-6xl font-extrabold text-blue-600 my-4">{targetWord.english}</h3>
                        <p className="text-2xl text-slate-500 italic">{targetWord.pronunciation}</p>
                    </div>
                )}
                 <button 
                    onClick={getNewWord}
                    className="block mx-auto mb-6 px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors"
                    >
                    Lấy từ mới
                </button>


                <div className="flex flex-col items-center justify-center gap-4 mb-6">
                    <button 
                        onClick={handleMicClick}
                        className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-colors
                            ${status === 'listening' ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-blue-600 hover:bg-blue-700'}
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
                    </p>
                </div>
                
                {(status === 'analyzing' || status === 'feedback' || transcript) && (
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 animate-fade-in">
                        <div className="mb-4">
                            <h4 className="font-bold text-slate-700">Bạn đã nói:</h4>
                            <p className="text-lg text-slate-600 italic h-7">
                                "{transcript}"
                                {status === 'listening' && <span className="inline-block w-1 h-5 bg-slate-500 animate-pulse ml-1"></span>}
                            </p>
                        </div>
                        <div className="pt-4 border-t">
                             <h4 className="font-bold text-slate-700">Nhận xét từ AI:</h4>
                            {status === 'analyzing' && (
                                <div className="flex items-center gap-2 text-slate-500 mt-2">
                                     <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    <span>Đang chờ phản hồi...</span>
                                </div>
                            )}
                            {feedback && (
                                <div className="mt-2 space-y-4">
                                    <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg border border-blue-200">
                                        <p className="text-md text-slate-800 font-medium flex-grow">{feedback.comment}</p>
                                        <p className={`text-4xl font-bold ml-4 ${getScoreColor(feedback.score)}`}>{feedback.score}<span className="text-lg">/100</span></p>
                                    </div>
                                    {feedback.specifics && feedback.specifics.length > 0 && (
                                        <div>
                                            <h5 className="font-semibold text-slate-600 mb-2">Phân tích chi tiết:</h5>
                                            <div className="space-y-2">
                                                {feedback.specifics.map((item, index) => (
                                                    <div key={index} className="flex items-start gap-2 text-sm p-2 bg-slate-100 rounded">
                                                        <code className="font-bold text-red-600 bg-red-100 px-2 py-1 rounded">{item.phoneme}</code>
                                                        <p className="text-slate-700">{item.feedback}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
                 {error && <p className="text-red-500 bg-red-50 p-3 rounded-md text-center mt-4">{error}</p>}
            </div>
        </div>
    );
};

export default PronunciationView;
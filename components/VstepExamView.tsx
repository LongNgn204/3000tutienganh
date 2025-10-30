import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import type { VstepExam, VstepListeningPart, VstepReadingPassage, VstepWritingTask, VstepSpeakingPart, VstepQuestion } from '../types';
import SpeakerButton from './SpeakerButton';

const loadingMessages = [
    "Khởi tạo cấu trúc đề thi...",
    "Thiết kế phần thi Nghe (Listening)...",
    "Soạn thảo các đoạn văn Đọc (Reading)...",
    "Tạo các câu hỏi Viết (Writing)...",
    "Chuẩn bị chủ đề Nói (Speaking)...",
    "Hoàn tất và sắp xếp đề thi..."
];

const QuestionRenderer: React.FC<{
    question: VstepQuestion;
    qIndex: number;
    prefix: string;
    selectedAnswer?: string;
    onAnswerSelect: (key: string, answer: string) => void;
}> = ({ question, qIndex, prefix, selectedAnswer, onAnswerSelect }) => {
    const questionKey = `${prefix}-${qIndex}`;
    return (
        <div className="mt-4 p-3 bg-slate-50 border rounded-lg">
            <p className="font-semibold text-slate-700">{qIndex + 1}. {question.question}</p>
            <div className="mt-2 space-y-2">
                {question.options.map(option => (
                    <label key={option} className="flex items-center p-2 rounded-md has-[:checked]:bg-indigo-100 has-[:checked]:font-semibold cursor-pointer transition-colors">
                        <input
                            type="radio"
                            name={questionKey}
                            value={option}
                            checked={selectedAnswer === option}
                            onChange={() => onAnswerSelect(questionKey, option)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300"
                        />
                        <span className="ml-3 text-sm text-slate-800">{option}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};


const VstepExamView: React.FC = () => {
    const [examState, setExamState] = useState<'idle' | 'generating' | 'taking' | 'finished'>('idle');
    const [examData, setExamData] = useState<VstepExam | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [generationStatus, setGenerationStatus] = useState(loadingMessages[0]);
    
    // State for user answers and results
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [finalScore, setFinalScore] = useState<{ listening: number; reading: number; totalListening: number; totalReading: number; } | null>(null);


    useEffect(() => {
        // Fix: Use ReturnType<typeof setInterval> for browser compatibility instead of NodeJS.Timeout.
        let timer: ReturnType<typeof setInterval>;
        if (examState === 'generating') {
            let index = 0;
            setGenerationStatus(loadingMessages[index]);
            timer = setInterval(() => {
                index++;
                if (index < loadingMessages.length) {
                    setGenerationStatus(loadingMessages[index]);
                } else {
                    clearInterval(timer);
                }
            }, 2500); // Change status every 2.5 seconds
        }
        return () => clearInterval(timer);
    }, [examState]);


    const generateVstepExam = async () => {
        setExamState('generating');
        setError(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Create a complete, unique, B1-B2 level VSTEP-like mock exam with all 4 skills. The exam must follow this new, specific structure precisely.

1.  **LISTENING** (40 minutes, 35 questions):
    *   Part 1: 8 short announcements/conversations with one multiple-choice question each.
    *   Part 2: 3 longer conversations with 4 multiple-choice questions each (12 total).
    *   Part 3: 3 short talks/lectures with 5 multiple-choice questions each (15 total).
    For each part, provide instructions, an "audioScript" for TTS, and an array of "questions". Each question needs a "question" text, an array of 4 "options", and the "correctAnswer".

2.  **READING** (60 minutes, 40 questions):
    *   Create 4 reading passages, each around 350-450 words, on academic/general interest topics.
    *   For each passage, create 10 multiple-choice questions testing main ideas, details, vocabulary, and inference.

3.  **WRITING** (12 minutes, 3 tasks):
    *   Create 3 short writing tasks suitable for a 12-minute total duration. For example: writing a short note/email, completing a form with sentences, or writing a short paragraph response to a question. Each task should have a clear prompt.

4.  **SPEAKING** (60 minutes, 2 parts):
    *   Part 1: In-depth Solution Discussion. Provide a complex scenario with multiple conflicting factors and 3 nuanced options. The user must discuss the pros and cons of each and justify their chosen solution in detail. The topic and prompts should be substantial enough for a long discussion.
    *   Part 2: Extended Topic Development. Provide a complex, abstract topic (e.g., "The impact of social media on society") and a mind map with 4-5 sophisticated key ideas. The user must develop a well-structured, in-depth speech on the topic. The prompts should guide a long-form response.

Return ONLY the valid JSON object based on the schema.`;
            
            const vstepQuestionSchema = {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    correctAnswer: { type: Type.STRING },
                },
                required: ['question', 'options', 'correctAnswer'],
            };

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                           listening: { 
                               type: Type.ARRAY, 
                               description: "3 parts of listening test",
                               items: {
                                   type: Type.OBJECT,
                                   properties: {
                                       partNumber: { type: Type.INTEGER },
                                       instructions: { type: Type.STRING },
                                       audioScript: { type: Type.STRING },
                                       questions: { type: Type.ARRAY, items: vstepQuestionSchema },
                                   },
                                   required: ['partNumber', 'instructions', 'audioScript', 'questions'],
                               }
                           },
                           reading: { 
                               type: Type.ARRAY, 
                               description: "4 reading passages with questions",
                               items: {
                                   type: Type.OBJECT,
                                   properties: {
                                       passageNumber: { type: Type.INTEGER },
                                       passageText: { type: Type.STRING },
                                       questions: { type: Type.ARRAY, items: vstepQuestionSchema },
                                   },
                                   required: ['passageNumber', 'passageText', 'questions'],
                               }
                           },
                           writing: { 
                               type: Type.ARRAY, 
                               description: "3 writing tasks",
                               items: {
                                   type: Type.OBJECT,
                                   properties: {
                                       taskNumber: { type: Type.INTEGER },
                                       prompt: { type: Type.STRING },
                                   },
                                   required: ['taskNumber', 'prompt'],
                               }
                           },
                           speaking: { 
                               type: Type.ARRAY, 
                               description: "2 speaking parts",
                               items: {
                                   type: Type.OBJECT,
                                   properties: {
                                       partNumber: { type: Type.INTEGER },
                                       topic: { type: Type.STRING },
                                       prompts: { type: Type.ARRAY, items: { type: Type.STRING } },
                                   },
                                   required: ['partNumber', 'topic', 'prompts'],
                               }
                           },
                        },
                        required: ['listening', 'reading', 'writing', 'speaking']
                    }
                }
            });

            const exam = JSON.parse(response.text) as VstepExam;
            setExamData(exam);
            setAnswers({});
            setFinalScore(null);
            setExamState('taking');

        } catch (err) {
            console.error("VSTEP Generation Error:", err);
            setError("Rất tiếc, AI không thể tạo đề thi lúc này. Vui lòng thử lại sau.");
            setExamState('idle');
        }
    };
    
    const handleAnswerSelect = (questionKey: string, option: string) => {
        setAnswers(prev => ({
            ...prev,
            [questionKey]: option
        }));
    };

    const handleSubmitExam = () => {
        if (!examData) return;

        let listeningScore = 0;
        let readingScore = 0;
        let totalListening = 0;
        let totalReading = 0;

        examData.listening.forEach((part, partIndex) => {
            part.questions.forEach((q, qIndex) => {
                totalListening++;
                const key = `listening-${part.partNumber}-${qIndex}`;
                if (answers[key] === q.correctAnswer) {
                    listeningScore++;
                }
            });
        });

        examData.reading.forEach((passage, passageIndex) => {
            passage.questions.forEach((q, qIndex) => {
                totalReading++;
                const key = `reading-${passage.passageNumber}-${qIndex}`;
                if (answers[key] === q.correctAnswer) {
                    readingScore++;
                }
            });
        });
        
        setFinalScore({ listening: listeningScore, reading: readingScore, totalListening, totalReading });
        setExamState('finished');
    };


    if (examState === 'idle') {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="bg-white p-10 rounded-2xl shadow-xl max-w-lg w-full card-hover">
                    <h1 className="text-3xl font-bold text-slate-800">Thi thử VSTEP</h1>
                    <p className="text-slate-600 mt-4 mb-8">Trải nghiệm một bài thi VSTEP hoàn chỉnh với 4 kỹ năng do AI tạo ra để đánh giá năng lực của bạn.</p>
                    {error && <p className="text-red-500 bg-red-50 p-3 rounded-md mb-4">{error}</p>}
                    <button
                        onClick={generateVstepExam}
                        className="w-full px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transform hover:scale-105"
                    >
                        Bắt đầu Thi
                    </button>
                </div>
            </div>
        );
    }
    
    if (examState === 'generating') {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                 <svg className="animate-spin h-12 w-12 text-indigo-600 mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                 <h2 className="text-2xl font-bold text-slate-800">AI đang tạo đề thi...</h2>
                 <p className="text-slate-500 mt-2 transition-all duration-500">{generationStatus}</p>
                 <p className="text-sm text-slate-400 mt-4">Quá trình này có thể mất một chút thời gian.</p>
            </div>
        );
    }
    
    if (examState === 'taking' && examData) {
        return (
             <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
                <h1 className="text-3xl font-bold text-center mb-6">Đề thi VSTEP</h1>
                <div className="space-y-8">
                    {/* Listening Section */}
                    <details className="bg-white p-6 rounded-xl shadow-lg border group" open>
                         <summary className="text-2xl font-bold text-indigo-700 cursor-pointer list-none">Phần 1: Nghe</summary>
                         <div className="mt-4">
                             {examData.listening.map((part, partIndex) => (
                                <div key={part.partNumber} className="mb-6 p-4 border-t">
                                    <h3 className="font-semibold">Part {part.partNumber}: {part.instructions}</h3>
                                    <div className="flex items-center gap-2 my-2 p-2 bg-slate-100 rounded">
                                        <SpeakerButton textToSpeak={part.audioScript} ariaLabel={`Play audio for part ${part.partNumber}`} />
                                        <span>Nghe đoạn hội thoại</span>
                                    </div>
                                    {part.questions.map((q, qIndex) => (
                                        <QuestionRenderer 
                                            key={qIndex}
                                            question={q}
                                            qIndex={qIndex}
                                            prefix={`listening-${part.partNumber}`}
                                            selectedAnswer={answers[`listening-${part.partNumber}-${qIndex}`]}
                                            onAnswerSelect={handleAnswerSelect}
                                        />
                                    ))}
                                </div>
                             ))}
                         </div>
                    </details>
                    {/* Reading Section */}
                     <details className="bg-white p-6 rounded-xl shadow-lg border group">
                         <summary className="text-2xl font-bold text-indigo-700 cursor-pointer list-none">Phần 2: Đọc</summary>
                         <div className="mt-4">
                             {examData.reading.map((passage, passageIndex) => (
                                <div key={passage.passageNumber} className="mb-6 p-4 border-t">
                                    <h3 className="font-semibold">Passage {passage.passageNumber}</h3>
                                    <p className="text-sm text-slate-600 my-2 whitespace-pre-wrap leading-relaxed">{passage.passageText}</p>
                                    {passage.questions.map((q, qIndex) => (
                                         <QuestionRenderer 
                                            key={qIndex}
                                            question={q}
                                            qIndex={qIndex}
                                            prefix={`reading-${passage.passageNumber}`}
                                            selectedAnswer={answers[`reading-${passage.passageNumber}-${qIndex}`]}
                                            onAnswerSelect={handleAnswerSelect}
                                        />
                                    ))}
                                </div>
                             ))}
                         </div>
                    </details>
                    {/* Writing Section */}
                     <details className="bg-white p-6 rounded-xl shadow-lg border group">
                         <summary className="text-2xl font-bold text-indigo-700 cursor-pointer list-none">Phần 3: Viết</summary>
                         <div className="mt-4">
                             {examData.writing.map(task => (
                                <div key={task.taskNumber} className="mb-6 p-4 border-t">
                                    <h3 className="font-semibold">Task {task.taskNumber}</h3>
                                    <p className="text-slate-700 my-2">{task.prompt}</p>
                                    <textarea rows={task.taskNumber === 1 ? 5 : 10} className="w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500" placeholder="Viết bài của bạn ở đây..."></textarea>
                                </div>
                             ))}
                         </div>
                    </details>
                    {/* Speaking Section */}
                     <details className="bg-white p-6 rounded-xl shadow-lg border group">
                         <summary className="text-2xl font-bold text-indigo-700 cursor-pointer list-none">Phần 4: Nói</summary>
                         <div className="mt-4">
                             {examData.speaking.map(part => (
                                <div key={part.partNumber} className="mb-6 p-4 border-t">
                                    <h3 className="font-semibold">Part {part.partNumber}: {part.topic}</h3>
                                    <ul className="list-disc list-inside text-slate-700 my-2 space-y-1">
                                        {part.prompts.map((p, i) => <li key={i}>{p}</li>)}
                                    </ul>
                                    <button className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm flex items-center gap-2 hover:bg-red-600">
                                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8h-1a6 6 0 11-12 0H3a7.001 7.001 0 006 6.93V17H7a1 1 0 100 2h6a1 1 0 100-2h-2v-2.07z" clipRule="evenodd" /></svg>
                                        Bắt đầu ghi âm
                                    </button>
                                </div>
                             ))}
                         </div>
                    </details>
                </div>
                 <div className="text-center mt-8">
                     <button onClick={handleSubmitExam} className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 shadow-md">Nộp bài</button>
                </div>
             </div>
        );
    }
    
    if (examState === 'finished') {
        return (
             <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="bg-white p-10 rounded-2xl shadow-xl max-w-lg w-full">
                    <h1 className="text-3xl font-bold text-slate-800">Hoàn thành!</h1>
                    <p className="text-slate-600 mt-4 mb-6">Bạn đã nộp bài thi. Dưới đây là kết quả các phần trắc nghiệm.</p>
                    {finalScore && (
                        <div className="text-left space-y-3 bg-slate-50 p-4 rounded-lg border">
                            <div className="flex justify-between items-center text-lg">
                                <span className="font-semibold text-slate-700">Điểm Nghe:</span>
                                <span className="font-bold text-indigo-600">{finalScore.listening} / {finalScore.totalListening}</span>
                            </div>
                             <div className="flex justify-between items-center text-lg">
                                <span className="font-semibold text-slate-700">Điểm Đọc:</span>
                                <span className="font-bold text-indigo-600">{finalScore.reading} / {finalScore.totalReading}</span>
                            </div>
                        </div>
                    )}
                    <p className="text-xs text-slate-500 mt-4">Chức năng chấm điểm Viết và Nói sẽ sớm được ra mắt.</p>
                    <button
                        onClick={() => setExamState('idle')}
                        className="w-full mt-8 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md"
                    >
                        Làm lại bài khác
                    </button>
                </div>
            </div>
        );
    }

    return null;
};

export default VstepExamView;

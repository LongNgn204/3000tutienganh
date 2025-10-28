import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import type { VstepExam, VstepListeningPart, VstepReadingPassage, VstepWritingTask, VstepSpeakingPart } from '../types';
import SpeakerButton from './SpeakerButton';

const VstepExamView: React.FC = () => {
    const [examState, setExamState] = useState<'idle' | 'generating' | 'taking' | 'finished'>('idle');
    const [examData, setExamData] = useState<VstepExam | null>(null);
    const [error, setError] = useState<string | null>(null);

    const generateVstepExam = async () => {
        setExamState('generating');
        setError(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Create a complete, unique, B1-B2 level VSTEP-like mock exam with all 4 skills. The exam must follow this structure precisely.

1.  **LISTENING** (~40 minutes, 35 questions):
    *   Part 1: 8 short announcements/conversations with one multiple-choice question each.
    *   Part 2: 3 longer conversations with 4 multiple-choice questions each (12 total).
    *   Part 3: 3 short talks/lectures with 5 multiple-choice questions each (15 total).
    For each part, provide instructions, an "audioScript" for TTS, and an array of "questions". Each question needs a "question" text, an array of 4 "options", and the "correctAnswer".

2.  **READING** (60 minutes, 40 questions):
    *   Create 4 reading passages, each around 350-450 words, on academic/general interest topics.
    *   For each passage, create 10 multiple-choice questions testing main ideas, details, vocabulary, and inference.

3.  **WRITING** (60 minutes, 2 tasks):
    *   Task 1: An informal letter/email writing prompt (~120 words).
    *   Task 2: An opinion essay prompt (~250 words) on a social issue.

4.  **SPEAKING** (~12 minutes, 3 parts):
    *   Part 1: Social Interaction. Provide 2 sets of 3 simple questions about familiar topics (e.g., hobbies, hometown).
    *   Part 2: Solution Discussion. Provide a scenario with 3 suggested options and ask the user to choose the best one.
    *   Part 3: Topic Development. Provide a topic and a mind map with 3-4 key ideas for the user to develop into a longer speech.

Return ONLY the valid JSON object based on the schema.`;
            
            // This is a simplified schema for brevity. A full production schema would be more detailed.
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                           listening: { type: Type.ARRAY, description: "3 parts of listening test" },
                           reading: { type: Type.ARRAY, description: "4 reading passages with questions" },
                           writing: { type: Type.ARRAY, description: "2 writing tasks" },
                           speaking: { type: Type.ARRAY, description: "3 speaking parts" },
                        }
                    }
                }
            });

            const exam = JSON.parse(response.text) as VstepExam;
            setExamData(exam);
            setExamState('taking');

        } catch (err) {
            console.error("VSTEP Generation Error:", err);
            setError("Rất tiếc, AI không thể tạo đề thi lúc này. Vui lòng thử lại sau.");
            setExamState('idle');
        }
    };

    if (examState === 'idle') {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="bg-white p-10 rounded-2xl shadow-xl max-w-lg w-full">
                    <h1 className="text-3xl font-bold text-slate-800">Thi thử VSTEP</h1>
                    <p className="text-slate-600 mt-4 mb-8">Trải nghiệm một bài thi VSTEP hoàn chỉnh với 4 kỹ năng do AI tạo ra để đánh giá năng lực của bạn.</p>
                    {error && <p className="text-red-500 bg-red-50 p-3 rounded-md mb-4">{error}</p>}
                    <button
                        onClick={generateVstepExam}
                        className="w-full px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition-transform transform hover:scale-105"
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
                 <div className="w-16 h-16 border-4 border-slate-200 border-b-indigo-500 rounded-full animate-spin mb-6"></div>
                 <h2 className="text-2xl font-bold text-slate-800">AI đang tạo đề thi...</h2>
                 <p className="text-slate-500 mt-2">Quá trình này có thể mất một vài phút. Vui lòng chờ.</p>
            </div>
        );
    }
    
    // NOTE: This is a simplified renderer. A real implementation would have separate components, answer tracking, timers, etc.
    if (examState === 'taking' && examData) {
        return (
             <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
                <h1 className="text-3xl font-bold text-center mb-6">Đề thi VSTEP</h1>
                <div className="space-y-8">
                    {/* Listening Section */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border">
                         <h2 className="text-2xl font-bold text-indigo-700 mb-4">Phần 1: Nghe</h2>
                         {examData.listening.map(part => (
                            <div key={part.partNumber} className="mb-4 p-4 border-t">
                                <h3 className="font-semibold">Part {part.partNumber}: {part.instructions}</h3>
                                <div className="flex items-center gap-2 my-2 p-2 bg-slate-100 rounded">
                                    <SpeakerButton textToSpeak={part.audioScript} ariaLabel={`Play audio for part ${part.partNumber}`} />
                                    <span>Nghe đoạn hội thoại</span>
                                </div>
                            </div>
                         ))}
                    </div>
                    {/* Reading Section */}
                     <div className="bg-white p-6 rounded-xl shadow-lg border">
                         <h2 className="text-2xl font-bold text-indigo-700 mb-4">Phần 2: Đọc</h2>
                         {examData.reading.map(passage => (
                            <div key={passage.passageNumber} className="mb-4 p-4 border-t">
                                <h3 className="font-semibold">Passage {passage.passageNumber}</h3>
                                <p className="text-sm text-slate-600 my-2 whitespace-pre-wrap">{passage.passageText}</p>
                            </div>
                         ))}
                    </div>
                    {/* Writing Section */}
                     <div className="bg-white p-6 rounded-xl shadow-lg border">
                         <h2 className="text-2xl font-bold text-indigo-700 mb-4">Phần 3: Viết</h2>
                         {examData.writing.map(task => (
                            <div key={task.taskNumber} className="mb-4 p-4 border-t">
                                <h3 className="font-semibold">Task {task.taskNumber}</h3>
                                <p className="text-sm text-slate-600 my-2">{task.prompt}</p>
                                <textarea rows={task.taskNumber === 1 ? 5 : 10} className="w-full p-2 border rounded" placeholder="Viết bài của bạn ở đây..."></textarea>
                            </div>
                         ))}
                    </div>
                    {/* Speaking Section */}
                     <div className="bg-white p-6 rounded-xl shadow-lg border">
                         <h2 className="text-2xl font-bold text-indigo-700 mb-4">Phần 4: Nói</h2>
                         {examData.speaking.map(part => (
                            <div key={part.partNumber} className="mb-4 p-4 border-t">
                                <h3 className="font-semibold">Part {part.partNumber}: {part.topic}</h3>
                                <ul className="list-disc list-inside text-sm text-slate-600 my-2">
                                    {part.prompts.map((p, i) => <li key={i}>{p}</li>)}
                                </ul>
                                <button className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm">Bắt đầu ghi âm</button>
                            </div>
                         ))}
                    </div>
                </div>
                 <div className="text-center mt-8">
                     <button onClick={() => setExamState('finished')} className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg">Nộp bài</button>
                </div>
             </div>
        );
    }
    
    if (examState === 'finished') {
        return (
             <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="bg-white p-10 rounded-2xl shadow-xl max-w-lg w-full">
                    <h1 className="text-3xl font-bold text-slate-800">Hoàn thành!</h1>
                    <p className="text-slate-600 mt-4 mb-8">Bạn đã nộp bài thi. Chức năng chấm điểm tự động sẽ sớm được ra mắt.</p>
                    <button
                        onClick={() => setExamState('idle')}
                        className="w-full px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md"
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

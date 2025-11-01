import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import type { CEFRLevel, PlacementTestResult, TestAnalysis, LevelPerformance, IncorrectQuestionInfo } from '../types';

interface PlacementTestViewProps {
  onTestSubmit: (result: PlacementTestResult) => void;
}

const ALL_QUESTIONS = [
  // A1 Level
  { id: 'q1', text: 'She ___ a doctor.', options: ['is', 'are', 'am'], correctAnswer: 'is', level: 'A1' as CEFRLevel },
  { id: 'q2', text: '___ are you from?', options: ['What', 'Where', 'Who'], correctAnswer: 'Where', level: 'A1' as CEFRLevel },
  { id: 'q21', text: 'I have ___ apple.', options: ['a', 'an', 'the'], correctAnswer: 'an', level: 'A1' as CEFRLevel },
  // A2 Level
  { id: 'q3', text: 'I saw ___ good film last night.', options: ['a', 'an', 'the'], correctAnswer: 'a', level: 'A2' as CEFRLevel },
  { id: 'q4', text: 'He ___ to work by bus yesterday.', options: ['go', 'goes', 'went'], correctAnswer: 'went', level: 'A2' as CEFRLevel },
  { id: 'q22', text: 'She is ___ than her sister.', options: ['tall', 'taller', 'tallest'], correctAnswer: 'taller', level: 'A2' as CEFRLevel },
  // B1 Level
  { id: 'q5', text: "I haven't seen him ___ last year.", options: ['since', 'for', 'in'], correctAnswer: 'since', level: 'B1' as CEFRLevel },
  { id: 'q6', text: 'If you ___ harder, you would pass the exam.', options: ['study', 'studied', 'have studied'], correctAnswer: 'studied', level: 'B1' as CEFRLevel },
  { id: 'q7', text: 'This book is not as interesting ___ the last one.', options: ['as', 'than', 'so'], correctAnswer: 'as', level: 'B1' as CEFRLevel },
  // B2 Level
  { id: 'q8', text: 'By the time the police arrived, the thief ___.', options: ['has escaped', 'had escaped', 'escaped'], correctAnswer: 'had escaped', level: 'B2' as CEFRLevel },
  { id: 'q9', text: 'I wish I ___ that. It was a mistake.', options: ["didn't say", "hadn't said", "wouldn't say"], correctAnswer: "hadn't said", level: 'B2' as CEFRLevel },
  { id: 'q10', text: 'The report ___ be finished by tomorrow.', options: ['must', 'can', 'should'], correctAnswer: 'must', level: 'B2' as CEFRLevel },
  // C1 Level
  { id: 'q11', text: '___ the bad weather, the match went ahead.', options: ['Despite', 'Although', 'However'], correctAnswer: 'Despite', level: 'C1' as CEFRLevel },
  { id: 'q12', text: 'The proliferation of digital media has fundamentally altered how we consume information. What is a major challenge of this?', options: ['Limited access to knowledge', 'The spread of false information', 'The high cost of digital media'], correctAnswer: 'The spread of false information', level: 'C1' as CEFRLevel },
  { id: 'q13', text: 'Not only ___ the exam, but he also got the highest score.', options: ['he passed', 'did he pass', 'he did pass'], correctAnswer: 'did he pass', level: 'C1' as CEFRLevel },
];

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const PlacementTestView: React.FC<PlacementTestViewProps> = ({ onTestSubmit }) => {
  const [questions, setQuestions] = useState(() => shuffleArray(ALL_QUESTIONS));
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };
  
  const answeredCount = Object.keys(answers).length;
  const progressPercentage = (answeredCount / questions.length) * 100;
  const isAllAnswered = answeredCount === questions.length;

  const handleSubmit = async () => {
    if (!isAllAnswered) {
        alert("Vui lòng trả lời tất cả các câu hỏi.");
        return;
    }
    setIsLoading(true);
    setError(null);

    let score = 0;
    const incorrectQuestions: IncorrectQuestionInfo[] = [];
    const performanceByLevel: Partial<Record<CEFRLevel, { correct: number, total: number }>> = {};

    for (const q of questions) {
        const level = q.level;
        if (!performanceByLevel[level]) {
            performanceByLevel[level] = { correct: 0, total: 0 };
        }
        performanceByLevel[level]!.total++;

        if (answers[q.id] === q.correctAnswer) {
            score++;
            performanceByLevel[level]!.correct++;
        } else {
            incorrectQuestions.push({
                questionId: q.id,
                questionText: q.text,
                userAnswer: answers[q.id] ?? 'Chưa trả lời',
                correctAnswer: q.correctAnswer,
                level: level,
            });
        }
    }
    
    const finalPerformance: Partial<Record<CEFRLevel, LevelPerformance>> = {};
    for (const key in performanceByLevel) {
        const level = key as CEFRLevel;
        const data = performanceByLevel[level]!;
        finalPerformance[level] = {
            ...data,
            percentage: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
        };
    }

    const analysis: TestAnalysis = {
        score,
        totalQuestions: questions.length,
        incorrectQuestions,
        performanceByLevel: finalPerformance,
    };
    
    const submissionText = questions.map(q => 
      `Question (Level ${q.level}): "${q.text}"\nUser's Answer: "${answers[q.id]}"\nCorrect Answer: "${q.correctAnswer}"`
    ).join('\n\n');

    const prompt = `As an expert English language assessor, please evaluate the following answers to a placement test and determine the user's overall CEFR level (A1, A2, B1, B2, C1, or C2). The questions are ordered by increasing difficulty. Consider the overall pattern of correct and incorrect answers.

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
        
        const finalResult: PlacementTestResult = {
            level: validLevels.includes(level) ? level : 'A2', 
            analysis: analysis,
        };
        onTestSubmit(finalResult);

    } catch (err) {
        console.error("Gemini API Error:", err);
        setError("AI đánh giá đã gặp lỗi. Vui lòng thử lại sau. Sử dụng kết quả phân tích tạm thời.");
        const fallbackResult: PlacementTestResult = {
            level: 'A2', 
            analysis: analysis,
        };
        onTestSubmit(fallbackResult);
    } finally {
        setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
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
    <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-slate-800">Bài Kiểm Tra Trình Độ</h1>
                <p className="text-slate-600 mt-2 mb-8">Hãy chọn đáp án đúng nhất để AI xác định trình độ của bạn.</p>
            </div>

            <div className="w-full bg-slate-200 rounded-full h-2.5 mb-8 sticky top-24 z-10">
                <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
            </div>
            
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
                                <label key={option} className="flex items-center p-3 rounded-lg border-2 border-slate-200 has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500 cursor-pointer transition-all duration-200">
                                    <input 
                                        type="radio"
                                        name={q.id}
                                        value={option}
                                        checked={answers[q.id] === option}
                                        onChange={() => handleAnswerChange(q.id, option)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                                    />
                                    <span className="ml-3 text-slate-800 font-medium">{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-10 text-center">
                <button
                    onClick={handleSubmit}
                    disabled={!isAllAnswered || isLoading}
                    className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg shadow-md transition-all transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:scale-100"
                >
                    Nộp bài và Xem kết quả
                </button>
            </div>
        </div>
    </div>
  );
};

    export default PlacementTestView;
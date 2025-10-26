import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import type { CEFRLevel, PlacementTestResult, TestAnalysis, LevelPerformance, IncorrectQuestionInfo } from '../types';

interface PlacementTestViewProps {
  onTestComplete: (result: PlacementTestResult) => void;
}

const questions = [
  // A1 Level
  { id: 'q1', text: 'She ___ a doctor.', options: ['is', 'are', 'am'], correctAnswer: 'is', level: 'A1' as CEFRLevel },
  { id: 'q2', text: '___ are you from?', options: ['What', 'Where', 'Who'], correctAnswer: 'Where', level: 'A1' as CEFRLevel },
  // A2 Level
  { id: 'q3', text: 'I saw ___ good film last night.', options: ['a', 'an', 'the'], correctAnswer: 'a', level: 'A2' as CEFRLevel },
  { id: 'q4', text: 'He ___ to work by bus yesterday.', options: ['go', 'goes', 'went'], correctAnswer: 'went', level: 'A2' as CEFRLevel },
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
  { id: 'q12', text: 'The proliferation of digital media has fundamentally altered how we consume information. While it offers unprecedented access to knowledge, it also presents challenges related to information overload and the spread of misinformation. What is a major challenge mentioned?', options: ['Limited access to knowledge', 'The spread of false information', 'The high cost of digital media'], correctAnswer: 'The spread of false information', level: 'C1' as CEFRLevel },
  { id: 'q13', text: 'Not only ___ the exam, but he also got the highest score.', options: ['he passed', 'did he pass', 'he did pass'], correctAnswer: 'did he pass', level: 'C1' as CEFRLevel },
];

const PlacementTestView: React.FC<PlacementTestViewProps> = ({ onTestComplete }) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

    // Perform detailed analysis locally first
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
                userAnswer: answers[q.id],
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
    
    // Then, get the final CEFR level from AI
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
            level: validLevels.includes(level) ? level : 'A2', // Fallback to A2 if invalid response
            analysis: analysis,
        };
        onTestComplete(finalResult);

    } catch (err) {
        console.error("Gemini API Error:", err);
        setError("AI đánh giá đã gặp lỗi. Vui lòng thử lại sau. Sử dụng kết quả phân tích tạm thời.");
        // Fallback: Still complete the test with local analysis and a default level
        const fallbackResult: PlacementTestResult = {
            level: 'A2', 
            analysis: analysis,
        };
        onTestComplete(fallbackResult);
    } finally {
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

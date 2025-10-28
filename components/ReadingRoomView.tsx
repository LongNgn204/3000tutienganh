import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import type { User, ReadingArticle, CEFRLevel } from '../types';
import { CONTENT_LIBRARY } from '../contentLibrary';
import { CEFR_LEVEL_MAP } from '../cefr';

interface ReadingRoomViewProps {
    currentUser: User | null;
    onGoalUpdate: () => void;
}

const AIExplainModal: React.FC<{ word: string, context: string, onClose: () => void }> = ({ word, context, onClose }) => {
    const [explanation, setExplanation] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const parseMarkdown = (text: string) => text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />');

    React.useEffect(() => {
        const fetchExplanation = async () => {
            setIsLoading(true);
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                const prompt = `Explain the English word "${word}" for a Vietnamese learner in the context of: "${context}". Provide a short, clear explanation in Vietnamese.`;
                const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
                setExplanation(response.text);
            } catch (err) {
                setExplanation('Rất tiếc, không thể tải giải thích.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchExplanation();
    }, [word, context]);

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                <h3 className="text-2xl font-bold text-slate-800">Giải thích từ: <span className="text-indigo-600">{word}</span></h3>
                <div className="mt-4 min-h-[100px]">
                    {isLoading ? <p>AI đang suy nghĩ...</p> : <p className="text-slate-700" dangerouslySetInnerHTML={{ __html: parseMarkdown(explanation) }} />}
                </div>
                <button onClick={onClose} className="mt-6 w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700">Đóng</button>
            </div>
        </div>
    );
};

const ReadingText: React.FC<{ text: string, onWordClick: (word: string, context: string) => void }> = ({ text, onWordClick }) => {
    return (
        <div className="text-lg leading-relaxed text-slate-800 prose max-w-none">
            {text.split('\n').map((paragraph, pIndex) => (
                <p key={pIndex}>
                    {paragraph.split(/(\s+)/).map((segment, sIndex) => {
                        if (segment.trim() === '') return <span key={sIndex}>{segment}</span>;
                        const cleanWord = segment.replace(/[.,!?;:"“”]/g, '');
                        return <span key={sIndex} className="cursor-pointer hover:bg-yellow-200 transition-colors rounded" onClick={() => onWordClick(cleanWord, paragraph)}>{segment}</span>;
                    })}
                </p>
            ))}
        </div>
    );
};

const ReadingQuiz: React.FC<{ article: ReadingArticle, onComplete: () => void }> = ({ article, onComplete }) => {
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [showResults, setShowResults] = useState(false);
    const [explanations, setExplanations] = useState<Record<number, string> | null>(null);
    const [isFetchingExplanations, setIsFetchingExplanations] = useState(false);

    const handleAnswer = (qIndex: number, option: string) => {
        setAnswers(prev => ({ ...prev, [qIndex]: option }));
    };

    const handleGetExplanations = async () => {
        setIsFetchingExplanations(true);
        setExplanations(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `As an English teacher, explain in Vietnamese why the correct answers to these multiple-choice questions are correct, based ONLY on the provided article. Return a valid JSON object where keys are the question indices (as strings: "0", "1", "2", etc.) and values are the concise explanations.

Article:
"""
${article.content}
"""

Questions:
${JSON.stringify(article.questions.map((q, index) => ({ index, question: q.question, correctAnswer: q.answer })))}
`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            const jsonText = response.text.replace(/```json|```/g, '').trim();
            const parsedExplanations = JSON.parse(jsonText);
            setExplanations(parsedExplanations);
        } catch (err) {
            console.error("Gemini Explanation Error:", err);
            const errorExplanations: Record<number, string> = {};
            article.questions.forEach((_, index) => {
                errorExplanations[index] = 'Rất tiếc, không thể tải giải thích cho câu hỏi này.';
            });
            setExplanations(errorExplanations);
        } finally {
            setIsFetchingExplanations(false);
        }
    };

    const score = Object.entries(answers).reduce((acc, [qIndex, answer]) => {
        return article.questions[parseInt(qIndex)].answer === answer ? acc + 1 : acc;
    }, 0);

    return (
        <div className="mt-8 pt-6 border-t">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Câu hỏi đọc hiểu</h3>
            {article.questions.map((q, qIndex) => (
                <div key={qIndex} className="mb-6 p-4 border rounded-lg bg-slate-50">
                    <p className="font-semibold text-slate-700">{qIndex + 1}. {q.question}</p>
                    <div className="mt-3 space-y-2">
                        {q.options.map(option => {
                            const isSelected = answers[qIndex] === option;
                            const isCorrect = showResults && q.answer === option;
                            const isIncorrect = showResults && isSelected && q.answer !== option;
                            let styles = 'border-slate-300 hover:bg-slate-100';
                            if (isIncorrect) styles = 'bg-red-100 border-red-300';
                            else if (isCorrect) styles = 'bg-green-100 border-green-300';
                            else if (isSelected) styles = 'bg-blue-100 border-blue-300';
                            
                            return (
                                <button key={option} onClick={() => !showResults && handleAnswer(qIndex, option)} disabled={showResults} className={`block w-full text-left p-3 border rounded-md transition-colors ${styles}`}>
                                    {option}
                                </button>
                            );
                        })}
                    </div>
                    {showResults && explanations?.[qIndex] && (
                        <div className="mt-3 p-3 bg-indigo-50 border border-indigo-200 rounded-md">
                            <p className="text-sm font-semibold text-indigo-800">Giải thích:</p>
                            <p className="text-sm text-indigo-700">{explanations[qIndex]}</p>
                        </div>
                    )}
                </div>
            ))}
            {!showResults ? (
                <button onClick={() => setShowResults(true)} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700">Kiểm tra đáp án</button>
            ) : (
                <div className="text-center p-4 bg-blue-50 rounded-lg space-y-4">
                    <h4 className="text-xl font-bold text-blue-800">Bạn đã trả lời đúng {score}/{article.questions.length} câu!</h4>
                    <div className="flex justify-center gap-4">
                        <button onClick={onComplete} className="px-6 py-2 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-800">Quay lại</button>
                        {!explanations && (
                             <button 
                                onClick={handleGetExplanations} 
                                disabled={isFetchingExplanations}
                                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-slate-400"
                            >
                                {isFetchingExplanations ? 'Đang tải...' : 'Giải thích đáp án'}
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const ReadingRoomView: React.FC<ReadingRoomViewProps> = ({ currentUser, onGoalUpdate }) => {
    const [mode, setMode] = useState<'selection' | 'guided' | 'free-read'>('selection');
    const [selectedArticle, setSelectedArticle] = useState<ReadingArticle | null>(null);
    const [freeReadArticle, setFreeReadArticle] = useState<ReadingArticle | null>(null);
    const [isFetchingFree, setIsFetchingFree] = useState(false);
    const [selectedWord, setSelectedWord] = useState<{ word: string, context: string } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSelectArticle = (article: ReadingArticle) => {
        setSelectedArticle(article);
        setMode('guided');
    };

    const getNewFreeArticle = async () => {
        setIsFetchingFree(true);
        setError(null);
        setFreeReadArticle(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const userLevel = currentUser?.level || 'B1';
            const prompt = `Generate a short English reading exercise for a ${userLevel}-level learner. It should include a title, a passage (100-150 words), and 3 multiple-choice questions with options and the correct answer.
Return a single, valid JSON object with the following structure:
{
  "id": "ai-generated-${Date.now()}",
  "title": "A short, engaging title",
  "level": "${userLevel}",
  "content": "The reading passage...",
  "questions": [
    { "question": "...", "options": ["...", "...", "..."], "answer": "..." }
  ]
}`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            const jsonText = response.text.replace(/```json|```/g, '').trim();
            const article: ReadingArticle = JSON.parse(jsonText);
            setFreeReadArticle(article);
            onGoalUpdate();
        } catch (err) {
            console.error("Gemini Free Article Generation Error:", err);
            setError('Không thể tạo bài đọc mới. Vui lòng thử lại.');
        } finally {
            setIsFetchingFree(false);
        }
    };
    
    const handleStartFreeRead = () => {
        setMode('free-read');
        getNewFreeArticle();
    }
    
    const articlesByLevel = CONTENT_LIBRARY.reading.filter(a => a.level === currentUser?.level);

    if (mode === 'selection') {
        return (
            <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-slate-800">Luyện Đọc</h2>
                    <p className="text-lg text-slate-600 mt-2">Chọn một chế độ để bắt đầu.</p>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-2xl shadow-lg border text-center">
                        <h3 className="text-2xl font-bold text-slate-800">Luyện tập có hướng dẫn</h3>
                        <p className="text-slate-600 my-4">Đọc các bài viết được biên soạn sẵn theo trình độ của bạn và trả lời câu hỏi đọc hiểu.</p>
                         <h4 className="font-semibold text-slate-700 mb-3">Chọn bài đọc (Trình độ {currentUser?.level}):</h4>
                        <div className="space-y-3">
                            {articlesByLevel.map(article => (
                                <button key={article.id} onClick={() => handleSelectArticle(article)} className="w-full text-left p-3 border rounded-md hover:bg-slate-100 hover:border-indigo-400">
                                    {article.title}
                                </button>
                            ))}
                        </div>
                    </div>
                     <div className="bg-white p-8 rounded-2xl shadow-lg border text-center flex flex-col justify-center items-center">
                        <h3 className="text-2xl font-bold text-slate-800">Đọc tự do cùng AI</h3>
                        <p className="text-slate-600 my-4">Tạo một bài đọc ngẫu nhiên về bất kỳ chủ đề nào, trả lời câu hỏi và được AI giải thích đáp án.</p>
                        <button onClick={handleStartFreeRead} className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700">Tạo bài đọc ngẫu nhiên</button>
                    </div>
                </div>
            </div>
        );
    }
    
    const renderContent = () => {
        if (mode === 'guided' && selectedArticle) {
            return (
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 mb-4">{selectedArticle.title}</h2>
                    <ReadingText text={selectedArticle.content} onWordClick={(word, context) => setSelectedWord({ word, context })} />
                    <ReadingQuiz article={selectedArticle} onComplete={() => {
                        onGoalUpdate();
                        setMode('selection');
                    }}/>
                </div>
            );
        }
        if (mode === 'free-read') {
             if (isFetchingFree) return <div className="text-center p-8"><p>AI đang tạo bài đọc và câu hỏi...</p></div>;
             if (error) return <p className="text-red-500 text-center p-8">{error}</p>;
              if (freeReadArticle) {
                 return (
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800 mb-4">{freeReadArticle.title}</h2>
                        <ReadingText text={freeReadArticle.content} onWordClick={(word, context) => setSelectedWord({ word, context })} />
                        <ReadingQuiz article={freeReadArticle} onComplete={() => setMode('selection')}/>
                    </div>
                 );
             }
        }
        return null;
    }

    return (
        <div className="flex-1 flex flex-col items-center justify-start p-4 sm:p-6 lg:px-8 py-8 w-full animate-fade-in">
            <div className="w-full max-w-3xl">
                <button onClick={() => { setMode('selection'); setFreeReadArticle(null); }} className="mb-6 font-semibold text-indigo-600 hover:underline">‹ Quay lại chọn chế độ</button>
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
                    {renderContent()}
                </div>
                {mode === 'free-read' && !isFetchingFree && (
                     <div className="text-center mt-6">
                        <button onClick={getNewFreeArticle} className="px-6 py-2 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-800">Tạo bài đọc khác</button>
                    </div>
                )}
            </div>
            {selectedWord && <AIExplainModal word={selectedWord.word} context={selectedWord.context} onClose={() => setSelectedWord(null)} />}
        </div>
    );
};

export default ReadingRoomView;
import React, { useState } from 'react';
import type { User } from '../types';
import { aiService, AI_MODELS, AI_CONFIG } from '../services/aiService';

interface ReadingRoomViewProps {
    currentUser: User | null;
}

const AIExplainModal: React.FC<{ word: string, context: string, onClose: () => void }> = ({ word, context, onClose }) => {
    const [explanation, setExplanation] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const parseMarkdown = (text: string) => {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br />');
    };

    React.useEffect(() => {
        const fetchExplanation = async () => {
            setIsLoading(true);
            setExplanation('');
            try {
                const prompt = `Explain the English word "${word}" for a Vietnamese learner. The word appears in the following context: "${context}". Please provide a short, clear explanation in Vietnamese, including the word type (noun, verb, etc.) and its meaning in this specific context.`;
                const explanationText = await aiService.generateContent(
                    AI_MODELS.FLASH,
                    prompt,
                    { ...AI_CONFIG.FAST, maxOutputTokens: 256 } // Short, fast explanations
                );
                setExplanation(explanationText);
            } catch (err) {
                setExplanation('Rất tiếc, không thể tải giải thích vào lúc này.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchExplanation();
    }, [word, context]);

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                <h3 className="text-2xl font-bold text-slate-800">
                    Giải thích từ: <span className="text-indigo-600">{word}</span>
                </h3>
                <div className="mt-4 min-h-[100px]">
                    {isLoading ? <p>AI đang suy nghĩ...</p> : <p className="text-slate-700" dangerouslySetInnerHTML={{ __html: parseMarkdown(explanation) }} />}
                </div>
                <button onClick={onClose} className="mt-6 w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700">Đóng</button>
            </div>
        </div>
    );
};

const ReadingRoomView: React.FC<ReadingRoomViewProps> = ({ currentUser }) => {
    const [status, setStatus] = useState<'idle' | 'fetching' | 'ready'>('idle');
    const [article, setArticle] = useState('');
    const [selectedWord, setSelectedWord] = useState<{ word: string, context: string } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const getNewArticle = async () => {
        setStatus('fetching');
        setError(null);
        setArticle('');
        try {
            const userLevel = currentUser?.level || 'B1';
            const prompt = `Generate a short, interesting reading passage (around 100-150 words) in English for a ${userLevel}-level learner. The topic can be about technology, nature, or daily life. The language should be clear and appropriate for the level. Do not include a title. Just return the passage itself.`;
            const articleText = await aiService.generateContent(
                AI_MODELS.FLASH,
                prompt,
                AI_CONFIG.BALANCED // Balanced for reading passages
            );
            setArticle(articleText);
            setStatus('ready');
        } catch (err) {
            console.error(err);
            setError('Không thể tạo bài đọc mới. Vui lòng thử lại.');
            setStatus('idle');
        }
    };

    const handleWordClick = (e: React.MouseEvent<HTMLSpanElement>) => {
        const clickedWord = e.currentTarget.innerText.trim().replace(/[.,!?;:"“”]/g, '');
        if (clickedWord) {
            const parentSentence = e.currentTarget.closest('p')?.innerText || article;
            setSelectedWord({ word: clickedWord, context: parentSentence });
        }
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-start p-4 sm:p-6 lg:p-8 w-full animate-fade-in">
            <div className="w-full max-w-3xl text-center mb-6">
                <h2 className="text-3xl font-bold text-slate-800">Phòng Đọc AI</h2>
                <p className="text-lg text-slate-600 mt-2">Luyện đọc hiểu và học từ mới trong ngữ cảnh. Nhấp vào bất kỳ từ nào để xem giải thích từ AI.</p>
            </div>

            <div className="w-full max-w-3xl space-y-6">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 min-h-[300px]">
                    {status === 'idle' && (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <p className="text-slate-600 mb-4">Sẵn sàng cho một bài đọc mới?</p>
                            <button onClick={getNewArticle} className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700">Tạo bài đọc</button>
                        </div>
                    )}
                    {status === 'fetching' && <p>Đang tạo bài đọc...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    {status === 'ready' && article && (
                        <div className="text-lg leading-relaxed text-slate-800">
                            {article.split(/(\s+)/).map((segment, index) => {
                                if (segment.trim() === '') {
                                    return <span key={index}>{segment}</span>;
                                }
                                return (
                                    <span key={index} className="cursor-pointer hover:bg-yellow-200 transition-colors rounded" onClick={handleWordClick}>
                                        {segment}
                                    </span>
                                );
                            })}
                        </div>
                    )}
                </div>

                {status === 'ready' && (
                     <div className="text-center">
                        <button onClick={getNewArticle} className="px-6 py-2 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-800">Tạo bài đọc khác</button>
                    </div>
                )}
            </div>

            {selectedWord && <AIExplainModal word={selectedWord.word} context={selectedWord.context} onClose={() => setSelectedWord(null)} />}
        </div>
    );
};

export default ReadingRoomView;
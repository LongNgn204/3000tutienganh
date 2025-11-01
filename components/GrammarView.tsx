import React, { useState } from 'react';
import { GRAMMAR_LEVELS } from './grammarData';
import { aiService, AI_MODELS } from '../services/aiService';

interface AIGeneratedContent {
    status: 'idle' | 'loading' | 'success' | 'error';
    content: string;
}

const GrammarView: React.FC = () => {
    const [openLevel, setOpenLevel] = useState<string | null>(GRAMMAR_LEVELS[0]?.level || null);
    const [aiExamples, setAiExamples] = useState<Record<string, AIGeneratedContent>>({});

    const parseAIResponse = (text: string) => {
        return text
            .replace(/^\s*-\s/gm, '<li class="mt-3">')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br />');
    };

    const handleGenerateExamples = async (level: string, title: string, originalContent: string) => {
        const topicId = `${level}-${title}`;
        
        setAiExamples(prev => ({
            ...prev,
            [topicId]: { status: 'loading', content: '' }
        }));

        try {
            const cleanContent = originalContent.replace(/<[^>]*>?/gm, '');

            const prompt = `Với vai trò là một giáo viên Anh ngữ, hãy tạo thêm 3 ví dụ khác về chủ điểm ngữ pháp "${title}". Các ví dụ phải đơn giản, rõ ràng, phù hợp cho người học tiếng Việt và đi kèm bản dịch. Tránh lặp lại các ví dụ đã có trong phần giải thích sau: "${cleanContent}".

Hãy trả về dưới dạng danh sách markdown, mỗi ví dụ trên một dòng, như sau:
- \`They walk to school every morning.\`<br><em>(Họ đi bộ đến trường mỗi sáng.)</em>
- \`Does he play football?\`<br><em>(Anh ấy có chơi bóng đá không?)</em>

Chỉ trả về danh sách ví dụ, không thêm bất kỳ lời dẫn hay giải thích nào khác.`;

            let accumulatedText = '';
            
            // Use streaming for better perceived performance
            for await (const chunk of aiService.generateContentStream(
                AI_MODELS.FLASH,
                prompt,
                { temperature: 0.6 } // Slightly creative but still fast
            )) {
                accumulatedText += chunk;
                setAiExamples(prev => ({
                    ...prev,
                    [topicId]: { status: 'loading', content: accumulatedText }
                }));
            }

            setAiExamples(prev => ({
                ...prev,
                [topicId]: { status: 'success', content: accumulatedText }
            }));

        } catch (err) {
            console.error("Gemini example generation error:", err);
            setAiExamples(prev => ({
                ...prev,
                [topicId]: { status: 'error', content: 'Rất tiếc, đã có lỗi xảy ra khi tạo ví dụ.' }
            }));
        }
    };


    return (
        <div className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Cẩm nang Ngữ pháp</h1>
                <p className="mt-3 max-w-2xl mx-auto text-xl text-slate-500">
                    Tra cứu các chủ điểm ngữ pháp quan trọng theo từng cấp độ CEFR.
                </p>
            </div>

            <div className="space-y-4">
                {GRAMMAR_LEVELS.map(levelData => (
                    <details 
                        key={levelData.level} 
                        className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden"
                        open={openLevel === levelData.level}
                        onToggle={(e) => {
                           if ((e.target as HTMLDetailsElement).open) {
                               setOpenLevel(levelData.level);
                           }
                        }}
                    >
                        <summary className="p-5 font-bold text-xl text-slate-800 cursor-pointer list-none flex justify-between items-center hover:bg-slate-50">
                            {levelData.name}
                            <svg className="w-6 h-6 transform transition-transform duration-300 details-arrow" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </summary>
                        <div className="px-5 pb-5 border-t border-slate-200">
                            <div className="space-y-3 mt-4">
                                {levelData.topics.map((topic, index) => {
                                    const topicId = `${levelData.level}-${topic.title}`;
                                    const aiExampleState = aiExamples[topicId];

                                    return (
                                     <details key={index} className="bg-slate-50 border rounded-lg overflow-hidden">
                                        <summary className="p-3 font-semibold text-slate-700 cursor-pointer list-none flex justify-between items-center hover:bg-slate-100">
                                            {topic.title}
                                            <svg className="w-5 h-5 transform transition-transform duration-300 details-arrow" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                        </summary>
                                        <div 
                                            className="prose max-w-none p-4 border-t bg-white"
                                            dangerouslySetInnerHTML={{ __html: topic.content }}
                                        />
                                        <div className="p-4 border-t bg-slate-50/70">
                                            {(!aiExampleState || (aiExampleState.status !== 'loading' && aiExampleState.status !== 'success')) ? (
                                                aiExampleState?.status === 'error' ? (
                                                    <div>
                                                        <p className="text-sm text-red-600 mb-2">{aiExampleState.content}</p>
                                                        <button
                                                            onClick={() => handleGenerateExamples(levelData.level, topic.title, topic.content)}
                                                            className="text-sm font-semibold text-indigo-600 hover:underline"
                                                        >
                                                            Thử lại
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => handleGenerateExamples(levelData.level, topic.title, topic.content)}
                                                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-indigo-700 bg-indigo-100 rounded-lg hover:bg-indigo-200 transition-colors"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.62,1.62a1,1,0,0,0-1.24,0L1.62,8.38a1,1,0,0,0,0,1.24l6.76,6.76a1,1,0,0,0,1.24,0l6.76-6.76a1,1,0,0,0,0-1.24L9.62,1.62ZM8,4.5a1,1,0,0,1,1-1h.5a1,1,0,0,1,1,1V6H8Zm2,10V12a1,1,0,0,0-2,0v2.5a1,1,0,0,0,2,0Z" /></svg>
                                                        Thêm ví dụ từ AI
                                                    </button>
                                                )
                                            ) : (
                                                <div className="prose prose-sm max-w-none">
                                                    <h5 className="font-semibold text-slate-700 mb-2 not-prose">Ví dụ thêm từ AI:</h5>
                                                    <ul className="pl-0" dangerouslySetInnerHTML={{ __html: parseAIResponse(aiExampleState.content) }} />
                                                    {aiExampleState.status === 'loading' && <span className="inline-block w-2 h-4 bg-slate-600 animate-pulse ml-1"></span>}
                                                </div>
                                            )}
                                        </div>
                                     </details>
                                    );
                                })}
                            </div>
                        </div>
                    </details>
                ))}
            </div>
        </div>
    );
};

export default GrammarView;

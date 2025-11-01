import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import type { Word } from '../types';

// Simple parser to convert basic markdown to HTML for safe rendering
const parseSimpleMarkdown = (text: string) => {
    // Basic sanitization
    let safeText = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    return safeText
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
        .replace(/\n\s*-\s(.*?)(?=\n\s*-|\n\n|$)/g, '<li>$1</li>') // List items
        .replace(/<li>/g, '<li class="ml-5 list-disc">')
        .replace(/\n/g, '<br />'); // Newlines
};

// FIX: Defined the props interface for the component.
interface AIExplainModalProps {
  word: Word;
  onClose: () => void;
}

const AIExplainModal: React.FC<AIExplainModalProps> = ({ word, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isStreaming, setIsStreaming] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchExplanationStream = async () => {
      setIsLoading(true);
      setIsStreaming(false);
      setError(null);
      setExplanation('');
      
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Với vai trò là một giáo viên Anh ngữ, hãy giải thích từ tiếng Anh "${word.english}" (phát âm: ${word.pronunciation}) cho người học tiếng Việt một cách thật rõ ràng và dễ hiểu. Vui lòng trình bày bằng tiếng Việt và tuân thủ định dạng sau:

**Định nghĩa:**
- (Giải thích ý nghĩa chính của từ một cách ngắn gọn).

**Ví dụ:**
- (Một câu ví dụ đơn giản, dễ hiểu kèm bản dịch).
- (Một câu ví dụ phức tạp hơn hoặc trong một ngữ cảnh khác, kèm bản dịch).

**Từ đồng nghĩa:**
- (Liệt kê 2-3 từ đồng nghĩa phổ biến, nếu có).

**Từ trái nghĩa:**
- (Liệt kê 1-2 từ trái nghĩa phổ biến, nếu có).

Nếu không có từ đồng nghĩa hoặc trái nghĩa, hãy ghi "Không có".`;

        const responseStream = await ai.models.generateContentStream({
            model: 'gemini-1.5-flash',
            contents: prompt
        });
        
        setIsLoading(false);
        setIsStreaming(true);
        let accumulatedText = '';
        for await (const chunk of responseStream) {
            accumulatedText += chunk.text;
            setExplanation(accumulatedText);
        }
        setIsStreaming(false);

      } catch (err) {
        console.error("Gemini API Error:", err);
        setError("Rất tiếc, AI không thể phản hồi lúc này. Vui lòng thử lại sau.");
        setIsLoading(false);
        setIsStreaming(false);
      }
    };

  useEffect(() => {
    fetchExplanationStream();
  }, [word]);

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 pb-4 border-b">
          <h2 className="text-2xl font-bold text-slate-800">
            AI giải thích: <span className="text-blue-600">{word.english}</span>
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-3xl leading-none">&times;</button>
        </div>
        
        <div className="flex-grow overflow-y-auto pr-2">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full min-h-[200px]">
                <svg className="animate-spin h-8 w-8 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-slate-500">AI đang suy nghĩ...</p>
            </div>
          )}
          {error && (
            <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg">
              {error}
            </div>
          )}
          
          <div 
              className="text-slate-700 space-y-3 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: parseSimpleMarkdown(explanation) }} 
            />
          {/* Blinking cursor effect during streaming */}
          {isStreaming && <span className="inline-block w-2 h-5 bg-slate-700 animate-pulse ml-1"></span>}
        </div>

        <div className="mt-6 pt-4 border-t text-right">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIExplainModal;
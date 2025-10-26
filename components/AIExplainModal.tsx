import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import type { Word } from '../types';

interface AIExplainModalProps {
  word: Word;
  onClose: () => void;
}

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

const AIExplainModal: React.FC<AIExplainModalProps> = ({ word, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [explanation, setExplanation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isApiKeySelected, setIsApiKeySelected] = useState(false);

  const fetchExplanation = async () => {
      setIsLoading(true);
      setError(null);
      
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

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });

        setExplanation(response.text);
      } catch (err) {
        console.error("Gemini API Error:", err);
        const errorMessage = (err as any).message || '';
        if (errorMessage.includes('API key expired') || errorMessage.includes('API_KEY_INVALID')) {
            setError("API key của bạn không hợp lệ hoặc đã hết hạn. Vui lòng chọn một key mới.");
            setIsApiKeySelected(false);
        } else {
            setError("Rất tiếc, AI không thể phản hồi lúc này. Vui lòng thử lại sau.");
        }
      } finally {
        setIsLoading(false);
      }
    };

  useEffect(() => {
    const checkKeyAndFetch = async () => {
        setIsLoading(true);
        const hasKey = await window.aistudio?.hasSelectedApiKey();
        setIsApiKeySelected(hasKey);
        if (hasKey) {
            fetchExplanation();
        } else {
            setIsLoading(false);
        }
    };
    checkKeyAndFetch();
  }, [word]);
  
  const handleSelectKey = async () => {
    await window.aistudio.openSelectKey();
    // Assume success and re-fetch
    setIsApiKeySelected(true);
    fetchExplanation();
  };

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
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">&times;</button>
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
          {!isLoading && !error && isApiKeySelected && (
            <div 
              className="text-slate-700 space-y-3 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: parseSimpleMarkdown(explanation) }} 
            />
          )}
          {!isLoading && !isApiKeySelected && (
            <div className="text-center p-4 h-full flex flex-col items-center justify-center">
                <h3 className="text-lg font-bold text-slate-700 mb-2">Yêu cầu API Key</h3>
                <p className="text-slate-500 mb-4">Để nhận giải thích từ AI, bạn cần chọn API Key của mình.</p>
                <button
                    onClick={handleSelectKey}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg"
                >
                    Chọn API Key
                </button>
                 <p className="text-xs text-slate-500 mt-2">Tính năng này yêu cầu API key của riêng bạn. <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline">Tìm hiểu thêm về thanh toán</a>.</p>
            </div>
          )}
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

import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import type { User } from '../types';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface AIChatTutorViewProps {
  currentUser: User;
}

const parseMarkdown = (text: string) => {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code class="bg-slate-200 text-slate-800 px-1 py-0.5 rounded">$1</code>')
        .replace(/(\n\s*-\s)/g, '<br />- ')
        .replace(/\n/g, '<br />');
};


const AIChatTutorView: React.FC<AIChatTutorViewProps> = ({ currentUser }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const chatRef = useRef<Chat | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initChat = async () => {
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const systemInstruction = `You are an expert, friendly, and supportive English tutor named Gemini, specifically designed to help a Vietnamese learner. The user's current CEFR level is ${currentUser.level}.
- Your primary role is to be a conversational partner and an on-demand exercise generator.
- When chatting, keep your language slightly above the user's level to challenge them.
- When asked to create exercises (e.g., "create 5 multiple choice questions about present perfect"), create them directly in the chat.
- Always be encouraging and provide clear explanations.
- You can respond in a mix of English and Vietnamese to ensure understanding, but prioritize English.`;

            chatRef.current = ai.chats.create({
              model: 'gemini-2.5-flash',
              config: { systemInstruction },
            });
            
            // Send initial message via stream
            const initialStream = await chatRef.current.sendMessageStream({ message: "Hello, introduce yourself briefly and ask me what I want to learn today."});
            setIsLoading(false);
            
            let accumulatedText = '';
            setMessages([{ role: 'model', text: '' }]);

            for await (const chunk of initialStream) {
                accumulatedText += chunk.text;
                setMessages([{ role: 'model', text: accumulatedText }]);
            }

        } catch (err) {
            console.error("Chat initialization error:", err);
            setError("Không thể khởi tạo trợ lý AI. Vui lòng tải lại trang.");
            setIsLoading(false);
        }
    };
    initChat();
  }, [currentUser.level]);
  
  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !chatRef.current) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage, { role: 'model', text: '' }]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
        const stream = await chatRef.current.sendMessageStream({ message: userMessage.text });
        
        let accumulatedText = '';
        for await (const chunk of stream) {
            accumulatedText += chunk.text;
            setMessages(prev => {
                const updatedMessages = [...prev];
                updatedMessages[updatedMessages.length - 1].text = accumulatedText;
                return updatedMessages;
            });
        }
    } catch (err) {
        console.error("Send message error:", err);
        const errorMessageText = "I'm sorry, I encountered an error. Please try again.";
        setMessages(prev => {
             const updatedMessages = [...prev];
             if (updatedMessages.length > 0 && updatedMessages[updatedMessages.length - 1].role === 'model') {
                updatedMessages[updatedMessages.length - 1].text = errorMessageText;
                return updatedMessages;
             }
             return [...prev, { role: 'model', text: errorMessageText }];
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full max-w-4xl mx-auto p-4 h-[calc(100vh-180px)] animate-fade-in">
        <div className="flex-1 bg-white rounded-xl shadow-lg border p-4 flex flex-col">
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-6 pr-2">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        {msg.role === 'model' && (
                            <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center flex-shrink-0 font-bold shadow">AI</div>
                        )}
                        <div className={`max-w-lg p-4 rounded-2xl shadow-sm ${msg.role === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none'}`}>
                            {msg.role === 'model' && !msg.text && isLoading ? (
                                <div className="flex items-center gap-2">
                                   <span className="h-2.5 w-2.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                   <span className="h-2.5 w-2.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                   <span className="h-2.5 w-2.5 bg-indigo-500 rounded-full animate-bounce"></span>
                                </div>
                            ) : (
                                <>
                                    <p className="leading-relaxed" dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.text) }} />
                                    {msg.role === 'model' && isLoading && index === messages.length - 1 && (
                                        <span className="blinking-cursor"></span>
                                    )}
                                </>
                            )}
                        </div>
                         {msg.role === 'user' && (
                            <div className="w-10 h-10 rounded-full bg-slate-600 text-white flex items-center justify-center flex-shrink-0 font-bold shadow">
                                {currentUser.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                ))}
                 {error && <p className="text-red-500 text-center">{error}</p>}
            </div>
            <form onSubmit={handleSendMessage} className="mt-4 border-t pt-4">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Hỏi AI bất cứ điều gì hoặc yêu cầu tạo bài tập..."
                        className="w-full pl-4 pr-12 py-3 border-2 border-slate-300 rounded-full focus:ring-indigo-500 focus:border-indigo-500 transition"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="absolute inset-y-0 right-0 flex items-center justify-center w-12 text-indigo-600 disabled:text-slate-400 hover:bg-indigo-100 rounded-full"
                    >
                        <svg xmlns="http://www.w.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};

export default AIChatTutorView;
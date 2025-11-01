import React, { useState } from 'react';

interface SpeakerButtonProps {
    textToSpeak: string;
    ariaLabel: string;
}
const SpeakerButton: React.FC<SpeakerButtonProps> = ({ textToSpeak, ariaLabel }) => {
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlay = async () => {
        const cleanText = textToSpeak?.replace(/<[^>]*>?/gm, '').trim();
        if (isPlaying || !cleanText) return;
        
        setIsPlaying(true);

        // Use Browser's SpeechSynthesis API for stability
        if ('speechSynthesis' in window) {
            try {
                const utterance = new SpeechSynthesisUtterance(cleanText);
                utterance.lang = 'en-US';
                utterance.onend = () => {
                    setIsPlaying(false);
                };
                utterance.onerror = (event) => {
                    console.error('SpeechSynthesis Error:', event.error);
                    setIsPlaying(false);
                    alert('Không thể tạo âm thanh cho nội dung này.');
                };
                window.speechSynthesis.speak(utterance);
            } catch (speechError) {
                console.error("Browser Speech Synthesis Error:", speechError);
                setIsPlaying(false);
            }
        } else {
            setIsPlaying(false);
            alert('Trình duyệt của bạn không hỗ trợ chức năng đọc văn bản.');
        }
    };

    return (
        <button 
            onClick={handlePlay}
            disabled={isPlaying}
            className="text-slate-400 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-blue-50 disabled:text-slate-300 disabled:cursor-wait flex-shrink-0"
            aria-label={ariaLabel}
            title={ariaLabel}
        >
            {isPlaying ? (
                <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.929 5.757a1 1 0 011.414 0A5.983 5.983 0 0116 10a5.983 5.983 0 01-1.657 4.243 1 1 0 01-1.414-1.415A3.984 3.984 0 0014 10a3.984 3.984 0 00-1.071-2.828 1 1 0 010-1.415z" />
                </svg>
            )}
        </button>
    );
};

export default SpeakerButton;
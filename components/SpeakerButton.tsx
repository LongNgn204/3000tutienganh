import React, { useState } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";

interface SpeakerButtonProps {
    textToSpeak: string;
    ariaLabel: string;
}

// Helper functions for audio decoding
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}


const SpeakerButton: React.FC<SpeakerButtonProps> = ({ textToSpeak, ariaLabel }) => {
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlay = async () => {
        const cleanText = textToSpeak?.replace(/<[^>]*>?/gm, '').trim();
        if (isPlaying || !cleanText) return;
        
        setIsPlaying(true);
        let audioPlayed = false;

        // 1. Try Google Gemini TTS
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash-preview-tts",
                contents: [{ parts: [{ text: cleanText }] }],
                config: { responseModalities: [Modality.AUDIO] },
            });
            
            const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

            if (base64Audio) {
                const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
                const audioBuffer = await decodeAudioData(decode(base64Audio), audioContext, 24000, 1);
                const source = audioContext.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(audioContext.destination);
                source.start();
                audioPlayed = true;
                source.onended = () => {
                    setIsPlaying(false);
                    audioContext.close();
                };
            }
        } catch (error) {
            console.error("Gemini TTS Error:", error);
        }

        // 2. Fallback to Browser's SpeechSynthesis API
        if (!audioPlayed) {
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
                        // Final alert only if this also fails
                        alert('Không thể tạo âm thanh cho nội dung này.');
                    };
                    window.speechSynthesis.speak(utterance);
                    audioPlayed = true; // Mark as handled by fallback
                } catch (speechError) {
                    console.error("Browser Speech Synthesis Error:", speechError);
                }
            }
        }
        
        // 3. If both methods fail
        if (!audioPlayed) {
            alert('Không thể tạo âm thanh cho nội dung này. Văn bản có thể không được hỗ trợ.');
            setIsPlaying(false);
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
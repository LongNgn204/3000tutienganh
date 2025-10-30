import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from "@google/genai";
import type { Word, StudyProgress, User } from '../types';
import SpeakerButton from './SpeakerButton';

// Helper functions for shuffling array
const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

// Helper functions for audio encoding/decoding as per guidelines
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

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

function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}


interface ConversationViewProps {
  allWords: Word[];
  studyProgress: StudyProgress;
  currentUser: User | null;
  onGoalUpdate: () => void;
}

interface TranscriptItem {
    author: 'user' | 'ai';
    content: string;
}

const ConversationView: React.FC<ConversationViewProps> = ({ allWords, studyProgress, currentUser, onGoalUpdate }) => {
  const [stage, setStage] = useState<'setup' | 'chatting' | 'finished'>('setup');
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'listening' | 'error'>('disconnected');
  const [targetWords, setTargetWords] = useState<Word[]>([]);
  const [usedWords, setUsedWords] = useState<Set<string>>(new Set());
  const [transcript, setTranscript] = useState<TranscriptItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [enableVietnamese, setEnableVietnamese] = useState(true);
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [isMuted, setIsMuted] = useState(false);

  // Refs for managing Web Audio API and Gemini Live session
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const nextAudioStartTimeRef = useRef<number>(0);
  const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const outputNodeRef = useRef<GainNode | null>(null);
  
  // Refs for building transcriptions
  const currentInputTranscriptionRef = useRef('');
  const currentOutputTranscriptionRef = useRef('');

  useEffect(() => {
    if (outputNodeRef.current) {
        outputNodeRef.current.gain.value = isMuted ? 0 : 1;
    }
  }, [isMuted]);

  const stopConversation = () => {
    // Disconnect microphone processing
    if (scriptProcessorRef.current && mediaStreamSourceRef.current) {
        try {
            mediaStreamSourceRef.current.disconnect();
            scriptProcessorRef.current.disconnect();
        } catch (e) {
            // Ignore errors if already disconnected
        }
    }
    scriptProcessorRef.current = null;

    // Stop microphone stream
    mediaStreamRef.current?.getTracks().forEach(track => track.stop());
    mediaStreamRef.current = null;
    
    // Close session
    sessionPromiseRef.current?.then(session => session.close());
    sessionPromiseRef.current = null;
    
    // Disconnect output node
    if (outputNodeRef.current) {
        outputNodeRef.current.disconnect();
        outputNodeRef.current = null;
    }

    // Close AudioContexts
    inputAudioContextRef.current?.close().catch(console.error);
    outputAudioContextRef.current?.close().catch(console.error);
    inputAudioContextRef.current = null;
    outputAudioContextRef.current = null;
    
    // Reset state
    setConnectionStatus('disconnected');
    setStage('setup');
    setTranscript([]);
    setTargetWords([]);
    setUsedWords(new Set());
    currentInputTranscriptionRef.current = '';
    currentOutputTranscriptionRef.current = '';
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopConversation();
    };
  }, []);

  const handleStartConversation = async () => {
    setConnectionStatus('connecting');
    setError(null);
    onGoalUpdate();

    const wordsToReview = allWords.filter(w => studyProgress[w.english]?.srsLevel > 0);
    const wordsUnknown = allWords.filter(w => !studyProgress[w.english]);
    let potentialWords = [...wordsToReview, ...shuffleArray(wordsUnknown)];
    if (potentialWords.length < 3) {
      potentialWords = [...potentialWords, ...shuffleArray(allWords)];
    }
    const selectedWords = shuffleArray(Array.from(new Set(potentialWords))).slice(0, 3);

    if (selectedWords.length < 1) {
        setError("Không có đủ từ để bắt đầu. Hãy học thêm một vài từ nhé!");
        setConnectionStatus('error');
        return;
    }
    setTargetWords(selectedWords);
    setUsedWords(new Set());
    setTranscript([]);

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const wordList = selectedWords.map(w => w.english).join(', ');
        
        const difficultyMap = {
            beginner: 'A2',
            intermediate: 'B1',
            advanced: 'C1'
        };
        const selectedLevel = difficultyMap[difficulty];
        
        const translationInstruction = enableVietnamese 
            ? `You MUST ALWAYS respond in this exact format: First, speak the English sentence. Then, immediately say "In Vietnamese," followed by the Vietnamese translation. For example: "That's a great idea! In Vietnamese, đó là một ý tưởng tuyệt vời!".`
            : `You MUST respond ONLY in English. DO NOT provide any Vietnamese translation.`;

        const strictCorrectionRule = `**Correction Rule (VERY IMPORTANT):** If the user makes a clear grammatical or pronunciation mistake, you MUST briefly and politely interrupt them to correct it *before* continuing the conversation. For example, if they say "I go to the store yesterday," you should immediately say, "A quick correction, you should say 'I *went* to the store yesterday.' Please continue." This direct, immediate feedback is crucial for their learning.`;

        const systemInstruction = `You are Gem, a highly intelligent and strict English tutor. Your primary goal is to have a dynamic voice conversation with a Vietnamese learner.

**Initial Level:** The user's starting CEFR level is ${selectedLevel}. Begin the conversation at this level.

${strictCorrectionRule}

**Core Task:** The student's mission is to use these words: ${wordList}. Guide the conversation naturally to give them a chance to use these words.

**Language & Format:**
${translationInstruction}

Start the conversation by saying "Hello! How are you today?".`;

        inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        outputNodeRef.current = outputAudioContextRef.current.createGain();
        outputNodeRef.current.connect(outputAudioContextRef.current.destination);
        
        sessionPromiseRef.current = ai.live.connect({
            model: 'gemini-2.5-flash-native-audio-preview-09-2025',
            config: {
                systemInstruction,
                responseModalities: [Modality.AUDIO],
                inputAudioTranscription: {},
                outputAudioTranscription: {},
            },
            callbacks: {
                onopen: () => {
                    const source = inputAudioContextRef.current!.createMediaStreamSource(stream);
                    mediaStreamSourceRef.current = source;
                    const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
                    scriptProcessorRef.current = scriptProcessor;

                    scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                        const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                        const pcmBlob = createBlob(inputData);
                        sessionPromiseRef.current?.then((session) => {
                            if(session) session.sendRealtimeInput({ media: pcmBlob });
                        });
                    };
                    source.connect(scriptProcessor);
                    scriptProcessor.connect(inputAudioContextRef.current!.destination);
                    setConnectionStatus('listening');
                    setStage('chatting');
                },
                onmessage: async (message: LiveServerMessage) => {
                    if (message.serverContent?.inputTranscription) {
                        const text = message.serverContent.inputTranscription.text;
                        currentInputTranscriptionRef.current += text;
                        setTranscript(prev => {
                            const last = prev[prev.length - 1];
                            if (last?.author === 'user') {
                                return [...prev.slice(0, -1), { ...last, content: currentInputTranscriptionRef.current }];
                            }
                            return [...prev, { author: 'user', content: currentInputTranscriptionRef.current }];
                        });
                    }
                    if (message.serverContent?.outputTranscription) {
                        const text = message.serverContent.outputTranscription.text;
                        currentOutputTranscriptionRef.current += text;
                         setTranscript(prev => {
                            const last = prev[prev.length - 1];
                            if (last?.author === 'ai') {
                                return [...prev.slice(0, -1), { ...last, content: currentOutputTranscriptionRef.current }];
                            }
                            return [...prev, { author: 'ai', content: currentOutputTranscriptionRef.current }];
                        });
                    }
                    if (message.serverContent?.turnComplete) {
                        const newlyUsed = new Set(usedWords);
                        targetWords.forEach(word => {
                            if (!newlyUsed.has(word.english) && currentInputTranscriptionRef.current.toLowerCase().includes(word.english.toLowerCase())) {
                                newlyUsed.add(word.english);
                            }
                        });
                        setUsedWords(newlyUsed);

                        if (newlyUsed.size === selectedWords.length && stage !== 'finished') {
                           setTimeout(() => setStage('finished'), 2000);
                        }

                        currentInputTranscriptionRef.current = '';
                        currentOutputTranscriptionRef.current = '';
                    }

                    const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                    if (base64Audio && outputAudioContextRef.current && outputNodeRef.current) {
                        const outputCtx = outputAudioContextRef.current;
                        nextAudioStartTimeRef.current = Math.max(nextAudioStartTimeRef.current, outputCtx.currentTime);
                        const audioBuffer = await decodeAudioData(decode(base64Audio), outputCtx, 24000, 1);
                        const source = outputCtx.createBufferSource();
                        source.buffer = audioBuffer;
                        source.connect(outputNodeRef.current);
                        source.addEventListener('ended', () => audioSourcesRef.current.delete(source));
                        source.start(nextAudioStartTimeRef.current);
                        nextAudioStartTimeRef.current += audioBuffer.duration;
                        audioSourcesRef.current.add(source);
                    }
                    
                    if (message.serverContent?.interrupted) {
                        audioSourcesRef.current.forEach(source => source.stop());
                        audioSourcesRef.current.clear();
                        nextAudioStartTimeRef.current = 0;
                    }
                },
                onerror: (e) => {
                    console.error('Session Error:', e);
                    setError('Kết nối bị lỗi. Vui lòng thử lại.');
                    stopConversation();
                },
                onclose: () => {
                },
            },
        });

    } catch (err) {
        console.error("Setup Error:", err);
        setError("Không thể truy cập micro. Vui lòng kiểm tra quyền và thử lại.");
        setConnectionStatus('error');
    }
  };

  const highlightUsedWords = (text: string) => {
    const wordRegex = new RegExp(`\\b(${targetWords.map(w => w.english).join('|')})\\b`, 'gi');
    return text.replace(wordRegex, '<strong class="bg-yellow-200/80 text-yellow-900 px-1 py-0.5 rounded">$1</strong>');
  };
  
  if (stage === 'setup') {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full">
                <h2 className="text-3xl font-bold text-slate-800">AI Luyện Giao tiếp</h2>
                <p className="text-slate-600 mt-4 mb-6">Thực hành từ vựng bằng cách nói chuyện trực tiếp với AI. AI sẽ đưa ra một vài từ, và nhiệm vụ của bạn là sử dụng chúng trong cuộc hội thoại!</p>
                
                <div className="mb-6">
                    <label htmlFor="difficulty-select" className="block text-sm font-medium text-slate-700 mb-1 text-left">Chọn độ khó</label>
                    <select
                        id="difficulty-select"
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value as any)}
                        className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="beginner">Mới bắt đầu</option>
                        <option value="intermediate">Trung bình</option>
                        <option value="advanced">Nâng cao</option>
                    </select>
                </div>

                <div className="flex items-center justify-center mb-8">
                    <label className="flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={enableVietnamese}
                            onChange={(e) => setEnableVietnamese(e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        <span className="ms-3 text-sm font-medium text-slate-700">Bật bản dịch tiếng Việt</span>
                    </label>
                </div>

                {error && <p className="text-red-500 bg-red-50 p-3 rounded-md mb-4">{error}</p>}
                
                <button
                    onClick={handleStartConversation}
                    disabled={connectionStatus === 'connecting'}
                    className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-all transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-wait"
                >
                    {connectionStatus === 'connecting' ? 'Đang chuẩn bị...' : 'Bắt đầu Luyện tập'}
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col w-full max-w-4xl mx-auto p-4 h-[calc(100vh-180px)]">
        <div className="bg-white p-4 rounded-xl shadow-md border mb-4">
            <h3 className="text-md font-bold text-slate-700 text-center">Nhiệm vụ của bạn: Dùng các từ sau</h3>
            <div className="flex justify-center flex-wrap gap-3 mt-3">
                {targetWords.map(word => (
                    <span key={word.english} className={`px-3 py-1 text-sm rounded-full font-medium transition-all ${usedWords.has(word.english) ? 'bg-green-200 text-green-800 line-through' : 'bg-slate-200 text-slate-700'}`}>
                        {word.english}
                    </span>
                ))}
            </div>
        </div>
        <div className="flex-1 bg-white rounded-xl shadow-inner border p-4 overflow-y-auto space-y-4">
            {transcript.map((item, index) => (
                <div key={index} className={`flex items-start gap-3 ${item.author === 'user' ? 'justify-end' : 'justify-start'}`}>
                   {item.author === 'ai' && (
                       <>
                        <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold mt-1 shadow">AI</div>
                        <div className="max-w-md p-3 rounded-2xl shadow-sm bg-slate-100 text-slate-800 rounded-bl-none">
                            {(() => {
                                const fullText = item.content;
                                if (!enableVietnamese) {
                                    return <p className="leading-relaxed">{fullText}</p>;
                                }
                                
                                const separatorRegex = /in vietnamese,/i;
                                const matchIndex = fullText.search(separatorRegex);

                                let englishPart = fullText;
                                let vietnamesePart = '';

                                if (matchIndex !== -1) {
                                    englishPart = fullText.substring(0, matchIndex).trim();
                                    vietnamesePart = fullText.substring(matchIndex + "In Vietnamese,".length).trim().replace(/^:?\s*/, '');
                                }
                                
                                return (
                                    <>
                                        <p className="leading-relaxed">{englishPart}</p>
                                        {vietnamesePart && (
                                            <p className="text-sm text-slate-500 mt-2 pt-2 border-t border-slate-200/60 italic">{vietnamesePart}</p>
                                        )}
                                    </>
                                );
                            })()}
                            {item.content && <div className="mt-2 -mb-1 -mr-1 text-right"><SpeakerButton textToSpeak={item.content} ariaLabel="Nghe lại" /></div>}
                        </div>
                       </>
                   )}
                   {item.author === 'user' && (
                       <>
                        <div className="max-w-md p-3 rounded-2xl shadow-sm bg-blue-100 text-slate-800 rounded-br-none">
                            <p className="leading-relaxed" dangerouslySetInnerHTML={{ __html: highlightUsedWords(item.content) }}></p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold mt-1 shadow">BẠN</div>
                       </>
                   )}
                </div>
            ))}
            {stage === 'finished' && (
                <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
                    <h4 className="font-bold text-green-800 text-lg">Hoàn thành! 🎉</h4>
                    <p className="text-green-700">Bạn đã sử dụng tất cả các từ. Làm tốt lắm!</p>
                </div>
            )}
        </div>
        <div className="mt-4 flex flex-col items-center justify-center gap-4">
            <div className="flex items-center gap-4 p-2 bg-slate-100 rounded-full">
                <div className={`w-3 h-3 rounded-full ${connectionStatus === 'listening' ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></div>
                <p className="font-semibold text-slate-600 text-sm h-5 pr-2">
                    {connectionStatus === 'listening' && 'AI đang lắng nghe...'}
                    {connectionStatus === 'connecting' && 'Đang kết nối...'}
                    {connectionStatus === 'error' && 'Lỗi kết nối'}
                    {connectionStatus === 'disconnected' && 'Đã ngắt kết nối'}
                </p>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={() => setIsMuted(prev => !prev)}
                    disabled={connectionStatus !== 'listening'}
                    className="px-4 py-2 text-sm flex items-center gap-2 rounded-lg bg-slate-200 text-slate-600 disabled:opacity-50 hover:bg-slate-300"
                >
                    {isMuted ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.929 5.757a1 1 0 011.414 0A5.983 5.983 0 0116 10a5.983 5.983 0 01-1.657 4.243 1 1 0 01-1.414-1.415A3.984 3.984 0 0014 10a3.984 3.984 0 00-1.071-2.828 1 1 0 010-1.415z" /></svg>
                    )}
                    {isMuted ? "Bật tiếng" : "Tắt tiếng"}
                </button>
                <button onClick={stopConversation} className="px-4 py-2 text-sm flex items-center gap-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" /></svg>
                    Kết thúc
                </button>
            </div>
        </div>
    </div>
  );
};

export default ConversationView;
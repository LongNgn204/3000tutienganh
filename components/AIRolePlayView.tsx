import React, { useState, useEffect, useMemo, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from "@google/genai";
import { SCENARIOS } from './rolePlayScenarios';
import type { User } from '../types';
import SpeakerButton from './SpeakerButton';

export interface Scenario {
  id: string;
  title: string;
  description: string;
  goal: string;
  category: 'Du lịch' | 'Công việc' | 'Đời sống hàng ngày';
  icon: React.ReactNode;
  systemInstruction: string;
}

// Helper functions for audio encoding/decoding
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

interface TranscriptItem {
    author: 'user' | 'ai';
    content: string;
}

interface AIRolePlayViewProps {
  currentUser: User | null;
  onGoalUpdate: () => void;
}

const AIRolePlayView: React.FC<AIRolePlayViewProps> = ({ currentUser, onGoalUpdate }) => {
    const [stage, setStage] = useState<'selection' | 'chatting' | 'feedback'>('selection');
    const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
    const [transcript, setTranscript] = useState<TranscriptItem[]>([]);
    const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
    const [error, setError] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<string>('');
    const [isFetchingFeedback, setIsFetchingFeedback] = useState(false);

    // Refs for Web Audio API and Gemini Live session
    const sessionPromiseRef = useRef<Promise<any> | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const nextAudioStartTimeRef = useRef<number>(0);
    const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    
    const currentInputTranscriptionRef = useRef('');
    const currentOutputTranscriptionRef = useRef('');

    const stopSession = () => {
        if (scriptProcessorRef.current && mediaStreamSourceRef.current) {
            mediaStreamSourceRef.current.disconnect();
            scriptProcessorRef.current.disconnect();
        }
        mediaStreamRef.current?.getTracks().forEach(track => track.stop());
        sessionPromiseRef.current?.then(session => session.close()).catch(console.error);
        inputAudioContextRef.current?.close().catch(console.error);
        outputAudioContextRef.current?.close().catch(console.error);
        
        scriptProcessorRef.current = null;
        mediaStreamRef.current = null;
        sessionPromiseRef.current = null;
        inputAudioContextRef.current = null;
        outputAudioContextRef.current = null;
        setConnectionStatus('disconnected');
    };

    const getFeedback = async () => {
        if (!selectedScenario) return;
        setIsFetchingFeedback(true);
        setFeedback('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const transcriptText = transcript.map(t => `${t.author === 'ai' ? 'AI' : 'User'}: ${t.content}`).join('\n');
            const prompt = `As an English teacher, provide feedback for a student who completed a role-play scenario.
- Scenario: ${selectedScenario.title}
- Student's Goal: ${selectedScenario.goal}
- Conversation Transcript:
${transcriptText}

Provide feedback in Vietnamese in a single block of text. Start with a confirmation of whether they achieved the goal (e.g., "Chúc mừng! Bạn đã hoàn thành nhiệm vụ..."). Then, give a brief, encouraging evaluation and one or two clear suggestions for improvement. Keep it concise.`;
            
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setFeedback(response.text);
        } catch (err) {
            console.error("Feedback generation error:", err);
            setFeedback("Rất tiếc, không thể tạo nhận xét lúc này.");
        } finally {
            setIsFetchingFeedback(false);
        }
    };

    const handleStopAndGetFeedback = () => {
        stopSession();
        setStage('feedback');
        getFeedback();
    };

    const resetAndGoToSelection = () => {
        stopSession();
        setStage('selection');
        setSelectedScenario(null);
        setTranscript([]);
        setFeedback('');
    };

    useEffect(() => {
      return () => stopSession();
    }, []);

    const handleStartRolePlay = async (scenario: Scenario) => {
        setSelectedScenario(scenario);
        setConnectionStatus('connecting');
        setError(null);
        setTranscript([]);
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

            inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                config: {
                    systemInstruction: scenario.systemInstruction,
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

                        scriptProcessor.onaudioprocess = (audioEvent) => {
                            const inputData = audioEvent.inputBuffer.getChannelData(0);
                            const pcmBlob: Blob = {
                                data: encode(new Uint8Array(new Int16Array(inputData.map(x => x * 32768)).buffer)),
                                mimeType: 'audio/pcm;rate=16000',
                            };
                            sessionPromiseRef.current?.then(session => session.sendRealtimeInput({ media: pcmBlob }));
                        };
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(inputAudioContextRef.current!.destination);
                        setConnectionStatus('connected');
                        setStage('chatting');
                        onGoalUpdate();
                    },
                    onmessage: async (message: LiveServerMessage) => {
                         if (message.serverContent?.inputTranscription) {
                            currentInputTranscriptionRef.current += message.serverContent.inputTranscription.text;
                            setTranscript(prev => {
                                const last = prev[prev.length - 1];
                                return last?.author === 'user' ? [...prev.slice(0, -1), { ...last, content: currentInputTranscriptionRef.current }] : [...prev, { author: 'user', content: currentInputTranscriptionRef.current }];
                            });
                        }
                        if (message.serverContent?.outputTranscription) {
                            currentOutputTranscriptionRef.current += message.serverContent.outputTranscription.text;
                            setTranscript(prev => {
                                const last = prev[prev.length - 1];
                                return last?.author === 'ai' ? [...prev.slice(0, -1), { ...last, content: currentOutputTranscriptionRef.current }] : [...prev, { author: 'ai', content: currentOutputTranscriptionRef.current }];
                            });
                        }
                        if (message.serverContent?.turnComplete) {
                            currentInputTranscriptionRef.current = '';
                            currentOutputTranscriptionRef.current = '';
                        }
                        const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                        if (base64Audio && outputAudioContextRef.current) {
                            const outputCtx = outputAudioContextRef.current;
                            nextAudioStartTimeRef.current = Math.max(nextAudioStartTimeRef.current, outputCtx.currentTime);
                            const audioBuffer = await decodeAudioData(decode(base64Audio), outputCtx, 24000, 1);
                            const source = outputCtx.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(outputCtx.destination);
                            source.start(nextAudioStartTimeRef.current);
                            nextAudioStartTimeRef.current += audioBuffer.duration;
                        }
                    },
                    onerror: (e) => { console.error('Session Error:', e); setError('Kết nối bị lỗi.'); stopSession(); },
                    onclose: () => { setConnectionStatus('disconnected'); },
                },
            });
        } catch (err) {
            console.error("Mic/Setup Error:", err);
            setError("Không thể truy cập micro. Vui lòng kiểm tra quyền và thử lại.");
            setConnectionStatus('error');
        }
    };
    
    const groupedScenarios = useMemo(() => {
        return SCENARIOS.reduce((acc, scenario) => {
            const category = scenario.category || 'Other';
            (acc[category] = acc[category] || []).push(scenario);
            return acc;
        }, {} as Record<string, Scenario[]>);
    }, []);

    // Selection Stage
    if (stage === 'selection') {
        return (
            <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Tình huống nhập vai AI</h1>
                    <p className="mt-3 max-w-2xl mx-auto text-xl text-slate-500">
                        Chọn một kịch bản để thực hành kỹ năng giao tiếp trong các tình huống thực tế.
                    </p>
                </div>
                <div className="space-y-8">
                    {Object.entries(groupedScenarios).map(([category, scenarios]) => (
                        <div key={category}>
                            <h2 className="text-2xl font-bold text-slate-700 mb-4">{category}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {scenarios.map(scenario => (
                                    <div key={scenario.id} className="bg-white rounded-xl shadow-lg border border-slate-200 flex flex-col p-6 hover:-translate-y-1 hover:shadow-xl transition-all">
                                        <div className="flex items-center gap-4 mb-3">
                                            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">{scenario.icon}</div>
                                            <h3 className="text-lg font-bold text-slate-800">{scenario.title}</h3>
                                        </div>
                                        <p className="text-slate-600 text-sm flex-grow">{scenario.description}</p>
                                        <button onClick={() => handleStartRolePlay(scenario)} className="w-full mt-6 bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700">
                                            Bắt đầu
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    
    // Chatting Stage
    if (stage === 'chatting' && selectedScenario) {
        return (
            <div className="flex-1 flex flex-col w-full max-w-3xl mx-auto p-4 h-[calc(100vh-180px)]">
                <div className="bg-amber-50 border-2 border-amber-200 p-4 rounded-xl shadow-md mb-4 text-center">
                    <h3 className="text-md font-bold text-amber-800">Nhiệm vụ của bạn</h3>
                    <p className="text-amber-700">{selectedScenario.goal}</p>
                </div>
                <div className="flex-1 bg-white rounded-xl shadow-inner border p-4 overflow-y-auto space-y-4">
                    {transcript.map((item, index) => (
                         <div key={index} className={`flex items-start gap-3 ${item.author === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {item.author === 'ai' && <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold mt-1">AI</div>}
                            <div className={`max-w-md p-3 rounded-2xl shadow-sm ${item.author === 'user' ? 'bg-blue-100 text-slate-800 rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none'}`}>
                                <p>{item.content}</p>
                                {item.author === 'ai' && item.content && <div className="mt-2 -mb-1 -mr-1 text-right"><SpeakerButton textToSpeak={item.content} ariaLabel="Nghe lại" /></div>}
                            </div>
                            {item.author === 'user' && <div className="w-8 h-8 rounded-full bg-slate-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold mt-1">BẠN</div>}
                         </div>
                    ))}
                </div>
                <div className="mt-4 flex flex-col items-center justify-center gap-4">
                     <button onClick={handleStopAndGetFeedback} className="px-8 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors">
                        Hoàn thành & Nhận xét
                    </button>
                </div>
            </div>
        );
    }

    // Feedback Stage
    if (stage === 'feedback' && selectedScenario) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
                <div className="bg-white p-10 rounded-2xl shadow-xl max-w-2xl w-full">
                    <h2 className="text-3xl font-bold text-slate-800 mb-4">Kết thúc Tình huống!</h2>
                     <div className="text-left bg-slate-50 p-4 rounded-lg border min-h-[150px]">
                        <h3 className="font-semibold text-slate-800 mb-2">Nhận xét từ AI:</h3>
                        {isFetchingFeedback ? (
                             <p className="text-slate-500">Đang tạo nhận xét...</p>
                        ) : (
                             <p className="text-slate-700 whitespace-pre-wrap">{feedback}</p>
                        )}
                     </div>
                    <button onClick={resetAndGoToSelection} className="mt-8 w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg">
                        Thử kịch bản khác
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex-1 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-slate-200 border-b-indigo-500 rounded-full animate-spin"></div>
        </div>
    );
};

export default AIRolePlayView;
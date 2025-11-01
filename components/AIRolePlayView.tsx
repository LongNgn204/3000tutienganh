import React, { useState, useEffect, useMemo, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob, Type } from "@google/genai";
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

interface TranscriptItem {
    author: 'user' | 'ai';
    content: string;
}

interface RolePlayFeedback {
    goalAchieved: boolean;
    evaluation: string;
    suggestions: string[];
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
    const [feedback, setFeedback] = useState<RolePlayFeedback | null>(null);
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
        setFeedback(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const transcriptText = transcript.map(t => `${t.author === 'ai' ? 'AI' : 'User'}: ${t.content}`).join('\n');
            const prompt = `As a *strict* English teacher, provide *critical* feedback for a student who completed a role-play scenario. Focus on what they did wrong and how they can improve. Do not be overly encouraging. Be direct and honest. All feedback content must be in Vietnamese.
- Scenario: ${selectedScenario.title}
- Student's Goal: ${selectedScenario.goal}
- Conversation Transcript:
${transcriptText}`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            goalAchieved: { type: Type.BOOLEAN },
                            evaluation: { type: Type.STRING, description: "Critical evaluation in Vietnamese, focusing on weaknesses." },
                            suggestions: {
                                type: Type.ARRAY,
                                description: "1-2 direct, actionable suggestions for improvement in Vietnamese.",
                                items: { type: Type.STRING }
                            }
                        },
                        required: ['goalAchieved', 'evaluation', 'suggestions']
                    }
                }
            });
            const parsedFeedback = JSON.parse(response.text);
            setFeedback(parsedFeedback);
        } catch (err) {
            console.error("Feedback generation error:", err);
            setError("Rất tiếc, không thể tạo nhận xét lúc này.");
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
        setFeedback(null);
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

            const strictSystemInstruction = `You are a role-play partner but also a strict English teacher. ${scenario.systemInstruction} In addition to your role-play persona, you MUST correct the user's clear grammar or pronunciation mistakes immediately and politely before continuing. For example: "A quick correction, you should say '...'. Now, back to our conversation..."`;

            inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                config: {
                    systemInstruction: strictSystemInstruction,
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
                            const pcmBlob = createBlob(inputData);
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
    
     const renderMicButton = () => {
     let icon;
     let text;
     let colorClass;

     switch (connectionStatus) {
        case 'connecting':
            icon = <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;
            text = "Đang kết nối...";
            colorClass = "bg-slate-400 cursor-not-allowed";
            break;
        case 'connected':
            icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8h-1a6 6 0 11-12 0H3a7.001 7.001 0 006 6.93V17H7a1 1 0 100 2h6a1 1 0 100-2h-2v-2.07z" clipRule="evenodd" /></svg>;
            text = "AI đang lắng nghe...";
            colorClass = "bg-blue-600 animate-pulse";
            break;
        default: // disconnected or error
             icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>;
             text = "Đã ngắt kết nối";
             colorClass = "bg-red-500";
     }

     return (
        <div className="flex flex-col items-center gap-2">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg ${colorClass}`}>
              {icon}
          </div>
          <p className="font-semibold text-slate-600 text-sm">{text}</p>
        </div>
     );
  };


    // Selection Stage
    if (stage === 'selection') {
        return (
            <div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
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
                                        <p className="text-xs text-slate-500 mt-3 pt-3 border-t font-semibold">Mục tiêu: {scenario.goal}</p>
                                        <button onClick={() => handleStartRolePlay(scenario)} className="w-full mt-4 bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700">
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
                            {item.author === 'ai' && <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold mt-1 shadow">AI</div>}
                            <div className={`max-w-md p-3 rounded-2xl shadow-sm ${item.author === 'user' ? 'bg-blue-100 text-slate-800 rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none'}`}>
                                <p className="leading-relaxed">{item.content}</p>
                                {item.author === 'ai' && item.content && <div className="mt-2 -mb-1 -mr-1 text-right"><SpeakerButton textToSpeak={item.content} ariaLabel="Nghe lại" /></div>}
                            </div>
                            {item.author === 'user' && <div className="w-8 h-8 rounded-full bg-slate-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold mt-1 shadow">BẠN</div>}
                         </div>
                    ))}
                </div>
                <div className="mt-4 flex flex-col items-center justify-center gap-4">
                     {renderMicButton()}
                     <button onClick={handleStopAndGetFeedback} className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg text-sm hover:bg-red-700 transition-colors">
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
                    <h2 className="text-3xl font-bold text-slate-800 mb-6">Kết thúc Tình huống!</h2>
                     <div className="text-left bg-slate-50 p-6 rounded-lg border space-y-6">
                        {isFetchingFeedback ? (
                             <p className="text-slate-500 text-center">AI đang tạo nhận xét...</p>
                        ) : feedback ? (
                            <>
                                <div>
                                    <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">Mục tiêu</h3>
                                    <div className={`flex items-center gap-3 p-3 rounded-md text-sm font-semibold ${feedback.goalAchieved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {feedback.goalAchieved ? 
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                            : 
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                                        }
                                        <span>{feedback.goalAchieved ? "Bạn đã hoàn thành mục tiêu!" : "Mục tiêu chưa được hoàn thành."}</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 mb-2">Đánh giá chung</h3>
                                    <p className="text-slate-700 text-sm">{feedback.evaluation}</p>
                                </div>
                                {feedback.suggestions && feedback.suggestions.length > 0 && (
                                     <div>
                                        <h3 className="font-bold text-slate-800 mb-2">Gợi ý cải thiện</h3>
                                        <ul className="list-disc list-inside space-y-2 text-sm text-slate-700">
                                            {feedback.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                                        </ul>
                                    </div>
                                )}
                            </>
                        ) : <p className="text-red-600 text-center">{error}</p>}
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
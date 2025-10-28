import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import SpeakerButton from './SpeakerButton';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface Phoneme {
    symbol: string;
    type: 'vowel' | 'consonant';
    exampleWord: string;
    exampleIPA: string;
}

const IPA_DATA: Phoneme[] = [
    // Vowels
    { symbol: 'iː', type: 'vowel', exampleWord: 'sheep', exampleIPA: '/ʃiːp/' },
    { symbol: 'ɪ', type: 'vowel', exampleWord: 'ship', exampleIPA: '/ʃɪp/' },
    { symbol: 'ʊ', type: 'vowel', exampleWord: 'good', exampleIPA: '/ɡʊd/' },
    { symbol: 'uː', type: 'vowel', exampleWord: 'shoot', exampleIPA: '/ʃuːt/' },
    { symbol: 'e', type: 'vowel', exampleWord: 'bed', exampleIPA: '/bed/' },
    { symbol: 'ə', type: 'vowel', exampleWord: 'teacher', exampleIPA: '/ˈtiːtʃər/' },
    { symbol: 'ɜː', type: 'vowel', exampleWord: 'bird', exampleIPA: '/bɜːrd/' },
    { symbol: 'ɔː', type: 'vowel', exampleWord: 'door', exampleIPA: '/dɔːr/' },
    { symbol: 'æ', type: 'vowel', exampleWord: 'cat', exampleIPA: '/kæt/' },
    { symbol: 'ʌ', type: 'vowel', exampleWord: 'cup', exampleIPA: '/kʌp/' },
    { symbol: 'ɑː', type: 'vowel', exampleWord: 'father', exampleIPA: '/ˈfɑːðər/' },
    { symbol: 'ɒ', type: 'vowel', exampleWord: 'hot', exampleIPA: '/hɒt/' },
    // Diphthongs
    { symbol: 'eɪ', type: 'vowel', exampleWord: 'say', exampleIPA: '/seɪ/' },
    { symbol: 'aɪ', type: 'vowel', exampleWord: 'my', exampleIPA: '/maɪ/' },
    { symbol: 'ɔɪ', type: 'vowel', exampleWord: 'boy', exampleIPA: '/bɔɪ/' },
    { symbol: 'əʊ', type: 'vowel', exampleWord: 'go', exampleIPA: '/ɡəʊ/' },
    { symbol: 'aʊ', type: 'vowel', exampleWord: 'now', exampleIPA: '/naʊ/' },
    // Consonants
    { symbol: 'p', type: 'consonant', exampleWord: 'pen', exampleIPA: '/pen/' },
    { symbol: 'b', type: 'consonant', exampleWord: 'bad', exampleIPA: '/bæd/' },
    { symbol: 't', type: 'consonant', exampleWord: 'tea', exampleIPA: '/tiː/' },
    { symbol: 'd', type: 'consonant', exampleWord: 'did', exampleIPA: '/dɪd/' },
    { symbol: 'k', type: 'consonant', exampleWord: 'cat', exampleIPA: '/kæt/' },
    { symbol: 'ɡ', type: 'consonant', exampleWord: 'go', exampleIPA: '/ɡəʊ/' },
    { symbol: 'f', type: 'consonant', exampleWord: 'fall', exampleIPA: '/fɔːl/' },
    { symbol: 'v', type: 'consonant', exampleWord: 'van', exampleIPA: '/væn/' },
    { symbol: 'θ', type: 'consonant', exampleWord: 'think', exampleIPA: '/θɪŋk/' },
    { symbol: 'ð', type: 'consonant', exampleWord: 'this', exampleIPA: '/ðɪs/' },
    { symbol: 's', type: 'consonant', exampleWord: 'so', exampleIPA: '/səʊ/' },
    { symbol: 'z', type: 'consonant', exampleWord: 'zoo', exampleIPA: '/zuː/' },
    { symbol: 'ʃ', type: 'consonant', exampleWord: 'she', exampleIPA: '/ʃiː/' },
    { symbol: 'ʒ', type: 'consonant', exampleWord: 'vision', exampleIPA: '/ˈvɪʒn/' },
    { symbol: 'h', type: 'consonant', exampleWord: 'hat', exampleIPA: '/hæt/' },
    { symbol: 'm', type: 'consonant', exampleWord: 'man', exampleIPA: '/mæn/' },
    { symbol: 'n', type: 'consonant', exampleWord: 'no', exampleIPA: '/nəʊ/' },
    { symbol: 'ŋ', type: 'consonant', exampleWord: 'sing', exampleIPA: '/sɪŋ/' },
    { symbol: 'l', type: 'consonant', exampleWord: 'leg', exampleIPA: '/leɡ/' },
    { symbol: 'r', type: 'consonant', exampleWord: 'red', exampleIPA: '/red/' },
    { symbol: 'j', type: 'consonant', exampleWord: 'yes', exampleIPA: '/jes/' },
    { symbol: 'w', type: 'consonant', exampleWord: 'wet', exampleIPA: '/wet/' },
    { symbol: 'tʃ', type: 'consonant', exampleWord: 'chin', exampleIPA: '/tʃɪn/' },
    { symbol: 'dʒ', type: 'consonant', exampleWord: 'jam', exampleIPA: '/dʒæm/' },
];

interface Feedback {
    score: number;
    comment: string;
    specifics: { phoneme: string; feedback: string; }[];
}

interface IPAChartViewProps {
    onGoalUpdate: () => void;
}

const IPAChartView: React.FC<IPAChartViewProps> = ({ onGoalUpdate }) => {
    const [selectedPhoneme, setSelectedPhoneme] = useState<Phoneme | null>(null);
    const [status, setStatus] = useState<'idle' | 'listening' | 'analyzing' | 'feedback'>('idle');
    const [transcript, setTranscript] = useState('');
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [error, setError] = useState<string | null>(null);

    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setError('Trình duyệt của bạn không hỗ trợ nhận dạng giọng nói.');
            return;
        }
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.lang = 'en-US';
        recognitionRef.current.interimResults = false;

        const recognition = recognitionRef.current;
        recognition.onstart = () => {
            setStatus('listening');
            setTranscript('');
            setFeedback(null);
            setError(null);
        };
        recognition.onresult = (event: any) => {
            const finalTranscript = event.results[0][0].transcript;
            setTranscript(finalTranscript);
            callGeminiForFeedback(finalTranscript, selectedPhoneme);
        };
        recognition.onerror = (event: any) => {
            setError('Lỗi nhận dạng giọng nói: ' + event.error);
            setStatus('idle');
        };
        recognition.onend = () => {
            if (status === 'listening') {
              setStatus('idle');
            }
        };
    }, [selectedPhoneme]);

    const callGeminiForFeedback = async (userTranscript: string, target: Phoneme | null) => {
        if (!target) return;
        setStatus('analyzing');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `You are a meticulous, hard-to-please phonetics professor from Oxford. Your Vietnamese student is practicing a single English phoneme. Be extremely critical and academic in your feedback.
- Target Word: "${target.exampleWord}" (IPA: ${target.exampleIPA})
- Target Phoneme to evaluate: /${target.symbol}/
- User's utterance: "${userTranscript}"

Provide brutally honest feedback in Vietnamese as a JSON object. A score of 100 is reserved for absolute, native-speaker perfection. A score of 90 is excellent but still has a tiny flaw. Be very specific about tongue position, lip shape, or airflow if you detect any error in the target phoneme /${target.symbol}/.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            score: { type: Type.INTEGER, description: "A harsh score from 0-100." },
                            comment: { type: Type.STRING, description: "Critical overall feedback in Vietnamese." },
                            specifics: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: { phoneme: { type: Type.STRING }, feedback: { type: Type.STRING, description: "Detailed, technical feedback in Vietnamese." } }
                                }
                            }
                        },
                         required: ['score', 'comment', 'specifics']
                    }
                }
            });

            const parsedFeedback: Feedback = JSON.parse(response.text);
            setFeedback(parsedFeedback);
            onGoalUpdate();
        } catch (err) {
            setError("AI không thể phản hồi. Vui lòng thử lại.");
            console.error(err);
        } finally {
            setStatus('feedback');
        }
    };

    const handleMicClick = () => {
        if (status === 'listening') {
            recognitionRef.current?.stop();
        } else if (status === 'idle' || status === 'feedback') {
            recognitionRef.current?.start();
        }
    };
    
    const renderPhonemeGrid = (type: 'vowel' | 'consonant', title: string) => (
        <div>
            <h3 className="text-2xl font-bold text-slate-700 mb-4">{title}</h3>
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
                {IPA_DATA.filter(p => p.type === type).map(p => (
                    <button 
                        key={p.symbol}
                        onClick={() => setSelectedPhoneme(p)}
                        className={`p-4 border-2 rounded-lg text-2xl font-bold flex items-center justify-center transition-all ${selectedPhoneme?.symbol === p.symbol ? 'bg-indigo-600 text-white border-indigo-700' : 'bg-white border-slate-300 hover:border-indigo-500 hover:bg-indigo-50'}`}
                    >
                        /{p.symbol}/
                    </button>
                ))}
            </div>
        </div>
    );

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-500';
        if (score >= 50) return 'text-yellow-500';
        return 'text-red-500';
    };

    return (
        <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Bảng Phiên Âm IPA</h1>
                <p className="mt-3 max-w-3xl mx-auto text-xl text-slate-500">
                    Học và luyện tập phát âm chuẩn quốc tế với sự trợ giúp của AI.
                </p>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 space-y-8">
                    {renderPhonemeGrid('vowel', 'Nguyên âm (Vowels)')}
                    {renderPhonemeGrid('consonant', 'Phụ âm (Consonants)')}
                </div>
                
                <div className="xl:sticky xl:top-24 self-start">
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 min-h-[400px] flex flex-col">
                        <h2 className="text-xl font-bold text-slate-800 text-center mb-4">Luyện tập</h2>
                        {!selectedPhoneme ? (
                            <div className="flex-1 flex items-center justify-center text-center text-slate-500">
                                <p>Chọn một âm trong bảng để bắt đầu luyện tập.</p>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col justify-between">
                                <div className="text-center">
                                    <p className="font-semibold text-slate-600">Âm được chọn:</p>
                                    <p className="text-7xl font-bold text-indigo-600 my-2">/{selectedPhoneme.symbol}/</p>
                                    <div className="flex items-center justify-center gap-4 bg-slate-100 p-3 rounded-lg">
                                        <p className="text-xl font-semibold">{selectedPhoneme.exampleWord}</p>
                                        <p className="text-lg text-slate-500">{selectedPhoneme.exampleIPA}</p>
                                        <SpeakerButton textToSpeak={selectedPhoneme.exampleWord} ariaLabel={`Nghe từ ${selectedPhoneme.exampleWord}`} />
                                    </div>
                                </div>
                                <div className="flex flex-col items-center gap-3 my-4">
                                     <button 
                                        onClick={handleMicClick}
                                        disabled={status === 'analyzing'}
                                        className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-colors
                                            ${status === 'listening' ? 'bg-red-500 animate-pulse' : 'bg-indigo-600'}
                                        `}
                                    >
                                       <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8h-1a6 6 0 11-12 0H3a7.001 7.001 0 006 6.93V17H7a1 1 0 100 2h6a1 1 0 100-2h-2v-2.07z" clipRule="evenodd" /></svg>
                                    </button>
                                    <p className="h-5 text-sm font-semibold text-slate-600">
                                        {status === 'listening' && 'Đang nghe...'}
                                        {status === 'analyzing' && 'AI đang phân tích...'}
                                        {(status === 'idle' || status === 'feedback') && 'Nhấn để nói'}
                                    </p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-lg min-h-[120px]">
                                    <h4 className="font-semibold text-sm text-slate-700 mb-1">Kết quả:</h4>
                                    {status === 'analyzing' && <p className="text-slate-500">Đang chờ phản hồi từ AI...</p>}
                                    {error && <p className="text-red-500">{error}</p>}
                                    {transcript && <p className="text-slate-600 italic">Bạn đã nói: "{transcript}"</p>}
                                    {feedback && (
                                        <div className="mt-2 space-y-2">
                                            <p className={`font-bold text-lg ${getScoreColor(feedback.score)}`}>Điểm: {feedback.score}/100</p>
                                            <p className="text-sm">{feedback.comment}</p>
                                            {feedback.specifics?.map((s, i) => (
                                                <p key={i} className="text-sm bg-yellow-100 p-1 rounded"><strong>{s.phoneme}:</strong> {s.feedback}</p>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IPAChartView;
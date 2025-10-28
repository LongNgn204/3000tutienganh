import React, { useState, useEffect } from 'react';
import type { User, ListeningExercise, CEFRLevel } from '../types';
import SpeakerButton from './SpeakerButton';
import { CONTENT_LIBRARY } from '../contentLibrary';
import { GoogleGenAI } from '@google/genai';

interface ListeningViewProps {
  currentUser: User | null;
  onGoalUpdate: () => void;
}

const ListeningQuiz: React.FC<{ exercise: ListeningExercise, onComplete: () => void }> = ({ exercise, onComplete }) => {
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [showResults, setShowResults] = useState(false);

    const handleAnswer = (qIndex: number, option: string) => {
        setAnswers(prev => ({ ...prev, [qIndex]: option }));
    };

    const score = Object.entries(answers).reduce((acc, [qIndex, answer]) => {
        return exercise.questions[parseInt(qIndex)].answer === answer ? acc + 1 : acc;
    }, 0);

    return (
        <div className="mt-8 pt-6 border-t">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Câu hỏi nghe hiểu</h3>
            {exercise.questions.map((q, qIndex) => (
                <div key={qIndex} className="mb-6 p-4 border rounded-lg bg-slate-50">
                    <p className="font-semibold text-slate-700">{qIndex + 1}. {q.question}</p>
                    <div className="mt-3 space-y-2">
                        {q.options.map(option => {
                            const isSelected = answers[qIndex] === option;
                            const isCorrect = showResults && q.answer === option;
                            const isIncorrect = showResults && isSelected && q.answer !== option;
                            let styles = 'border-slate-300 hover:bg-slate-100';
                            if (isIncorrect) styles = 'bg-red-100 border-red-300';
                            else if (isCorrect) styles = 'bg-green-100 border-green-300';
                            else if (isSelected) styles = 'bg-blue-100 border-blue-300';
                            
                            return (
                                <button key={option} onClick={() => !showResults && handleAnswer(qIndex, option)} disabled={showResults} className={`block w-full text-left p-3 border rounded-md transition-colors ${styles}`}>
                                    {option}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}
            {!showResults && (
                <button onClick={() => setShowResults(true)} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700">Kiểm tra đáp án</button>
            )}
            {showResults && (
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <h4 className="text-xl font-bold text-blue-800">Bạn đã trả lời đúng {score}/{exercise.questions.length} câu!</h4>
                    <button onClick={onComplete} className="mt-4 px-6 py-2 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-800">Quay lại</button>
                </div>
            )}
        </div>
    );
};


const ListeningView: React.FC<ListeningViewProps> = ({ currentUser, onGoalUpdate }) => {
    const [mode, setMode] = useState<'selection' | 'guided' | 'random-speak'>('selection');
    const [selectedExercise, setSelectedExercise] = useState<ListeningExercise | null>(null);
    const [randomSentence, setRandomSentence] = useState('');
    const [isFetching, setIsFetching] = useState(false);
    const [showTranscript, setShowTranscript] = useState(false);

    const handleSelectExercise = (exercise: ListeningExercise) => {
        setSelectedExercise(exercise);
        setShowTranscript(false);
        setMode('guided');
    };
    
    const getNewRandomSentence = async () => {
        setMode('random-speak');
        setIsFetching(true);
        setRandomSentence('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const userLevel = currentUser?.level || 'A2';
            const prompt = `Create one simple, complete English sentence for a ${userLevel}-level Vietnamese learner to practice listening. Just return the sentence itself.`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setRandomSentence(response.text.trim());
        } catch (err) {
            console.error("Gemini Sentence Generation Error:", err);
            setRandomSentence("Could not fetch a new sentence.");
        } finally {
            setIsFetching(false);
        }
    };
    
    const exercisesByLevel = CONTENT_LIBRARY.listening.filter(e => e.level === currentUser?.level);

    if (mode === 'selection') {
        return (
            <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-slate-800">Luyện Nghe</h2>
                    <p className="text-lg text-slate-600 mt-2">Nâng cao kỹ năng nghe hiểu qua các bài tập thực tế.</p>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-2xl shadow-lg border text-center">
                        <h3 className="text-2xl font-bold text-slate-800">Luyện tập có hướng dẫn</h3>
                        <p className="text-slate-600 my-4">Nghe các đoạn hội thoại được biên soạn sẵn và trả lời câu hỏi trắc nghiệm.</p>
                        <h4 className="font-semibold text-slate-700 mb-3">Chọn bài nghe (Trình độ {currentUser?.level}):</h4>
                        <div className="space-y-3">
                            {exercisesByLevel.length > 0 ? exercisesByLevel.map(ex => (
                                <button key={ex.id} onClick={() => handleSelectExercise(ex)} className="w-full text-left p-3 border rounded-md hover:bg-slate-100 hover:border-indigo-400">
                                    {ex.title}
                                </button>
                            )) : <p className="text-slate-500">Chưa có bài tập cho trình độ này.</p>}
                        </div>
                    </div>
                     <div className="bg-white p-8 rounded-2xl shadow-lg border text-center flex flex-col justify-center items-center">
                        <h3 className="text-2xl font-bold text-slate-800">Luyện nghe ngẫu nhiên</h3>
                        <p className="text-slate-600 my-4">Nghe các câu ngẫu nhiên do AI tạo ra để thử thách khả năng nghe của bạn.</p>
                        <button onClick={getNewRandomSentence} className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700">Bắt đầu</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col items-center justify-start p-4 sm:p-6 lg:px-8 py-8 w-full animate-fade-in">
            <div className="w-full max-w-3xl">
                <button onClick={() => setMode('selection')} className="mb-6 font-semibold text-indigo-600 hover:underline">‹ Quay lại chọn chế độ</button>
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
                    {mode === 'guided' && selectedExercise && (
                        <div>
                            <h2 className="text-3xl font-bold text-slate-800 mb-4">{selectedExercise.title}</h2>
                            <div className="flex items-center gap-4 bg-slate-100 p-4 rounded-lg">
                                <SpeakerButton textToSpeak={selectedExercise.transcript} ariaLabel="Nghe bài hội thoại"/>
                                <p className="text-slate-600">Nhấn nút loa để nghe bài hội thoại.</p>
                            </div>
                            <div className="mt-4">
                                <button onClick={() => setShowTranscript(!showTranscript)} className="text-sm font-semibold text-indigo-600 hover:underline">
                                    {showTranscript ? 'Ẩn nội dung' : 'Hiện nội dung bài nghe'}
                                </button>
                                {showTranscript && <p className="mt-2 p-4 bg-gray-50 rounded border text-slate-700 whitespace-pre-wrap">{selectedExercise.transcript}</p>}
                            </div>
                            <ListeningQuiz exercise={selectedExercise} onComplete={() => {
                                onGoalUpdate();
                                setMode('selection');
                            }} />
                        </div>
                    )}
                    {mode === 'random-speak' && (
                        <div className="text-center">
                             <h2 className="text-2xl font-bold text-slate-800 mb-4">Luyện nghe câu ngẫu nhiên</h2>
                             {isFetching ? <p>Đang tạo câu...</p> : (
                                <div className="flex items-center justify-center gap-4 bg-slate-100 p-6 rounded-lg">
                                    <SpeakerButton textToSpeak={randomSentence} ariaLabel="Nghe câu"/>
                                    <p className="text-xl font-semibold text-indigo-800">"{randomSentence}"</p>
                                </div>
                             )}
                              <div className="mt-8">
                                <button onClick={getNewRandomSentence} className="px-6 py-2 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-800">
                                    Tạo câu khác
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ListeningView;
import React, { useState, useEffect, useMemo } from 'react';
import type { Word, Category } from '../types';

interface QuizViewProps {
  allWords: Word[]; // All words for generating options
  wordsForQuiz: Word[]; // Words to be tested, possibly filtered by search
  categories: Category[];
}

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const QuizView: React.FC<QuizViewProps> = ({ allWords, wordsForQuiz, categories }) => {
  const [quizState, setQuizState] = useState<'setup' | 'playing' | 'result'>('setup');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [numQuestions, setNumQuestions] = useState(10);
  
  const [questions, setQuestions] = useState<Word[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const startQuiz = () => {
    let availableWords = wordsForQuiz;
    if (selectedCategory !== 'all') {
      const category = categories.find(c => c.id === selectedCategory);
      if (category) {
        const categoryWords = new Set(category.words.map(w => w.english));
        availableWords = wordsForQuiz.filter(w => categoryWords.has(w.english));
      }
    }

    if (availableWords.length === 0) {
        alert("Không có từ nào trong chủ đề này để tạo bài kiểm tra. Vui lòng chọn chủ đề khác.");
        return;
    }

    const shuffledWords = shuffleArray(availableWords);
    const selectedQuestions = shuffledWords.slice(0, numQuestions);
    setQuestions(selectedQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setQuizState('playing');
  };

  const currentQuestion = questions[currentQuestionIndex];

  const options = useMemo(() => {
    if (!currentQuestion) return [];
    const incorrectAnswers = allWords
      .filter(w => w.english !== currentQuestion.english)
      .map(w => w.vietnamese);
    
    const shuffledIncorrect = shuffleArray(incorrectAnswers).slice(0, 3);
    return shuffleArray([...shuffledIncorrect, currentQuestion.vietnamese]);
  }, [currentQuestion, allWords]);

  const handleAnswerClick = (answer: string) => {
    if (selectedAnswer) return;

    setSelectedAnswer(answer);
    if (answer === currentQuestion.vietnamese) {
      setScore(prev => prev + 1);
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    } else {
      setQuizState('result');
    }
  };
  
  if (quizState === 'setup') {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Tùy chỉnh bài luyện tập</h2>
                <div className="space-y-4 text-left">
                    <div>
                        <label htmlFor="quiz-category" className="block text-sm font-medium text-slate-700 mb-1">Chọn chủ đề</label>
                        <select 
                            id="quiz-category"
                            value={selectedCategory}
                            onChange={e => setSelectedCategory(e.target.value)}
                            className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">Tất cả chủ đề</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="quiz-num-questions" className="block text-sm font-medium text-slate-700 mb-1">Số lượng câu hỏi</label>
                        <select 
                            id="quiz-num-questions"
                            value={numQuestions}
                            onChange={e => setNumQuestions(Number(e.target.value))}
                            className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value={10}>10 câu</option>
                            <option value={20}>20 câu</option>
                            <option value={50}>50 câu</option>
                        </select>
                    </div>
                </div>
                <button
                    onClick={startQuiz}
                    className="mt-8 w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-transform transform hover:scale-105"
                >
                    Bắt đầu
                </button>
            </div>
        </div>
    );
  }
  
  if (quizState === 'result') {
    const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full">
                <h2 className="text-3xl font-bold text-slate-800 mb-4">Hoàn thành!</h2>
                <p className="text-lg text-slate-600 mb-6">
                    Bạn đã trả lời đúng <span className="font-bold text-blue-600">{score}</span> trên <span className="font-bold">{questions.length}</span> câu hỏi.
                </p>
                <div className="w-full bg-slate-200 rounded-full h-4 mb-6">
                    <div className="bg-blue-600 h-4 rounded-full" style={{ width: `${percentage}%` }}></div>
                </div>
                <button
                    onClick={() => setQuizState('setup')}
                    className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-transform transform hover:scale-105"
                >
                    Chơi lại
                </button>
            </div>
        </div>
    );
  }

  if (!currentQuestion) {
    return <div className="text-center p-8">Đang tải câu hỏi...</div>;
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 w-full">
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-2xl">
        <p className="text-center text-slate-500 font-semibold mb-2">Câu {currentQuestionIndex + 1}/{questions.length}</p>
        <div className="h-1 w-full bg-slate-200 rounded-full mb-8">
            <div className="h-1 bg-blue-500 rounded-full" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>
        </div>

        <p className="text-center text-slate-600 mb-4">Từ nào có nghĩa là:</p>
        <h2 className="text-5xl font-bold text-center text-slate-800 mb-8">{currentQuestion.english}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {options.map(option => {
            const isSelected = selectedAnswer === option;
            const isTheCorrectAnswer = option === currentQuestion.vietnamese;
            
            let buttonClass = 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700';
            if (selectedAnswer) {
              if (isTheCorrectAnswer) {
                buttonClass = 'bg-green-500 border-green-600 text-white';
              } else if (isSelected) {
                buttonClass = 'bg-red-500 border-red-600 text-white';
              } else {
                buttonClass = 'bg-white border-slate-300 text-slate-700 opacity-60';
              }
            }

            return (
              <button
                key={option}
                onClick={() => handleAnswerClick(option)}
                disabled={!!selectedAnswer}
                className={`w-full p-4 rounded-lg border-2 text-lg font-semibold transition-all duration-300 ${buttonClass} disabled:cursor-not-allowed`}
              >
                {option}
              </button>
            );
          })}
        </div>
        
        {selectedAnswer && (
            <div className="mt-8 text-center">
                <button
                    onClick={handleNextQuestion}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-transform transform hover:scale-105"
                >
                    {currentQuestionIndex < questions.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default QuizView;
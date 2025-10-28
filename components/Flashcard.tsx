import React, { useState } from 'react';
import type { Word, StudyRecord } from '../types';
import SpeakerButton from './SpeakerButton';

interface FlashcardProps {
  word: Word;
  onAnswer: (word: Word, performance: 'again' | 'good' | 'easy') => void;
  studyRecord?: StudyRecord;
}

const Flashcard: React.FC<FlashcardProps> = ({ word, onAnswer, studyRecord }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const englishExample = word.example.split('(')[0].trim();
  const vietnameseExample = word.example.match(/\(([^)]+)\)/)?.[1] || '';

  const handleAnswerClick = (e: React.MouseEvent, performance: 'again' | 'good' | 'easy') => {
      e.stopPropagation(); // Prevent re-triggering the card click
      onAnswer(word, performance);
  }
  
  const cardStyles = {
    new: 'border-blue-500',
    learning: 'border-yellow-500',
    graduated: 'border-green-500',
  };

  const getCardStatus = () => {
      if (!studyRecord || studyRecord.srsLevel === 0) return 'new';
      if (studyRecord.srsLevel > 0 && studyRecord.srsLevel < 5) return 'learning';
      return 'graduated';
  }

  const currentStyle = cardStyles[getCardStatus()];

  const AnswerButton: React.FC<{
    onClick: (e: React.MouseEvent) => void;
    colorClasses: string;
    title: string;
    label: string;
    children: React.ReactNode;
  }> = ({ onClick, colorClasses, title, label, children }) => (
    <button
      onClick={onClick}
      className={`flex-1 flex flex-col items-center justify-center p-3 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 hover:shadow-lg ${colorClasses}`}
      aria-label={label}
      title={title}
    >
      {children}
    </button>
  );

  return (
    <div 
        className={`w-full h-full bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-lifted border-b-4 ${currentStyle} flex flex-col p-6 md:p-8 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]`}
        onClick={() => !isRevealed && setIsRevealed(true)}
    >
        <div 
          className="absolute top-0 left-0 bottom-0 w-2" 
          style={{ backgroundColor: word.color }}
          aria-hidden="true"
        ></div>
        
        {/* Top Part (Word Info) */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-x-3">
            <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded-full border border-slate-200">{word.type}</span>
            <p className="text-lg text-slate-500 italic">{word.pronunciation}</p>
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <SpeakerButton textToSpeak={word.english} ariaLabel={`Phát âm từ ${word.english}`} />
          </div>
        </div>

        {/* Main Content (The Word) */}
        <div className="flex-grow flex items-center justify-center cursor-pointer">
            <h2 className="text-6xl md:text-7xl font-extrabold text-slate-800 tracking-tight text-center">{word.english}</h2>
        </div>
        
        {/* Bottom Part (Meaning & Actions) */}
        <div className="h-[180px] flex flex-col justify-end">
            {!isRevealed ? (
                <div className="text-center text-slate-500 opacity-80 cursor-pointer">
                    <p>Nhấn để xem nghĩa</p>
                </div>
            ) : (
                <div className="text-center animate-fade-in-up">
                    <h3 className="text-4xl md:text-5xl font-bold text-slate-800">{word.vietnamese}</h3>
                    {englishExample && (
                        <div className="mt-2 text-slate-500">
                            <p>{englishExample}</p>
                            {vietnameseExample && <p className="text-sm italic">({vietnameseExample})</p>}
                        </div>
                    )}
                    <div className="w-full flex justify-center gap-x-2 sm:gap-x-4 mt-6">
                       <AnswerButton
                          onClick={(e) => handleAnswerClick(e, 'again')}
                          colorClasses="bg-red-500 hover:bg-red-600 text-white"
                          title="Học lại (trong 10 phút)"
                          label="Đánh dấu học lại"
                       >
                           <span className="font-bold text-lg">Lại</span>
                           <span className="text-xs opacity-80">{'< 10 phút'}</span>
                       </AnswerButton>
                       <AnswerButton 
                          onClick={(e) => handleAnswerClick(e, 'good')}
                          colorClasses="bg-blue-500 hover:bg-blue-600 text-white"
                          title="Tốt (ôn lại sau)"
                          label="Đánh dấu Tốt"
                        >
                           <span className="font-bold text-lg">Tốt</span>
                           <span className="text-xs opacity-80">...</span>
                       </AnswerButton>
                        <AnswerButton 
                          onClick={(e) => handleAnswerClick(e, 'easy')}
                          colorClasses="bg-green-500 hover:bg-green-600 text-white"
                          title="Dễ (ôn lại sau một thời gian dài)"
                          label="Đánh dấu Dễ"
                        >
                           <span className="font-bold text-lg">Dễ</span>
                           <span className="text-xs opacity-80">...</span>
                       </AnswerButton>
                   </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default Flashcard;
import React, { useState } from 'react';
import type { Word, StudyRecord } from '../types';
import SpeakerButton from './SpeakerButton';

interface FlashcardProps {
  word: Word;
  onAnswer: (word: Word, performance: 'again' | 'good' | 'easy') => void;
  studyRecord?: StudyRecord;
}

const Flashcard: React.FC<FlashcardProps> = ({ word, onAnswer, studyRecord }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const englishExample = word.example.split('(')[0].trim();
  const vietnameseExample = word.example.match(/\(([^)]+)\)/)?.[1] || '';

  const handleAnswer = (e: React.MouseEvent, performance: 'again' | 'good' | 'easy') => {
      e.stopPropagation(); // Prevent card from flipping back
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

  return (
    <div className="flashcard-container w-full h-full transition-transform duration-300 hover:scale-105" onClick={() => setIsFlipped(!isFlipped)}>
      <div className={`flashcard relative w-full h-full rounded-2xl shadow-2xl cursor-pointer ${isFlipped ? 'is-flipped' : ''}`}>
        {/* Front Face */}
        <div className={`flashcard-face absolute w-full h-full bg-white border-4 ${currentStyle} rounded-2xl flex flex-col justify-between p-6 md:p-8 overflow-hidden`}>
            <div 
              className="absolute top-0 left-0 bottom-0 w-2.5" 
              style={{ backgroundColor: word.color }}
              aria-hidden="true"
            ></div>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-x-3">
                <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{word.type}</span>
                <p className="text-lg text-slate-500 italic">{word.pronunciation}</p>
              </div>
              <div onClick={(e) => e.stopPropagation()}>
                <SpeakerButton textToSpeak={word.english} ariaLabel={`Phát âm từ ${word.english}`} />
              </div>
            </div>
          
            <div className="text-center my-auto">
              <h2 className="text-6xl md:text-7xl font-extrabold text-slate-800 tracking-tight">{word.english}</h2>
            </div>
            
            <div className="text-center text-slate-600">
                <p>{isFlipped ? '' : 'Nhấn để xem nghĩa'}</p>
            </div>
        </div>

        {/* Back Face */}
        <div className={`flashcard-face flashcard-back absolute w-full h-full bg-slate-800 rounded-2xl flex flex-col justify-between items-center p-6 md:p-8`}>
            <div className="text-center my-auto">
                <h3 className="text-5xl md:text-6xl font-bold text-white text-center">{word.vietnamese}</h3>
                {englishExample && (
                    <div className="mt-6 text-slate-300">
                        <p>{englishExample}</p>
                        {vietnameseExample && <p className="text-sm text-slate-400 mt-1 italic">({vietnameseExample})</p>}
                    </div>
                )}
            </div>
           
           <div className="w-full flex justify-center gap-x-2 sm:gap-x-4">
               <button 
                  onClick={(e) => handleAnswer(e, 'again')}
                  className="px-4 py-2 sm:px-6 sm:py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg shadow-lg transition-transform transform hover:scale-105"
                  aria-label="Đánh dấu học lại"
                  title="Học lại (trong 1 phút)"
               >
                   Lại
               </button>
               <button 
                  onClick={(e) => handleAnswer(e, 'good')}
                  className="px-4 py-2 sm:px-6 sm:py-3 bg-yellow-500 hover:bg-yellow-600 text-yellow-900 font-bold rounded-lg shadow-lg transition-transform transform hover:scale-105"
                  aria-label="Đánh dấu Tốt"
                  title="Tốt (ôn lại sau)"
                >
                   Tốt
               </button>
                <button 
                  onClick={(e) => handleAnswer(e, 'easy')}
                  className="px-4 py-2 sm:px-6 sm:py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow-lg transition-transform transform hover:scale-105"
                  aria-label="Đánh dấu Dễ"
                  title="Dễ (ôn lại sau một thời gian dài)"
                >
                   Dễ
               </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
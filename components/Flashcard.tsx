import React, { useState } from 'react';
import type { Word, StudyStatus } from '../types';
import SpeakerButton from './SpeakerButton';

interface FlashcardProps {
  word: Word;
  onMarkWord: (word: Word, status: StudyStatus) => void;
  studyStatus?: StudyStatus;
}

const Flashcard: React.FC<FlashcardProps> = ({ word, onMarkWord, studyStatus }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const englishExample = word.example.split('(')[0].trim();
  const vietnameseExample = word.example.match(/\(([^)]+)\)/)?.[1] || '';

  const handleMark = (e: React.MouseEvent, status: StudyStatus) => {
      e.stopPropagation(); // Prevent card from flipping back
      onMarkWord(word, status);
  }
  
  const cardStyles = {
    unknown: {
      frontBorder: 'border-blue-500',
      backBg: 'bg-blue-600',
    },
    known: {
      frontBorder: 'border-green-500',
      backBg: 'bg-green-600',
    },
    review: {
      frontBorder: 'border-yellow-500',
      backBg: 'bg-yellow-500',
    }
  };

  const currentStyle = cardStyles[studyStatus || 'unknown'];

  return (
    <div className="flashcard-container w-full h-full transition-transform duration-300 hover:scale-105" onClick={() => setIsFlipped(!isFlipped)}>
      <div className={`flashcard relative w-full h-full rounded-2xl shadow-2xl cursor-pointer ${isFlipped ? 'is-flipped' : ''}`}>
        {/* Front Face */}
        <div className={`flashcard-face absolute w-full h-full bg-white border-4 ${currentStyle.frontBorder} rounded-2xl flex flex-col justify-between p-6 md:p-8 overflow-hidden`}>
            {/* Study Status Ribbon */}
            {studyStatus && (
              <div
                className={`absolute top-4 -right-12 w-40 text-center py-1.5 text-white text-sm font-semibold transform rotate-45 shadow-lg ${
                  studyStatus === 'known' ? 'bg-green-500' : 'bg-yellow-500'
                }`}
                aria-label={`Trạng thái: ${studyStatus === 'known' ? 'Đã biết' : 'Xem lại'}`}
              >
                {studyStatus === 'known' ? 'Đã biết' : 'Xem lại'}
              </div>
            )}
            
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
                <p>{englishExample}</p>
                <p className="text-sm text-slate-500 mt-1 italic">({vietnameseExample})</p>
            </div>
        </div>

        {/* Back Face */}
        <div className={`flashcard-face flashcard-back absolute w-full h-full ${currentStyle.backBg} rounded-2xl flex flex-col justify-between items-center p-6 md:p-8`}>
           <div className="w-full text-center my-auto">
             <h3 className="text-6xl md:text-7xl font-bold text-white text-center">{word.vietnamese}</h3>
           </div>
           
           <div className="w-full flex justify-center gap-x-4">
               <button 
                  onClick={(e) => handleMark(e, 'review')}
                  className="flex items-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold rounded-lg shadow-lg transition-transform transform hover:scale-105"
                  aria-label="Đánh dấu cần xem lại"
                  title="Cần xem lại"
               >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                     <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-3.13L5 18V4z" />
                   </svg>
                   Xem lại
               </button>
               <button 
                  onClick={(e) => handleMark(e, 'known')}
                  className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow-lg transition-transform transform hover:scale-105"
                  aria-label="Đánh dấu đã biết"
                  title="Đã biết"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                     <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                   </svg>
                   Đã biết
               </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
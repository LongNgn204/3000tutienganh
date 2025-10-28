import React, { useState } from 'react';
import type { Word } from '../types';
import SpeakerButton from './SpeakerButton';
import AIExplainModal from './AIExplainModal';

interface WordCardProps {
  word: Word;
}

const WordCard: React.FC<WordCardProps> = ({ word }) => {
  const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);
  const englishExample = word.example.split('(')[0].trim();
  const vietnameseExample = word.example.match(/\(([^)]+)\)/)?.[1] || '';

  return (
    <>
      <div className="bg-white rounded-xl shadow-subtle flex flex-col transition-all duration-300 ease-in-out hover:shadow-lifted hover:-translate-y-1 overflow-hidden border border-slate-200">
        <div className="p-5">
            <div className="flex justify-between items-start gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                   <div 
                      className="w-3 h-3 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: word.color }}
                      aria-hidden="true"
                    ></div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {word.type}
                    </span>
                </div>
                <h4 className="text-2xl font-bold text-slate-800 mt-1">{word.english}</h4>
                <p className="text-sm text-slate-500 italic mt-1">{word.pronunciation}</p>
              </div>
              <div className="flex items-center -mr-2">
                <button
                  onClick={() => setIsExplainModalOpen(true)}
                  className="text-slate-400 hover:text-indigo-600 transition-colors p-1.5 rounded-full hover:bg-indigo-50 flex-shrink-0"
                  aria-label={`Giải thích từ ${word.english} bằng AI`}
                  title={`Giải thích từ ${word.english} bằng AI`}
                >
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M10.868 2.884c.321-.772 1.415-.772 1.736 0l1.681 4.06c.064.155.19.288.348.348l4.06 1.681c.772.321.772 1.415 0 1.736l-4.06 1.681a.5.5 0 00-.348.348l-1.681 4.06c-.321.772-1.415-.772-1.736 0l-1.681-4.06a.5.5 0 00-.348-.348l-4.06-1.681c-.772-.321-.772-1.415 0-1.736l4.06-1.681a.5.5 0 00.348-.348l1.681-4.06zM2.08 13.75a.5.5 0 01.696-.696l1.303 1.303a.5.5 0 01-.696.696l-1.303-1.303zM15 4a.5.5 0 01.696-.696l1.303 1.303a.5.5 0 01-.696.696l-1.303-1.303z" clipRule="evenodd" />
                  </svg>
                </button>
                <SpeakerButton textToSpeak={word.english} ariaLabel={`Phát âm từ ${word.english}`} />
              </div>
            </div>
             <p className="text-lg font-semibold text-indigo-700 mt-3">{word.vietnamese}</p>
        </div>
        
        {englishExample && englishExample !== 'Example not available.' && (
         <div className="bg-slate-50 border-t border-slate-200 px-5 py-4">
              <div className="text-sm text-slate-600 flex items-start gap-2">
                  <div className="flex-grow">
                      <p className="font-medium">{englishExample}</p>
                      {vietnameseExample && <p className="text-xs text-slate-500 mt-1 italic">({vietnameseExample})</p>}
                  </div>
                  <SpeakerButton textToSpeak={englishExample} ariaLabel={`Phát âm câu ví dụ`} />
              </div>
         </div>
        )}
      </div>
      {isExplainModalOpen && (
        <AIExplainModal 
          word={word} 
          onClose={() => setIsExplainModalOpen(false)} 
        />
      )}
    </>
  );
};

export default WordCard;
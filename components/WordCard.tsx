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
      <div className="bg-white rounded-xl shadow-md flex flex-col transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg overflow-hidden border border-slate-200">
        <div className="flex">
          <div 
            className="w-1.5 flex-shrink-0" 
            style={{ backgroundColor: word.color }}
            aria-hidden="true"
          ></div>
          <div className="p-4 flex-grow w-full">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-2xl font-bold text-slate-800">{word.english}</h4>
                   <div className="flex items-center gap-x-2 mt-1">
                       <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
                          {word.type}
                      </span>
                      <p className="text-sm text-slate-500 italic">{word.pronunciation}</p>
                   </div>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => setIsExplainModalOpen(true)}
                    className="text-slate-400 hover:text-indigo-600 transition-colors p-1 rounded-full hover:bg-indigo-50 flex-shrink-0"
                    aria-label={`Giải thích từ ${word.english} bằng AI`}
                    title={`Giải thích từ ${word.english} bằng AI`}
                  >
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M10.868 2.884c.321-.772 1.415-.772 1.736 0l1.681 4.06c.064.155.19.288.348.348l4.06 1.681c.772.321.772 1.415 0 1.736l-4.06 1.681a.5.5 0 00-.348.348l-1.681 4.06c-.321.772-1.415.772-1.736 0l-1.681-4.06a.5.5 0 00-.348-.348l-4.06-1.681c-.772-.321-.772-1.415 0-1.736l4.06-1.681a.5.5 0 00.348-.348l1.681-4.06zM2.08 13.75a.5.5 0 01.696-.696l1.303 1.303a.5.5 0 01-.696.696l-1.303-1.303zM15 4a.5.5 0 01.696-.696l1.303 1.303a.5.5 0 01-.696.696l-1.303-1.303z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <SpeakerButton textToSpeak={word.english} ariaLabel={`Phát âm từ ${word.english}`} />
                </div>
              </div>
          </div>
        </div>
        
        {englishExample && englishExample !== 'Example not available.' && (
         <div className="px-5 pb-4">
              <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-start gap-2">
                  <div className="flex-grow">
                      <p>{englishExample}</p>
                      {vietnameseExample && <p className="text-xs text-slate-500 mt-1 italic">({vietnameseExample})</p>}
                  </div>
                  <SpeakerButton textToSpeak={englishExample} ariaLabel={`Phát âm câu ví dụ`} />
              </div>
         </div>
        )}

        <div className="mt-auto border-t border-slate-200 px-5 py-3">
          <p className="text-lg font-semibold text-indigo-700">{word.vietnamese}</p>
        </div>
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
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
      <div className="bg-white rounded-xl shadow-md flex flex-col transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl overflow-hidden border border-slate-200">
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
                    className="text-slate-400 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-blue-50 flex-shrink-0"
                    aria-label={`Giải thích từ ${word.english} bằng AI`}
                    title={`Giải thích từ ${word.english} bằng AI`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 2a1 1 0 00-1 1v1.586l-2.293 2.293a1 1 0 000 1.414l2.293 2.293V11a1 1 0 102 0V9.414l2.293-2.293a1 1 0 000-1.414L7 3.414V3a1 1 0 00-2 0zm10 4a1 1 0 00-1-1H9.414l2.293 2.293a1 1 0 001.414 0L15.414 7H17a1 1 0 00-2 0v1.586l2.293 2.293a1 1 0 000 1.414L17 14.586V16a1 1 0 102 0v-1.586l-2.293-2.293a1 1 0 00-1.414 0L12.586 13H11a1 1 0 100 2h1.586l-2.293 2.293a1 1 0 000 1.414l2.293 2.293V23a1 1 0 102 0v-1.586l-2.293-2.293a1 1 0 00-1.414 0L9.414 19H11a1 1 0 100-2H9.414l2.293-2.293a1 1 0 000-1.414L9.414 13H11a1 1 0 100-2H9.414l2.293-2.293a1 1 0 000-1.414L9.414 7H11a1 1 0 100-2h1.586l-2.293-2.293a1 1 0 00-1.414 0L7 4.586V3a1 1 0 10-2 0v1.586l2.293 2.293a1 1 0 001.414 0L10.586 7H12a1 1 0 100-2h-1.586z" clipRule="evenodd" />
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
          <p className="text-lg font-semibold text-blue-700">{word.vietnamese}</p>
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

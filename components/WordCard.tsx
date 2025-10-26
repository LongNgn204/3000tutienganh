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
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1.5 1.5 0 011.06.44l5.25 5.25a1.5 1.5 0 010 2.12l-5.25 5.25a1.5 1.5 0 01-2.12-2.12L12.88 12H4.5a1.5 1.5 0 010-3h8.38L8.94 5.56a1.5 1.5 0 011.06-2.56z" clipRule="evenodd" transform="rotate(90 10 10)" /></svg>
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 2a1 1 0 00-1 1v1.5a1.5 1.5 0 003 0V3a1 1 0 00-1-1H5zM3 6.5A1.5 1.5 0 014.5 5h1.25a1 1 0 100-2H4.5A3.5 3.5 0 001 6.5v1.25a1 1 0 102 0V6.5zM15 2a1 1 0 00-1 1v1.5a1.5 1.5 0 003 0V3a1 1 0 00-1-1h-1zM13.5 5A1.5 1.5 0 0015 6.5v1.25a1 1 0 102 0V6.5A3.5 3.5 0 0015.5 3h-1.25a1 1 0 100 2h1.25zM5 18a1 1 0 011-1h1.5a1.5 1.5 0 010 3H6a1 1 0 01-1-1zm3.5 1.5a1.5 1.5 0 00-3 0v1.25a1 1 0 11-2 0V16.5A3.5 3.5 0 014.5 13h1.25a1 1 0 110 2H4.5a1.5 1.5 0 00-1.5 1.5v.75zm8.5-1.5a1 1 0 011-1h1.5a1.5 1.5 0 010 3H16a1 1 0 01-1-1zm.25 2.75a1 1 0 10-2 0v-1.25a1.5 1.5 0 00-3 0v-1.5a1 1 0 10-2 0v1.5a3.5 3.5 0 003.5 3.5h1.25a1 1 0 100-2h-1.25a1.5 1.5 0 00-1.5-1.5v-.75z" clipRule="evenodd"  transform="scale(1.2) translate(-1.5, -1.5)"/><path fillRule="evenodd" d="M10 5.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9zM8.5 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" clipRule="evenodd" /></svg>
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.3 2.05c.58-.58 1.52-.58 2.1 0l4.5 4.5c.58.58.58 1.52 0 2.1l-1.48 1.48-6.18-6.18 1.08-1.08zM17.44 8.56l-6.18-6.18-8.25 8.25c-.58.58-.58 1.52 0 2.1l4.5 4.5c.58.58 1.52.58 2.1 0l8.25-8.25zM4.44 11.44l-2.47-2.47 6.18 6.18 2.47-2.47-6.18-6.18zM2.05 11.3c-.58.58-.58 1.52 0 2.1l4.5 4.5c.58.58 1.52.58 2.1 0l1.08-1.08-6.18-6.18-1.48 1.48z" clipRule="evenodd" /></svg>
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15.25a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM4.75 10a.75.75 0 00-1.5 0h1.5zM16.75 10a.75.75 0 00-1.5 0h1.5zM13.89 6.11a.75.75 0 00-1.06-1.06l-1.06 1.06a.75.75 0 001.06 1.06l1.06-1.06zM6.11 13.89a.75.75 0 00-1.06-1.06l-1.06 1.06a.75.75 0 001.06 1.06l1.06-1.06zM13.89 13.89a.75.75 0 001.06-1.06l-1.06-1.06a.75.75 0 00-1.06 1.06l1.06 1.06zM6.11 6.11a.75.75 0 001.06-1.06l-1.06-1.06a.75.75 0 00-1.06 1.06l1.06 1.06z" clipRule="evenodd" /></svg>
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.5 2a.5.5 0 01.5.5v1.586l1.293-1.293a.5.5 0 11.707.707L6.207 5.207a.5.5 0 01-.707 0L3.793 3.5a.5.5 0 01.707-.707L5.5 3.086V2.5a.5.5 0 01.5-.5zM2.5 6a.5.5 0 01.5-.5h1.586l-1.293 1.293a.5.5 0 11-.707-.707L3.793 4.793a.5.5 0 010 .707L2.5 6.793a.5.5 0 01-.707-.707l.707-.707H2.5a.5.5 0 010-1H4zM11.5 2a.5.5 0 01.5.5v1.586l1.293-1.293a.5.5 0 01.707.707l-1.793 1.793a.5.5 0 01-.707 0L9.793 3.5a.5.5 0 01.707-.707L11.5 3.086V2.5a.5.5 0 01.5-.5zM10 6.5a.5.5 0 01.5-.5h.586l-1.293 1.293a.5.5 0 00.707.707l1.793-1.793a.5.5 0 000-.707L10.5 4.207a.5.5 0 00-.707 0L8.5 5.5a.5.5 0 00.707.707L10.586 5H11a.5.5 0 01.5.5v.5zM5.5 18a.5.5 0 00-.5-.5v-1.586l-1.293 1.293a.5.5 0 00-.707-.707l1.793-1.793a.5.5 0 01.707 0l1.793 1.793a.5.5 0 01-.707.707L5.5 16.914v.586a.5.5 0 00.5.5h-1zM2.5 14a.5.5 0 01.5-.5h1.586l-1.293 1.293a.5.5 0 11-.707-.707l1.293-1.293a.5.5 0 010 .707l-1.293 1.293a.5.5 0 01-.707-.707l.707-.707H2.5a.5.5 0 010-1H4z" clipRule="evenodd" /></svg>
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

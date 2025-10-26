import React from 'react';
import WordCard from './WordCard';
import type { Category } from '../types';
import { TYPE_COLORS } from '../constants';

const ColorLegend: React.FC = () => {
  const typeNames: { [key: string]: string } = {
    'n': 'Danh từ',
    'v': 'Động từ',
    'adj': 'Tính từ',
    'adv': 'Trạng từ',
    'prep': 'Giới từ',
    'conj': 'Liên từ',
    'n/v': 'Danh từ/Động từ',
  };

  return (
    <div className="p-4 bg-slate-100 rounded-lg border border-slate-200">
      <h4 className="text-md font-semibold mb-3 text-slate-700">Hướng dẫn</h4>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {Object.entries(TYPE_COLORS).map(([type, color]) => (
          <div key={type} className="flex items-center space-x-2">
            <span className="w-3.5 h-3.5 rounded-full flex-shrink-0 border border-black/10" style={{ backgroundColor: color }}></span>
            <span className="text-sm text-slate-600">{typeNames[type] || type}</span>
          </div>
        ))}
      </div>
      <p className="text-sm text-slate-500 mt-4 pt-3 border-t border-slate-300/70">
        Trong phần phiên âm, ký hiệu <code className="bg-slate-200 text-slate-700 px-1 py-0.5 rounded text-xs">ˈ</code> (ví dụ: /<code className="bg-slate-200 text-slate-700 px-1 py-0.5 rounded text-xs">ˈwʊmən</code>/) đánh dấu <strong>trọng âm chính</strong> của từ.
      </p>
    </div>
  );
};

interface WordListProps {
  categories: Category[];
}

const WordList: React.FC<WordListProps> = ({ categories }) => {
  return (
    <div>
      <div className="sticky top-16 lg:top-0 bg-slate-50/95 backdrop-blur-sm py-4 z-10">
        <ColorLegend />
      </div>
      {categories.map((category) => (
        <section key={category.id} id={category.id} className="pt-8 mb-16 scroll-mt-40">
          <h3 className="text-2xl font-bold text-blue-600 mb-6 pb-2 border-b-2 border-blue-200">
            {category.name}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
            {category.words.map((word) => (
              <WordCard key={word.english + word.vietnamese} word={word} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default WordList;
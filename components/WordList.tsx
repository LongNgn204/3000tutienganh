import React, { useEffect, useState, useMemo, lazy, Suspense } from 'react';
import WordCard from './WordCard';
import type { Category, CEFRLevel, Word } from '../types';
import { TYPE_COLORS } from '../constants';
import { CEFR_LEVEL_MAP } from '../cefr';

const AddWordModal = lazy(() => import('./AddWordModal'));

const ColorLegend: React.FC = () => {
  const typeNames: { [key: string]: string } = {
    'n': 'Danh từ',
    'v': 'Động từ',
    'adj': 'Tính từ',
    'adv': 'Trạng từ',
    'prep': 'Giới từ',
    'conj': 'Liên từ',
    'n/v': 'Danh từ/Động từ',
    'pron': 'Đại từ',
    'det': 'Hạn định từ',
    'phr v': 'Cụm động từ',
    'idiom': 'Thành ngữ',
  };

  return (
    <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
      <h4 className="text-md font-semibold mb-3 text-slate-700">Hướng dẫn</h4>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {Object.entries(TYPE_COLORS).map(([type, color]) => (
          <div key={type} className="flex items-center space-x-2">
            <span className="w-3.5 h-3.5 rounded-full flex-shrink-0 border border-black/10" style={{ backgroundColor: color }}></span>
            <span className="text-sm text-slate-600">{typeNames[type] || type}</span>
          </div>
        ))}
      </div>
      <p className="text-sm text-slate-500 mt-4 pt-3 border-t border-slate-200">
        Trong phần phiên âm, ký hiệu <code className="bg-slate-200 text-slate-700 px-1 py-0.5 rounded text-xs">ˈ</code> (ví dụ: /<code className="bg-slate-200 text-slate-700 px-1 py-0.5 rounded text-xs">ˈwʊmən</code>/) đánh dấu <strong>trọng âm chính</strong> của từ.
      </p>
    </div>
  );
};

interface TopicSidebarProps {
  categories: Category[];
  activeCategory: string;
  onCategoryClick: (id: string) => void;
}

const TopicSidebar: React.FC<TopicSidebarProps> = ({ categories, activeCategory, onCategoryClick }) => {
  const groupedCategories = useMemo(() => {
    return categories.reduce((acc, category) => {
      const level = category.level;
      if (!acc[level]) {
        acc[level] = [];
      }
      acc[level].push(category);
      return acc;
    }, {} as Record<CEFRLevel, Category[]>);
  }, [categories]);

  const sortedLevels = Object.keys(groupedCategories).sort((a, b) => {
    const levelOrder = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    return levelOrder.indexOf(a) - levelOrder.indexOf(b);
  }) as CEFRLevel[];

  return (
    <aside className="w-full lg:sticky lg:top-20 self-start">
      <h2 className="text-lg font-semibold text-slate-700 mb-4 border-b pb-2">Chủ đề theo cấp độ</h2>
      <nav>
        {sortedLevels.map(level => (
          <div key={level} className="mb-4">
            <h3 className={`font-bold text-md mb-2 px-2 ${CEFR_LEVEL_MAP[level].color.replace('bg-', 'text-').replace('-100', '-700')}`}>{CEFR_LEVEL_MAP[level].name}</h3>
            <ul>
              {groupedCategories[level].map((category) => (
                <li key={category.id}>
                  <a
                    href={`#${category.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onCategoryClick(category.id);
                    }}
                    className={`block px-4 py-1.5 my-1 rounded-md text-sm font-medium transition-all duration-200 ease-in-out ${
                      activeCategory === category.id
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                    }`}
                  >
                    {category.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
};


interface WordListProps {
  categories: Category[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategory: string;
  setActiveCategory: (id: string) => void;
  mainContentRef: React.RefObject<HTMLDivElement>;
  onAddNewWord: (wordData: Omit<Word, 'color'>) => Promise<void>;
}

const WordList: React.FC<WordListProps> = ({ categories, searchQuery, setSearchQuery, activeCategory, setActiveCategory, mainContentRef, onAddNewWord }) => {
  const [isTopicSidebarVisible, setIsTopicSidebarVisible] = useState(true);
  const [isAddWordModalOpen, setIsAddWordModalOpen] = useState(false);

  const filteredCategories = React.useMemo((): Category[] => {
    if (!searchQuery) {
      return categories;
    }
    const lowercasedQuery = searchQuery.toLowerCase();
    
    const relevantCategories: Category[] = [];
    categories.forEach(category => {
        const wordsInCategory = category.words.filter(word =>
            word.english.toLowerCase().includes(lowercasedQuery) ||
            word.vietnamese.toLowerCase().includes(lowercasedQuery)
        );
        if (wordsInCategory.length > 0) {
            relevantCategories.push({ ...category, words: wordsInCategory });
        }
    });
    return relevantCategories;
  }, [searchQuery, categories]);

  const hasSearchResults = React.useMemo(() => filteredCategories.length > 0, [filteredCategories]);

  const handleCategoryClick = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.id);
          }
        });
      },
      {
        root: mainContentRef.current,
        rootMargin: '-150px 0px -70% 0px',
        threshold: 0,
      }
    );

    const sections = mainContentRef.current?.querySelectorAll('section[id]');
    sections?.forEach((section) => observer.observe(section));

    return () => {
      sections?.forEach((section) => observer.unobserve(section));
    };
  }, [mainContentRef, setActiveCategory]);

  return (
     <div className="flex-grow px-4 sm:px-6 lg:px-8 w-full h-full">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 py-8 h-full">
            {isTopicSidebarVisible && (
              <div className="lg:col-span-3">
                  <TopicSidebar 
                  categories={categories} 
                  activeCategory={activeCategory} 
                  onCategoryClick={handleCategoryClick}
                  />
              </div>
            )}
            <main 
            ref={mainContentRef} 
            className={`w-full mt-8 lg:mt-0 lg:max-h-[calc(100vh-150px)] overflow-y-auto ${isTopicSidebarVisible ? 'lg:col-span-9' : 'lg:col-span-12'}`}
            >
                <div className="sticky top-0 bg-slate-100/90 backdrop-blur-sm py-4 z-10 -mt-8 pt-8">
                     <div className="flex flex-wrap items-center gap-4 mb-6">
                        <div className="relative flex-grow w-full max-w-xl">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Tìm kiếm từ..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-full leading-5 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:placeholder-slate-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <button
                            onClick={() => setIsAddWordModalOpen(true)}
                            className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition-all shadow-md"
                            title="Thêm từ mới vào danh sách của bạn"
                        >
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                           <span className="hidden sm:inline">Thêm từ</span>
                        </button>
                        <button 
                            onClick={() => setIsTopicSidebarVisible(prev => !prev)}
                            className="hidden lg:flex items-center gap-2 px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm font-semibold text-slate-700 hover:bg-slate-100 transition-all text-sm"
                            title={isTopicSidebarVisible ? 'Ẩn mục lục' : 'Hiện mục lục'}
                        >
                            {isTopicSidebarVisible ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m16 15-3-3 3-3"/></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m14 9 3 3-3 3"/></svg>
                            )}
                            <span>{isTopicSidebarVisible ? 'Ẩn' : 'Hiện'}</span>
                        </button>
                    </div>
                    <ColorLegend />
                </div>

            {searchQuery && !hasSearchResults ? (
                <div className="text-center py-16">
                    <h3 className="text-xl font-semibold text-slate-600">Không tìm thấy từ nào</h3>
                    <p className="text-slate-500 mt-2">Hãy thử một từ khóa khác.</p>
                </div>
            ) : (
                filteredCategories.map((category) => (
                    <section key={category.id} id={category.id} className="pt-8 mb-16 scroll-mt-48">
                    <h3 className="text-2xl font-bold text-indigo-600 mb-6 pb-2 border-b-2 border-indigo-200">
                        {category.name}
                    </h3>
                    <div className={`grid gap-5 ${isTopicSidebarVisible ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4'}`}>
                        {category.words.map((word) => (
                        <WordCard key={word.english + word.vietnamese} word={word} />
                        ))}
                    </div>
                    </section>
                ))
            )}
            </main>
        </div>
        {isAddWordModalOpen && (
            <Suspense fallback={<div />}>
                <AddWordModal 
                    onClose={() => setIsAddWordModalOpen(false)}
                    onAddWord={onAddNewWord}
                />
            </Suspense>
        )}
    </div>
  );
};

export default WordList;
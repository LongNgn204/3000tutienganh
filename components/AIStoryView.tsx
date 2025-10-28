import React, { useState, useMemo, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import type { Word, StudyProgress } from '../types';
import SpeakerButton from './SpeakerButton';
import * as srsService from '../services/srsService';

interface AIStoryViewProps {
  words: Word[];
  studyProgress: StudyProgress;
  onGoalUpdate: () => void;
}

const MIN_WORDS = 3;
const MAX_WORDS = 5;

const AIStoryView: React.FC<AIStoryViewProps> = ({ words, studyProgress, onGoalUpdate }) => {
  const [selectedWords, setSelectedWords] = useState<Word[]>([]);
  const [storyEnglish, setStoryEnglish] = useState('');
  const [storyVietnamese, setStoryVietnamese] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'review'>('all');

  const filteredWords = useMemo(() => {
    if (filter === 'review') {
      return srsService.getWordsToReview(words, studyProgress);
    }
    return words;
  }, [words, studyProgress, filter]);

  const handleWordToggle = (word: Word) => {
    setSelectedWords(prev => {
      const isSelected = prev.some(w => w.english === word.english);
      if (isSelected) {
        return prev.filter(w => w.english !== word.english);
      } else {
        if (prev.length < MAX_WORDS) {
          return [...prev, word];
        }
        return prev;
      }
    });
  };

  const generateStory = async () => {
    if (selectedWords.length < MIN_WORDS) {
        alert(`Vui lòng chọn ít nhất ${MIN_WORDS} từ.`);
        return;
    }

    setIsGenerating(true);
    setError(null);
    setStoryEnglish('');
    setStoryVietnamese('');

    const wordList = selectedWords.map(w => w.english).join(', ');

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Act as a creative writing teacher for a Vietnamese person learning English. Create a short, engaging, and slightly complex story (around 70-90 words) that MUST include the following words: ${wordList}. The story should use interesting sentence structures and vocabulary beyond the absolute basic. Provide both the English story and its Vietnamese translation.`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        storyEnglish: { type: Type.STRING, description: "The short, engaging story in English." },
                        storyVietnamese: { type: Type.STRING, description: "The Vietnamese translation of the story." },
                    },
                    required: ['storyEnglish', 'storyVietnamese']
                },
            },
        });
        
        const storyData = JSON.parse(response.text);
        setStoryEnglish(storyData.storyEnglish);
        setStoryVietnamese(storyData.storyVietnamese);
        onGoalUpdate();

    } catch (err) {
        console.error("Gemini Story Generation Error:", err);
        setError("Rất tiếc, AI không thể tạo truyện lúc này. Vui lòng thử lại sau.");
    } finally {
        setIsGenerating(false);
    }
  };
  
  const highlightWords = (text: string, wordsToHighlight: Word[]) => {
      if (wordsToHighlight.length === 0) return text;
      const wordRegex = new RegExp(`\\b(${wordsToHighlight.map(w => w.english.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|')})\\b`, 'gi');
      return text.replace(wordRegex, '<strong class="bg-yellow-200 text-yellow-800 px-1 rounded">$1</strong>');
  };

  const renderContent = () => {
    if (isGenerating) {
      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center">
            <svg className="animate-spin h-8 w-8 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-slate-500 font-semibold">AI đang viết nên câu chuyện của bạn...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg">
          {error}
        </div>
      );
    }

    if (storyEnglish) {
      return (
        <div className="bg-white p-6 rounded-lg shadow-md border animate-fade-in">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-slate-800">Câu chuyện của bạn</h3>
                <SpeakerButton textToSpeak={storyEnglish} ariaLabel="Nghe câu chuyện" />
            </div>
          <p 
            className="text-lg text-slate-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: highlightWords(storyEnglish, selectedWords) }}
          />

          {storyVietnamese && (
            <p className="text-md text-slate-500 mt-4 pt-4 border-t italic">{storyVietnamese}</p>
          )}

          <div className="mt-6 flex justify-end gap-4">
            <button
              onClick={() => { setStoryEnglish(''); setStoryVietnamese(''); setSelectedWords([]); }}
              className="px-4 py-2 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition-colors"
            >
              Chọn từ mới
            </button>
             <button
              onClick={generateStory}
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tạo truyện khác
            </button>
          </div>
        </div>
      );
    }

    // Default view: Word Selection
    return (
        <div className="bg-white p-6 rounded-lg shadow-md border">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Chọn từ để tạo truyện</h3>
            <p className="text-slate-500 mb-4">Chọn từ {MIN_WORDS} đến {MAX_WORDS} từ bạn muốn luyện tập trong một câu chuyện.</p>
            
            <div className="flex items-center gap-4 mb-4">
                <span className="text-sm font-medium">Lọc theo:</span>
                <div className="flex items-center gap-2">
                    <button onClick={() => setFilter('all')} className={`px-3 py-1 text-sm rounded-full ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>Tất cả</button>
                    <button onClick={() => setFilter('review')} className={`px-3 py-1 text-sm rounded-full ${filter === 'review' ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>Cần xem lại</button>
                </div>
            </div>

            <div className="max-h-64 overflow-y-auto border rounded-md p-2 flex flex-wrap gap-2 bg-slate-50">
                {filteredWords.length > 0 ? filteredWords.map(word => {
                    const isSelected = selectedWords.some(w => w.english === word.english);
                    return (
                        <button
                            key={word.english}
                            onClick={() => handleWordToggle(word)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium border-2 transition-all ${
                                isSelected 
                                ? 'bg-blue-500 border-blue-600 text-white' 
                                : 'bg-white border-slate-300 hover:border-blue-400'
                            }`}
                        >
                            {word.english}
                        </button>
                    )
                }) : (
                    <p className="text-slate-500 p-4 text-center w-full">Không có từ nào trong bộ lọc này.</p>
                )}
            </div>
             <div className="mt-6 flex justify-between items-center">
                <p className="text-sm text-slate-600 font-semibold">Đã chọn: {selectedWords.length}/{MAX_WORDS}</p>
                <button
                    onClick={generateStory}
                    disabled={selectedWords.length < MIN_WORDS || selectedWords.length > MAX_WORDS || isGenerating}
                    className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md transition-all hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                    Tạo truyện
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-start p-4 sm:p-6 lg:p-8 w-full">
        <div className="w-full max-w-3xl text-center mb-6">
            <h2 className="text-3xl font-bold text-slate-800">Viết Chuyện Với AI</h2>
            <p className="text-lg text-slate-600 mt-2">Học từ vựng trong ngữ cảnh bằng những câu chuyện độc đáo do AI tạo ra.</p>
        </div>
        <div className="w-full max-w-3xl">
            {renderContent()}
        </div>
    </div>
  );
};

export default AIStoryView;
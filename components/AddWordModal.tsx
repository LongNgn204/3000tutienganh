import React, { useState } from 'react';
import type { Word } from '../types';
import { TYPE_COLORS } from '../constants';

interface AddWordModalProps {
  onClose: () => void;
  onAddWord: (wordData: Omit<Word, 'color'>) => Promise<void>;
}

const wordTypes = Object.keys(TYPE_COLORS);

const AddWordModal: React.FC<AddWordModalProps> = ({ onClose, onAddWord }) => {
  const [english, setEnglish] = useState('');
  const [vietnamese, setVietnamese] = useState('');
  const [type, setType] = useState('n');
  const [pronunciation, setPronunciation] = useState('');
  const [example, setExample] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!english.trim() || !vietnamese.trim()) {
      setError('Từ tiếng Anh và nghĩa tiếng Việt là bắt buộc.');
      return;
    }
    setError('');
    setIsLoading(true);
    
    const newWordData: Omit<Word, 'color'> = {
      english: english.trim(),
      vietnamese: vietnamese.trim(),
      type: type,
      pronunciation: pronunciation.trim() ? `/${pronunciation.trim()}/` : '',
      example: example.trim(),
    };

    await onAddWord(newWordData);
    setIsLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold text-slate-800">Thêm từ mới</h2>
          </div>
          
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            {error && <p className="text-red-500 bg-red-50 p-3 rounded-md text-sm">{error}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="english-word" className="block text-sm font-medium text-slate-700 mb-1">Từ tiếng Anh*</label>
                    <input
                        id="english-word"
                        type="text"
                        value={english}
                        onChange={(e) => setEnglish(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="vietnamese-word" className="block text-sm font-medium text-slate-700 mb-1">Nghĩa tiếng Việt*</label>
                    <input
                        id="vietnamese-word"
                        type="text"
                        value={vietnamese}
                        onChange={(e) => setVietnamese(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>
            </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                  <label htmlFor="word-type" className="block text-sm font-medium text-slate-700 mb-1">Loại từ</label>
                  <select
                      id="word-type"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  >
                      {wordTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
              </div>
              <div>
                  <label htmlFor="word-pronunciation" className="block text-sm font-medium text-slate-700 mb-1">Phiên âm</label>
                  <input
                      id="word-pronunciation"
                      type="text"
                      value={pronunciation}
                      onChange={(e) => setPronunciation(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g., həˈloʊ"
                  />
              </div>
            </div>
            <div>
                <label htmlFor="word-example" className="block text-sm font-medium text-slate-700 mb-1">Câu ví dụ</label>
                <textarea
                    id="word-example"
                    value={example}
                    onChange={(e) => setExample(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., Hello, my name is John. (Xin chào, tên tôi là John.)"
                ></textarea>
            </div>
          </div>

          <div className="p-6 bg-slate-50 rounded-b-xl flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-5 py-2 text-sm font-semibold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-lg">Hủy</button>
            <button type="submit" disabled={isLoading} className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:bg-slate-400">
                {isLoading ? 'Đang thêm...' : 'Thêm từ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddWordModal;

export interface Word {
  english: string;
  type: string;
  pronunciation: string;
  vietnamese: string;
  color: string;
  example: string;
}

export interface Category {
  id: string;
  name: string;
  words: Word[];
}

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface User {
  name: string;
  level: CEFRLevel;
}

export type StudyStatus = 'known' | 'review';

export interface StudyProgress {
  [wordEnglish: string]: StudyStatus;
}

export type ViewMode = 'list' | 'flashcard' | 'quiz' | 'story' | 'dashboard' | 'conversation';

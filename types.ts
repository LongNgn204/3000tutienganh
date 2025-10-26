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

export interface User {
  name: string;
}

export type StudyStatus = 'known' | 'review';

export interface StudyProgress {
  [wordEnglish: string]: StudyStatus;
}

export type ViewMode = 'list' | 'flashcard' | 'quiz' | 'story' | 'dashboard';

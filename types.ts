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

export interface IncorrectQuestionInfo {
  questionId: string;
  questionText: string;
  userAnswer: string;
  correctAnswer: string;
  level: CEFRLevel;
}

export interface LevelPerformance {
  correct: number;
  total: number;
  percentage: number;
}

export interface TestAnalysis {
  score: number;
  totalQuestions: number;
  incorrectQuestions: IncorrectQuestionInfo[];
  performanceByLevel: Partial<Record<CEFRLevel, LevelPerformance>>;
}

export interface PlacementTestResult {
  level: CEFRLevel;
  analysis: TestAnalysis;
}

export interface User {
  name: string;
  level: CEFRLevel;
  placementTestResult?: PlacementTestResult;
}

export type StudyStatus = 'known' | 'review';

export interface StudyProgress {
  [wordEnglish: string]: StudyStatus;
}

export type ViewMode = 'list' | 'flashcard' | 'quiz' | 'story' | 'dashboard' | 'conversation' | 'placement-test';

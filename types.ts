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

export interface DailyGoal {
  id: string;
  description: string;
  type: 'learn_new' | 'review_srs' | 'complete_quiz' | 'complete_listening' | 'complete_conversation';
  target: number;
  current: number;
}

export interface DailyProgress {
  date: string; // YYYY-MM-DD
  streak: number;
  goals: DailyGoal[];
}

export interface User {
  name: string;
  password: string;
  level: CEFRLevel;
  placementTestResult?: PlacementTestResult;
  studyProgress?: StudyProgress;
  dailyProgress?: DailyProgress;
}

export interface StudyRecord {
  srsLevel: number; // 0 for new, 1, 2, 3... for increasing review intervals
  nextReview: string; // ISO date string
  lastAnswer: 'again' | 'good' | 'easy' | null;
}

export interface StudyProgress {
  [wordEnglish: string]: StudyRecord;
}

export type ViewMode = 'list' | 'flashcard' | 'quiz' | 'story' | 'dashboard' | 'conversation' | 'placement-test' | 'placement-test-result' | 'pronunciation' | 'grammar' | 'listening' | 'advanced-grammar' | 'auth' | 'reading';
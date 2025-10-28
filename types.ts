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
  level: CEFRLevel;
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
  type: 'learn_new' | 'review_srs' | 'complete_quiz' | 'complete_listening' | 'complete_conversation' | 'complete_pronunciation' | 'complete_story' | 'complete_adv_grammar' | 'complete_reading' | 'complete_writing' | 'complete_roleplay' | 'complete_challenge' | 'complete_video_lesson' | 'post_in_forum';
  target: number;
  current: number;
}

export interface DailyProgress {
  date: string; // YYYY-MM-DD
  streak: number;
  goals: DailyGoal[];
}

export interface ChallengeProgress {
    [challengeId: string]: {
        current: number;
        completed: boolean;
    }
}

// Study Plan Types
export interface StudyPlanTask {
  id: string; // e.g., "task-20240101-1"
  description: string; // e.g., "Ôn tập 15 từ vựng"
  type: 'flashcard_review' | 'flashcard_new' | 'reading' | 'listening' | 'conversation' | 'pronunciation' | 'role-play' | 'grammar' | 'quiz' | 'writing';
  duration: number; // in minutes
  targetId?: string; // e.g., article id or role-play scenario id
  completed: boolean;
}

export interface StudyPlan {
  [day: string]: StudyPlanTask[]; // e.g., "day1", "day2", ...
}

export interface UserStudyPlanInput {
  goal: string;
  timePerDay: number;
  skillPriorities: string[];
  targetLevel: CEFRLevel;
}


export interface User {
  name: string;
  password?: string; // Password might not always be present on the client
  level: CEFRLevel;
  placementTestResult?: PlacementTestResult;
  studyProgress?: StudyProgress;
  dailyProgress?: DailyProgress;
  challengeProgress?: ChallengeProgress;
  customWords?: Word[];
  studyPlan?: StudyPlan;
  studyPlanInput?: UserStudyPlanInput;
}

export interface StudyRecord {
  srsLevel: number; // 0 for new, 1, 2, 3... for increasing review intervals
  nextReview: string; // ISO date string
  lastAnswer: 'again' | 'good' | 'easy' | null;
}

export interface StudyProgress {
  [wordEnglish: string]: StudyRecord;
}

export type ViewMode = 'list' | 'flashcard' | 'quiz' | 'story' | 'dashboard' | 'conversation' | 'placement-test' | 'placement-test-result' | 'pronunciation' | 'grammar' | 'listening' | 'advanced-grammar' | 'auth' | 'reading' | 'writing' | 'role-play' | 'welcome' | 'landing' | 'leaderboard' | 'challenges' | 'video-lessons' | 'community-forum' | 'forum-topic' | 'study-plan-wizard';

// Content Library Types
export interface ReadingArticleQuestion {
  question: string;
  options: string[];
  answer: string;
}

export interface ReadingArticle {
  id: string;
  title: string;
  level: CEFRLevel;
  content: string;
  questions: ReadingArticleQuestion[];
}

export interface ListeningExerciseQuestion {
  question: string;
  options: string[];
  answer: string;
}

export interface ListeningExercise {
  id: string;
  title: string;
  level: CEFRLevel;
  transcript: string;
  questions: ListeningExerciseQuestion[];
}

// Forum Types
export interface ForumReply {
    id: string;
    author: string;
    timestamp: string;
    content: string;
}

export interface ForumPost {
    id: string;
    topicId: string;
    author: string;
    timestamp: string;
    title: string;
    content: string;
    replies: ForumReply[];
}

export interface ForumTopic {
    id: string;
    title: string;
    description: string;
    postCount: number;
    lastPost: {
        author: string;
        timestamp: string;
    }
}
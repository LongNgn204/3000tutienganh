import type { StudyProgress, StudyRecord, Word } from '../types';

// Intervals in days for each SRS level.
const SRS_INTERVALS = [
    1, // Level 1: 1 day
    3, // Level 2: 3 days
    7, // Level 3: 1 week
    14, // Level 4: 2 weeks
    30, // Level 5: 1 month
    90, // Level 6: 3 months
    180, // Level 7: 6 months
    365, // Level 8: 1 year
];

export const getInitialRecord = (): StudyRecord => ({
    srsLevel: 0,
    nextReview: new Date().toISOString(),
    lastAnswer: null,
});

export const calculateNextReview = (
    currentRecord: StudyRecord, 
    performance: 'again' | 'good' | 'easy'
): StudyRecord => {
    
    let newSrsLevel = currentRecord.srsLevel;
    const now = new Date();

    if (performance === 'again') {
        newSrsLevel = 0; // Reset progress
    } else if (performance === 'good') {
        newSrsLevel += 1;
    } else if (performance === 'easy') {
        newSrsLevel += 2; // Jump ahead for easy words
    }
    
    // Clamp the level to the max defined interval
    newSrsLevel = Math.min(newSrsLevel, SRS_INTERVALS.length);
    
    let nextReviewDate = new Date(now);

    if (performance === 'again') {
        // Review again in 10 minutes
        nextReviewDate.setMinutes(now.getMinutes() + 10);
    } else if (newSrsLevel > 0) {
        const intervalDays = SRS_INTERVALS[newSrsLevel - 1];
        nextReviewDate.setDate(now.getDate() + intervalDays);
    } else { // First time seeing 'good' or 'easy'
        nextReviewDate.setDate(now.getDate() + 1);
        if (newSrsLevel === 0) newSrsLevel = 1;
    }

    return {
        srsLevel: newSrsLevel,
        nextReview: nextReviewDate.toISOString(),
        lastAnswer: performance,
    };
};

export const getWordsToReview = (allWords: Word[], studyProgress: StudyProgress): Word[] => {
    const now = new Date();
    return allWords.filter(word => {
        const record = studyProgress[word.english];
        if (!record || record.srsLevel === 0) {
            return false; // Not a review word
        }
        const reviewDate = new Date(record.nextReview);
        return reviewDate <= now;
    });
};

export const getNewWords = (allWords: Word[], studyProgress: StudyProgress): Word[] => {
    return allWords.filter(word => !studyProgress[word.english]);
};

export const getWordsForSession = (allWords: Word[], studyProgress: StudyProgress) => {
    const wordsToReview = getWordsToReview(allWords, studyProgress);
    const newWords = getNewWords(allWords, studyProgress);
    return { wordsToReview, newWords };
};
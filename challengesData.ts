import type { DailyGoal } from "./types";

export interface Challenge {
    id: string;
    title: string;
    description: string;
    goalType: DailyGoal['type'];
    target: number;
}

export const CHALLENGES: Challenge[] = [
    {
        id: 'c1',
        title: 'Siêng Năng Học Từ',
        description: 'Học 20 từ mới trong tuần bằng tính năng Flashcard.',
        goalType: 'learn_new',
        target: 20
    },
    {
        id: 'c2',
        title: 'Bậc Thầy Giao Tiếp',
        description: 'Hoàn thành 5 tình huống nhập vai khác nhau.',
        goalType: 'complete_roleplay',
        target: 5
    },
    {
        id: 'c3',
        title: 'Nhà Vô Địch Ôn Tập',
        description: 'Ôn tập ít nhất 50 từ bằng phương pháp SRS.',
        goalType: 'review_srs',
        target: 50
    },
    {
        id: 'c4',
        title: 'Cây bút Vàng',
        description: 'Hoàn thành 3 bài luyện viết với AI.',
        goalType: 'complete_writing',
        target: 3
    }
];

export interface ForumPost {
    id: string;
    author: string;
    avatar: string; // First letter of name
    timestamp: string;
    content: string;
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

export const FORUM_TOPICS: ForumTopic[] = [
    { 
        id: 't1', 
        title: "Hỏi đáp Ngữ pháp", 
        description: "Thắc mắc về thì, cấu trúc câu, và các quy tắc ngữ pháp.",
        postCount: 128, 
        lastPost: { author: "Minh Anh", timestamp: "2 giờ trước" }
    },
    { 
        id: 't2', 
        title: "Chia sẻ Mẹo học Từ vựng", 
        description: "Cùng nhau chia sẻ các phương pháp học từ vựng hiệu quả.",
        postCount: 97, 
        lastPost: { author: "Thanh Tung", timestamp: "5 giờ trước" } 
    },
    { 
        id: 't3', 
        title: "Tìm bạn luyện nói", 
        description: "Kết nối với những người bạn khác để cùng nhau luyện tập giao tiếp.",
        postCount: 215, 
        lastPost: { author: "Bao Tran", timestamp: "22 phút trước" } 
    },
    { 
        id: 't4', 
        title: "Thảo luận về Phim & Nhạc tiếng Anh", 
        description: "Cùng bàn luận về những bộ phim hay và bài hát yêu thích bằng tiếng Anh.",
        postCount: 64, 
        lastPost: { author: "Linh Nguyen", timestamp: "1 ngày trước" } 
    },
];

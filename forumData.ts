import type { ForumPost, ForumTopic } from './types';

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

export const FORUM_POSTS_DATA: Record<string, ForumPost[]> = {
    't1': [
        {
            id: 'p1-1',
            topicId: 't1',
            author: 'An Nguyen',
            timestamp: '3 ngày trước',
            title: 'Phân biệt "will" và "be going to"?',
            content: 'Chào mọi người, mình hay bị nhầm lẫn khi nào dùng "will" và khi nào dùng "be going to" cho tương lai. Ai đó giải thích giúp mình với được không?',
            replies: [
                { id: 'r1-1-1', author: 'Minh Anh', timestamp: '3 ngày trước', content: '"Be going to" thường dùng cho kế hoạch đã có từ trước, còn "will" dùng cho quyết định ngay tại thời điểm nói bạn nhé.' },
                { id: 'r1-1-2', author: 'Admin', timestamp: '3 ngày trước', content: 'Câu trả lời của bạn Minh Anh rất chính xác! Thêm một ý nữa là "will" cũng dùng cho các dự đoán không có căn cứ rõ ràng (I think it will rain), còn "be going to" dùng cho dự đoán có bằng chứng (Look at those clouds! It\'s going to rain).' }
            ]
        },
        {
            id: 'p1-2',
            topicId: 't1',
            author: 'Hoang Long',
            timestamp: '1 ngày trước',
            title: 'Khi nào dùng thì Hiện tại hoàn thành?',
            content: 'Mình vẫn chưa hiểu rõ lắm về cách dùng của thì Hiện tại hoàn thành (Present Perfect). Có ai có mẹo hay để nhớ không?',
            replies: []
        },
    ],
    't2': [
         {
            id: 'p2-1',
            topicId: 't2',
            author: 'Thanh Tung',
            timestamp: '5 giờ trước',
            title: 'Phương pháp học từ vựng bằng Flashcard SRS',
            content: 'Mình thấy tính năng Flashcard SRS trong app này rất hiệu quả. Mỗi ngày mình chỉ cần bỏ ra 15 phút để ôn tập. Mọi người có đang dùng không?',
            replies: [
                 { id: 'r2-1-1', author: 'Ngoc Diep', timestamp: '2 giờ trước', content: 'Mình cũng đang dùng và thấy rất ổn. Từ vựng được lặp lại đúng lúc mình sắp quên.' },
            ]
        }
    ],
    't3': [],
    't4': [],
};
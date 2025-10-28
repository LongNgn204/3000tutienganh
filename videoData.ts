import type { CEFRLevel } from './types';

export interface VideoLesson {
  id: string;
  title: string;
  level: CEFRLevel;
  description: string;
  youtubeId: string;
  thumbnail: string;
}

export const VIDEO_LESSONS: VideoLesson[] = [
  {
    id: 'v1',
    title: "100 thành ngữ phổ biến nhất trong 30 phút",
    level: "A2",
    description: "Học các thành ngữ thông dụng để giao tiếp tự nhiên như người bản xứ.",
    youtubeId: "_aisSh_pP3Q",
    thumbnail: "https://img.youtube.com/vi/_aisSh_pP3Q/mqdefault.jpg"
  },
  {
    id: 'v2',
    title: "Học tất cả 12 thì trong 20 phút",
    level: "B1",
    description: "Tổng quan nhanh và hiệu quả về tất cả các thì trong tiếng Anh.",
    youtubeId: "13a-bN28e3M",
    thumbnail: "https://img.youtube.com/vi/13a-bN28e3M/mqdefault.jpg"
  },
  {
    id: 'v3',
    title: "15 từ vựng tiếng Anh nâng cao",
    level: "B2",
    description: "Mở rộng vốn từ của bạn với các từ vựng trình độ cao để diễn đạt tinh tế hơn.",
    youtubeId: "2-4k5jW-o4c",
    thumbnail: "https://img.youtube.com/vi/2-4k5jW-o4c/mqdefault.jpg"
  },
  {
    id: 'v4',
    title: "Làm chủ cấu trúc Đảo ngữ trong tiếng Anh",
    level: "C1",
    description: "Nắm vững cấu trúc đảo ngữ để làm bài thi và giao tiếp một cách ấn tượng.",
    youtubeId: "tQyJvoe-M-s",
    thumbnail: "https://img.youtube.com/vi/tQyJvoe-M-s/mqdefault.jpg"
  },
  {
    id: 'v5',
    title: "Luyện nói tiếng Anh một mình",
    level: "B1",
    description: "Các phương pháp hiệu quả để bạn có thể tự luyện nói và cải thiện sự trôi chảy.",
    youtubeId: "u-j1I-6sTq8",
    thumbnail: "https://img.youtube.com/vi/u-j1I-6sTq8/mqdefault.jpg"
  },
  {
    id: 'v6',
    title: "Cách viết Email chuyên nghiệp bằng tiếng Anh",
    level: "B2",
    description: "Học cách viết email công việc một cách chuyên nghiệp, rõ ràng và hiệu quả.",
    youtubeId: "2MSo_hGM-3Y",
    thumbnail: "https://img.youtube.com/vi/2MSo_hGM-3Y/mqdefault.jpg"
  },
  {
    id: 'v7',
    title: "Từ vựng tiếng Anh cơ bản cho người mới bắt đầu",
    level: "A1",
    description: "Học những từ vựng thiết yếu nhất để bắt đầu hành trình chinh phục tiếng Anh.",
    youtubeId: "uA0y6_i-wSg",
    thumbnail: "https://img.youtube.com/vi/uA0y6_i-wSg/mqdefault.jpg"
  },
  {
    id: 'v8',
    title: "Cách phát âm âm TH chuẩn như người bản xứ",
    level: "A2",
    description: "Hướng dẫn chi tiết cách đặt lưỡi và khẩu hình để phát âm chính xác âm TH.",
    youtubeId: "h_4-Y_k1G-A",
    thumbnail: "https://img.youtube.com/vi/h_4-Y_k1G-A/mqdefault.jpg"
  },
  {
    id: 'v9',
    title: "Học tiếng Anh qua phim Friends",
    level: "B1",
    description: "Luyện nghe và học từ vựng giao tiếp qua một cảnh phim hài hước và kinh điển.",
    youtubeId: "SoE55pWzP5o",
    thumbnail: "https://img.youtube.com/vi/SoE55pWzP5o/mqdefault.jpg"
  },
  {
    id: 'v10',
    title: "10 lỗi ngữ pháp phổ biến người học hay mắc phải",
    level: "B2",
    description: "Nhận biết và sửa những lỗi ngữ pháp thường gặp để viết và nói chính xác hơn.",
    youtubeId: "pplDWUo2S-I",
    thumbnail: "https://img.youtube.com/vi/pplDWUo2S-I/mqdefault.jpg"
  },
  {
    id: 'v11',
    title: "Làm chủ âm Schwa /ə/ - Âm thanh phổ biến nhất",
    level: "B1",
    description: "Học cách phát âm âm schwa, âm thanh quan trọng và xuất hiện nhiều nhất trong tiếng Anh.",
    youtubeId: "kznEutbY4_4",
    thumbnail: "https://img.youtube.com/vi/kznEutbY4_4/mqdefault.jpg"
  },
  {
    id: 'v12',
    title: "15 Cụm Động từ (Phrasal Verbs) người Việt hay dùng",
    level: "B1",
    description: "Nắm vững các cụm động từ phổ biến được giải thích rõ ràng bằng tiếng Việt.",
    youtubeId: "Zz-f1-_Y-pA",
    thumbnail: "https://img.youtube.com/vi/Zz-f1-_Y-pA/mqdefault.jpg"
  },
  {
    id: 'v13',
    title: "Luyện nghe tiếng Anh qua truyện ngắn 'The Stranger'",
    level: "B2",
    description: "Cải thiện kỹ năng nghe và từ vựng của bạn qua một câu chuyện ngắn hấp dẫn có phụ đề.",
    youtubeId: "JqAMm5g-c_w",
    thumbnail: "https://img.youtube.com/vi/JqAMm5g-c_w/mqdefault.jpg"
  },
  {
    id: 'v14',
    title: "Kỹ năng thuyết trình: Nói để người khác muốn nghe",
    level: "C1",
    description: "Học các kỹ năng và bí quyết để có một bài nói chuyện, thuyết trình lôi cuốn và mạnh mẽ từ chuyên gia Julian Treasure.",
    youtubeId: "eIho2S0ZahI",
    thumbnail: "https://img.youtube.com/vi/eIho2S0ZahI/mqdefault.jpg"
  },
];
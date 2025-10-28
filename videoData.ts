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
];

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 3000 Từ Tiếng Anh - Học Tiếng Anh Cùng AI

Nền tảng học tiếng Anh toàn diện với sự trợ giúp của AI, theo lộ trình CEFR. Luyện tập đủ 4 kỹ năng Nghe - Nói - Đọc - Viết.

## ✨ Features

- **📚 Học từ vựng**: Hơn 3000 từ tiếng Anh theo chủ đề với flashcards tương tác
- **🧠 Spaced Repetition System (SRS)**: Hệ thống ôn tập lặp lại ngắt quãng thông minh
- **🎯 Placement Test**: Kiểm tra định cấp độ theo CEFR (A1-C2)
- **📖 Quiz & Reading**: Luyện tập với quiz và phòng đọc
- **🎧 Listening Practice**: Luyện nghe với AI-generated content
- **💬 Conversation Practice**: Thực hành hội thoại với AI
- **📝 Grammar Lessons**: Bài học ngữ pháp từ cơ bản đến nâng cao
- **🗣️ Pronunciation**: Luyện phát âm với feedback
- **📊 Progress Tracking**: Theo dõi tiến độ và streak học tập hằng ngày
- **🤖 AI Integration**: Tích hợp Google Gemini AI cho trải nghiệm học tập cá nhân hóa

## 🚀 Getting Started

### Prerequisites

- **Node.js** (version 16 or higher)
- **npm** or **yarn**
- **Gemini API Key** (get it from [Google AI Studio](https://ai.google.dev/))

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/LongNgn204/3000tutienganh.git
   cd 3000tutienganh
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env.local
   ```

4. Set the `GEMINI_API_KEY` in `.env.local`:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm run preview
```

## 🏗️ Tech Stack

- **React 19** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool & Dev Server
- **Tailwind CSS** - Styling
- **Google Gemini AI** - AI Integration
- **LocalStorage / Backend API** - Data Persistence

## 📁 Project Structure

```
├── components/          # React components
│   ├── AuthView.tsx
│   ├── DashboardView.tsx
│   ├── FlashcardView.tsx
│   ├── QuizView.tsx
│   └── ...
├── services/           # Business logic & API
│   ├── api.ts
│   ├── localStorageService.ts
│   └── srsService.ts
├── constants.ts        # Word data & constants
├── types.ts           # TypeScript type definitions
├── App.tsx            # Main application component
└── index.tsx          # Entry point
```

## 🔧 Configuration

The app supports both localStorage (client-side) and backend API for data persistence.

To use a backend API, set the `BACKEND_API_URL` in `services/api.ts`:

```typescript
const BACKEND_API_URL = 'https://your-api-server.com';
```

Leave it empty to use localStorage as fallback.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**View this app in AI Studio**: https://ai.studio/apps/drive/1-XQraZygbLi5zW0qlNVQFeQlQBJf--fe

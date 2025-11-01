# Copilot Instructions for 3000 Từ Tiếng Anh

## Project Overview
This is a comprehensive English learning platform powered by AI, following the CEFR framework. The application helps users practice all four language skills: Listening, Speaking, Reading, and Writing.

## Tech Stack
- **React 19** - UI Framework with lazy loading for performance
- **TypeScript** - Type-safe development
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling (implied from codebase)
- **Google Gemini AI** - AI integration via `@google/genai` package
- **LocalStorage / Backend API** - Dual persistence strategy

## Key Features
- 3000+ vocabulary words with flashcards
- Spaced Repetition System (SRS) for review
- CEFR Placement Test (A1-C2)
- Quiz, Reading, Listening, Conversation, and Pronunciation practice
- Grammar lessons (basic and advanced)
- Daily progress tracking and streak system
- AI-powered personalized learning

## Architecture & File Structure

```
├── components/          # React components (lazy-loaded)
│   ├── *View.tsx       # Main view components for different modes
│   ├── *Modal.tsx      # Modal dialogs
│   └── *.tsx           # Reusable components
├── services/           # Business logic & external integrations
│   ├── aiService.ts    # Singleton AI service with caching
│   ├── api.ts          # Backend API or localStorage fallback
│   ├── localStorageService.ts
│   └── srsService.ts   # Spaced repetition logic
├── utils/              # Utility functions
├── constants.ts        # Word data and constants (large file ~128KB)
├── types.ts           # TypeScript type definitions
├── App.tsx            # Main application with routing logic
└── index.tsx          # Entry point
```

## Coding Standards

### TypeScript
- Always use strict typing; avoid `any` types
- Define interfaces in `types.ts` for domain models
- Use proper type exports: `export type` for types, `export interface` for interfaces
- Leverage the existing types: `Word`, `Category`, `User`, `StudyProgress`, `ViewMode`, `CEFRLevel`, etc.

### React
- Use functional components with hooks
- Implement lazy loading with `React.lazy()` for route-based components
- Use `Suspense` with a loading fallback
- Keep components focused and single-responsibility
- Use `useMemo` for expensive computations
- Use `useRef` for DOM references and mutable values

### Component Patterns
- Views: Full-page components (e.g., `FlashcardView`, `QuizView`)
- Modals: Dialog overlays (e.g., `AIExplainModal`)
- Reusable: Shared components (e.g., `SpeakerButton`, `WordCard`)

### State Management
- Use local state (`useState`) for component-specific state
- Lift state up to `App.tsx` for shared state
- Pass data via props, not global state
- Study progress stored in both state and localStorage/API

## AI Integration Guidelines

### AI Service Usage
- Import from `services/aiService.ts`
- Use the singleton instance: `aiService.getInstance()`
- Prefer streaming for better UX: `generateContentStream()`
- Use caching for repeated requests: `{ useCache: true }`

### Model Selection
- Use `AI_MODELS.FLASH_8B` (`gemini-1.5-flash-8b`) for fast, efficient responses - ideal for quick interactions
- Use `AI_MODELS.FLASH` (`gemini-1.5-flash`) for more complex tasks requiring better understanding

### Configuration Presets
- `AI_CONFIG.FAST` - Quick responses (temperature: 0.5)
- `AI_CONFIG.BALANCED` - Standard (temperature: 0.7)
- `AI_CONFIG.CREATIVE` - More variety (temperature: 0.9)

### Example Usage
```typescript
import { aiService, AI_MODELS, AI_CONFIG } from './services/aiService';

// With caching
const response = await aiService.generateContent(
  AI_MODELS.FLASH_8B,
  prompt,
  { useCache: true, ...AI_CONFIG.FAST }
);

// With streaming
for await (const chunk of aiService.generateContentStream(
  AI_MODELS.FLASH_8B,
  prompt,
  AI_CONFIG.BALANCED
)) {
  // Process chunk
}
```

## Environment Variables
- `GEMINI_API_KEY` - Required for AI features
  - Defined in `.env.local` as `GEMINI_API_KEY`
  - Transformed by Vite config to `process.env.API_KEY` in the code
  - See `vite.config.ts` for the mapping
- `BACKEND_API_URL` - Optional; uses localStorage if not set
- Store in `.env.local` (not committed)
- Use `.env.example` as template

## Build & Development

### Commands
- `npm install` - Install dependencies
- `npm run dev` - Start dev server (port 3000)
- `npm run build` - Production build
- `npm run preview` - Preview production build

### Build Output
- Output directory: `dist/`
- Code splitting enabled for lazy-loaded components
- Optimized with tree-shaking

## Data Persistence Strategy
The app supports dual persistence:
1. **Backend API**: If `BACKEND_API_URL` is configured
2. **LocalStorage**: Fallback if no backend or API fails

Services to use:
- `services/api.ts` - Handles both strategies
- `services/localStorageService.ts` - Direct localStorage access
- `services/srsService.ts` - SRS algorithm implementation

## Important Conventions

### View Modes
ViewMode enum in `types.ts` controls main app routing:
- `'auth'` - Login/Register
- `'dashboard'` - Main dashboard
- `'list'` - Word list
- `'flashcard'` - Flashcard practice
- `'quiz'` - Quiz mode
- `'story'` - AI-generated stories
- `'reading'` - Reading room
- `'listening'` - Listening practice
- `'conversation'` - AI conversation
- `'pronunciation'` - Pronunciation practice
- `'grammar'` - Grammar lessons
- `'advanced-grammar'` - Advanced grammar
- `'placement-test'` - CEFR placement test
- `'placement-test-result'` - Test results

### CEFR Levels
Use the `CEFRLevel` type: `'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'`

### Word Categories
Defined in `constants.ts` as `WORD_CATEGORIES` array with structure:
```typescript
{ id: string, name: string, words: Word[] }
```

## Performance Considerations
- Components are lazy-loaded to reduce initial bundle size
- AI service uses singleton pattern to reuse client instances
- Implement caching for AI requests when appropriate
- Use streaming for long AI responses to improve perceived performance
- Temperature and token limits can be tuned for speed vs. quality

## Security Notes
- Never commit `.env.local` or API keys
- API keys are injected at build time via Vite's `define`
- Passwords are hashed (see `utils/passwordUtils.ts`)
- Validate user input before AI prompts

## Testing
- No test framework is currently configured
- Manual testing recommended after changes
- Test in dev mode before building for production

## Common Pitfalls to Avoid
- Don't access `process.env.GEMINI_API_KEY` directly; Vite maps it to `process.env.API_KEY`
- Don't modify `constants.ts` structure without updating all consumers
- Don't create new AI client instances; use `aiService` singleton
- Don't forget to handle loading/error states in AI interactions
- Don't break the dual persistence strategy in `services/api.ts`

## When Adding New Features
1. Define types in `types.ts`
2. Create service layer if needed
3. Implement component with lazy loading if it's a view
4. Update `ViewMode` type if adding new route
5. Handle AI interactions via `aiService`
6. Support both localStorage and API persistence
7. Build and test before committing

## Vietnamese Language Notes
- UI text is in Vietnamese for Vietnamese-speaking learners
- Code comments and docs can be in English
- Variable names should be in English
- User-facing strings are in Vietnamese

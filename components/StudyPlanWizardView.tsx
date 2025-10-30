import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import type { User, StudyPlan, UserStudyPlanInput, CEFRLevel } from '../types';
import { CEFR_LEVEL_MAP } from '../cefr';
import { WORD_CATEGORIES } from '../constants';
import { CONTENT_LIBRARY } from '../contentLibrary';

interface StudyPlanWizardViewProps {
    currentUser: User;
    onCreatePlan: (plan: StudyPlan, planInput: UserStudyPlanInput) => void;
}

const steps = [
    { id: 1, title: "Mục tiêu học tập" },
    { id: 2, title: "Trình độ" },
    { id: 3, title: "Thời gian học" },
    { id: 4, title: "Ưu tiên kỹ năng" },
    { id: 5, title: "Xác nhận & Tạo" }
];

const loadingMessages = [
    "Phân tích mục tiêu học tập của bạn...",
    "Đánh giá các kỹ năng ưu tiên...",
    "Xây dựng lịch trình học tập cho 7 ngày...",
    "Phân bổ các hoạt động phù hợp...",
    "Sắp xếp các bài ôn tập thông minh...",
    "Hoàn tất lộ trình!"
];

const StudyPlanWizardView: React.FC<StudyPlanWizardViewProps> = ({ currentUser, onCreatePlan }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generationStatus, setGenerationStatus] = useState(loadingMessages[0]);

    // Form state
    const [goal, setGoal] = useState<string>('Giao tiếp công việc');
    const [targetLevel, setTargetLevel] = useState<CEFRLevel>(currentUser.level);
    const [timePerDay, setTimePerDay] = useState<number>(30);
    const [skillPriorities, setSkillPriorities] = useState<string[]>([
        "Từ vựng & Ngữ pháp",
        "Nói & Giao tiếp",
        "Nghe & Phát âm",
        "Đọc & Viết",
    ]);
    const [draggedSkill, setDraggedSkill] = useState<string | null>(null);

    useEffect(() => {
        // Fix: Use ReturnType<typeof setInterval> for browser compatibility instead of NodeJS.Timeout.
        let timer: ReturnType<typeof setInterval>;
        if (isLoading) {
            let index = 0;
            setGenerationStatus(loadingMessages[index]);
            timer = setInterval(() => {
                index++;
                if (index < loadingMessages.length) {
                    setGenerationStatus(loadingMessages[index]);
                } else {
                    clearInterval(timer);
                }
            }, 2000);
        }
        return () => clearInterval(timer);
    }, [isLoading]);


    const handleDragStart = (e: React.DragEvent<HTMLLIElement>, skill: string) => {
        e.dataTransfer.setData("skillName", skill);
        setDraggedSkill(skill);
    };

    const handleDrop = (e: React.DragEvent<HTMLLIElement>, dropSkill: string) => {
        e.preventDefault();
        const draggedSkillName = e.dataTransfer.getData("skillName");
        
        const dragIndex = skillPriorities.findIndex(s => s === draggedSkillName);
        const dropIndex = skillPriorities.findIndex(s => s === dropSkill);

        if (dragIndex === -1 || dropIndex === -1 || dragIndex === dropIndex) {
            setDraggedSkill(null);
            return;
        };

        const newSkills = [...skillPriorities];
        const [removed] = newSkills.splice(dragIndex, 1);
        newSkills.splice(dropIndex, 0, removed);
        setSkillPriorities(newSkills);
        setDraggedSkill(null);
    };

    const handleDragEnd = () => {
        setDraggedSkill(null);
    };


    const generatePlan = async () => {
        setIsLoading(true);
        setError(null);

        const planInput: UserStudyPlanInput = { goal, timePerDay, skillPriorities, targetLevel };
        
        // Prepare a detailed catalog of available content, filtered by user's level.
        const cefrOrder: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
        const userLevelIndex = cefrOrder.indexOf(currentUser.level);
        // Include user's current level and one level above for a challenge.
        const relevantLevels: CEFRLevel[] = [currentUser.level];
        if (userLevelIndex < cefrOrder.length - 1) {
            relevantLevels.push(cefrOrder[userLevelIndex + 1]);
        }

        const availableFlashcards = WORD_CATEGORIES
            .filter(cat => relevantLevels.includes(cat.level))
            .map(cat => `{id: "${cat.id}", name: "${cat.name}"}`);
            
        const availableReadings = CONTENT_LIBRARY.reading
            .filter(art => relevantLevels.includes(art.level))
            .map(art => `{id: "${art.id}", title: "${art.title}"}`);

        const availableListenings = CONTENT_LIBRARY.listening
            .filter(ex => relevantLevels.includes(ex.level))
            .map(ex => `{id: "${ex.id}", title: "${ex.title}"}`);
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Act as an expert language learning curriculum designer for a Vietnamese learner. Based on the user's profile, goals, and a list of available content, create a personalized 7-day study plan.

User Profile:
- Current CEFR Level: ${currentUser.level}
- Target CEFR Level: ${planInput.targetLevel}
- Goal: ${planInput.goal}
- Time per day: ${planInput.timePerDay} minutes
- Skill Priority Order: ${planInput.skillPriorities.join(', ')}

**Available Content Catalog (pre-filtered for the user's level):**
- Flashcard Categories: [${availableFlashcards.join(', ')}]
- Reading Articles: [${availableReadings.join(', ')}]
- Listening Exercises: [${availableListenings.join(', ')}]

**CRITICAL Instructions:**
1. Create a plan for 7 days, labeled "day1" through "day7".
2. Each day's total task duration MUST NOT exceed the user's "Time per day".
3. Distribute tasks based on skill priorities. Higher priority skills should appear more frequently.
4. Each task must have 'id', 'description' (in Vietnamese), 'type', 'duration' (in minutes), and 'completed' (set to false).
5. For tasks of type 'flashcard_new', 'flashcard_review', 'reading', or 'listening', you MUST include a 'targetId' field.
6. The 'targetId' for these tasks **MUST BE CHOSEN EXCLUSIVELY** from the "Available Content Catalog" provided above. **DO NOT invent new IDs or use IDs not present in the lists.**
7. The 'description' for these tasks **MUST CORRESPOND** to the title/name provided in the catalog for the chosen 'targetId'. For example, if you select the reading 'targetId': 'b1-remote-work', the description MUST be "Luyện đọc bài 'The Rise of Remote Work'".
8. Return ONLY the valid JSON object.`;

            const taskSchema = {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING, description: "A unique ID for the task, e.g., task-YYYYMMDD-N" },
                    description: { type: Type.STRING, description: "Task description in Vietnamese." },
                    type: { type: Type.STRING, description: "The type of activity." },
                    duration: { type: Type.INTEGER, description: "Duration in minutes." },
                    completed: { type: Type.BOOLEAN },
                    targetId: { type: Type.STRING, description: "Optional ID for specific content, required for flashcard, reading, and listening tasks." }
                },
                required: ['id', 'description', 'type', 'duration', 'completed']
            };

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            day1: { type: Type.ARRAY, items: taskSchema },
                            day2: { type: Type.ARRAY, items: taskSchema },
                            day3: { type: Type.ARRAY, items: taskSchema },
                            day4: { type: Type.ARRAY, items: taskSchema },
                            day5: { type: Type.ARRAY, items: taskSchema },
                            day6: { type: Type.ARRAY, items: taskSchema },
                            day7: { type: Type.ARRAY, items: taskSchema },
                        },
                        required: ['day1', 'day2', 'day3', 'day4', 'day5', 'day6', 'day7']
                    }
                }
            });

            const plan: StudyPlan = JSON.parse(response.text);
            
            onCreatePlan(plan, planInput);

        } catch (err) {
            console.error("Gemini Plan Generation Error:", err);
            setError("Rất tiếc, AI không thể tạo lộ trình học lúc này. Vui lòng thử lại sau.");
            setIsLoading(false); // Make sure loading stops on error
        }
    };
    
    const renderStepContent = () => {
        switch (currentStep) {
            case 1: // Goal
                return (
                    <div className="space-y-3">
                        {['Giao tiếp công việc', 'Du lịch & Khám phá', 'Luyện thi (IELTS/TOEIC)', 'Cải thiện toàn diện'].map(g => (
                            <button key={g} onClick={() => setGoal(g)} className={`w-full text-left p-4 border-2 rounded-lg font-semibold transition-all ${goal === g ? 'bg-indigo-50 border-indigo-500' : 'border-slate-300 hover:border-indigo-400'}`}>
                                {g}
                            </button>
                        ))}
                    </div>
                );
             case 2: // Level
                return (
                    <div>
                        <p className="text-sm text-slate-500 mb-4">Lộ trình học sẽ được tạo dựa trên trình độ bạn chọn.</p>
                        <div className="space-y-3">
                            {(Object.keys(CEFR_LEVEL_MAP) as CEFRLevel[]).map(level => (
                                <button key={level} onClick={() => setTargetLevel(level)} className={`w-full text-left p-4 border-2 rounded-lg font-semibold transition-all ${targetLevel === level ? 'bg-indigo-50 border-indigo-500' : 'border-slate-300 hover:border-indigo-400'}`}>
                                    {CEFR_LEVEL_MAP[level].name}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 3: // Time
                return (
                    <div className="space-y-3">
                        {[15, 30, 45, 60].map(t => (
                            <button key={t} onClick={() => setTimePerDay(t)} className={`w-full text-left p-4 border-2 rounded-lg font-semibold transition-all ${timePerDay === t ? 'bg-indigo-50 border-indigo-500' : 'border-slate-300 hover:border-indigo-400'}`}>
                                {t} phút / ngày
                            </button>
                        ))}
                    </div>
                );
            case 4: // Skills
                return (
                    <div>
                        <p className="text-sm text-slate-500 mb-4">Kéo thả để sắp xếp theo thứ tự ưu tiên từ cao đến thấp.</p>
                        <ul className="space-y-3">
                            {skillPriorities.map((skill, index) => (
                                <li
                                    key={skill}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, skill)}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => handleDrop(e, skill)}
                                    onDragEnd={handleDragEnd}
                                    className={`p-4 border-2 rounded-lg font-semibold flex items-center gap-4 cursor-grab active:cursor-grabbing bg-white transition-all duration-200 hover:border-indigo-400 hover:bg-indigo-50 
                                        ${draggedSkill === skill ? 'opacity-40 scale-105 shadow-2xl' : 'border-slate-300'}
                                    `}
                                >
                                    <span className="font-bold text-indigo-600 w-4 text-center">{index + 1}</span>
                                    <span>{skill}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            case 5: // Confirm
                return (
                    <div className="space-y-4 text-left p-4 bg-slate-50 rounded-lg border">
                        <div>
                            <p className="font-semibold text-slate-700">Mục tiêu:</p>
                            <p className="text-indigo-700">{goal}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-slate-700">Trình độ mục tiêu:</p>
                            <p className="text-indigo-700">{CEFR_LEVEL_MAP[targetLevel].name}</p>
                        </div>
                         <div>
                            <p className="font-semibold text-slate-700">Thời gian:</p>
                            <p className="text-indigo-700">{timePerDay} phút / ngày</p>
                        </div>
                         <div>
                            <p className="font-semibold text-slate-700">Ưu tiên kỹ năng:</p>
                            <ol className="list-decimal list-inside text-indigo-700">
                                {skillPriorities.map(s => <li key={s}>{s}</li>)}
                            </ol>
                        </div>
                    </div>
                );
            default: return null;
        }
    }

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 w-full animate-fade-in-up">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200">
                <div className="p-6 border-b">
                    <h1 className="text-2xl font-bold text-slate-800 text-center">Tạo Lộ Trình Học Tập Cá Nhân</h1>
                    <div className="flex justify-between items-center mt-4 max-w-full mx-auto">
                        {steps.map((step, index) => (
                            <React.Fragment key={step.id}>
                                <div className="flex flex-col items-center text-center w-20">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all ${currentStep >= step.id ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                        {currentStep > step.id ? '✓' : step.id}
                                    </div>
                                    <p className={`mt-1 text-xs font-semibold ${currentStep >= step.id ? 'text-indigo-600' : 'text-slate-500'}`}>{step.title}</p>
                                </div>
                                {index < steps.length - 1 && <div className={`flex-1 h-1 mx-2 ${currentStep > index + 1 ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <div className="p-8 min-h-[300px]">
                     {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
                             <svg className="animate-spin h-12 w-12 text-indigo-600 mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p className="font-semibold text-lg text-slate-700 transition-all duration-500">{generationStatus}</p>
                            <p className="text-slate-500 mt-2">AI đang xây dựng kế hoạch tốt nhất cho bạn...</p>
                        </div>
                    ) : (
                         <>
                            {error && <p className="text-red-600 bg-red-50 p-3 rounded-md mb-4">{error}</p>}
                            {renderStepContent()}
                         </>
                    )}
                </div>

                <div className="p-6 bg-slate-50 rounded-b-2xl flex justify-between items-center">
                    <button 
                        onClick={() => setCurrentStep(prev => prev - 1)}
                        disabled={currentStep === 1 || isLoading}
                        className="px-6 py-2 font-semibold text-slate-700 rounded-lg hover:bg-slate-200 disabled:opacity-50"
                    >
                        Quay lại
                    </button>
                    {currentStep < steps.length ? (
                        <button 
                            onClick={() => setCurrentStep(prev => prev + 1)}
                            className="px-6 py-2 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                        >
                            Tiếp theo
                        </button>
                    ) : (
                        <button 
                            onClick={generatePlan}
                            disabled={isLoading}
                            className="px-6 py-2 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-slate-400"
                        >
                            Tạo lộ trình
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudyPlanWizardView;

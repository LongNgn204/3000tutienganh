import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import type { User, StudyPlan, UserStudyPlanInput, CEFRLevel } from '../types';
import { CEFR_LEVEL_MAP } from '../cefr';

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

const StudyPlanWizardView: React.FC<StudyPlanWizardViewProps> = ({ currentUser, onCreatePlan }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Act as an expert language learning curriculum designer for a Vietnamese learner. Based on the user's profile and goals, create a personalized 7-day study plan.

User Profile:
- Target CEFR Level: ${planInput.targetLevel}
- Goal: ${planInput.goal}
- Time per day: ${planInput.timePerDay} minutes
- Skill Priority Order: ${planInput.skillPriorities.join(', ')}

Available Activity Types:
- 'flashcard_review': Review learned words using SRS.
- 'flashcard_new': Learn new words.
- 'reading': Do a guided reading exercise.
- 'listening': Do a guided listening exercise.
- 'conversation': Practice speaking with the AI tutor.
- 'pronunciation': Practice pronunciation of a specific word.
- 'role-play': Practice a specific real-life scenario.
- 'grammar': Review a grammar topic.
- 'quiz': Take a vocabulary quiz.
- 'writing': Do an AI-guided writing exercise.

Instructions:
1. Create a plan for 7 days, labeled "day1" through "day7".
2. Each day should have a list of tasks. The total duration of tasks for a day should not exceed the user's "Time per day".
3. Distribute tasks based on the user's skill priorities. The highest priority skills should appear more frequently.
4. Each task must be a JSON object with 'id', 'description' (in Vietnamese), 'type', 'duration' (in minutes), and 'completed' (set to false).
5. For 'reading', 'listening', and 'role-play', you can optionally add a 'targetId' field with a suggested topic (e.g., 'a2-daily-routine' for reading, 'order-coffee' for role-play).

Return ONLY a valid JSON object representing the 7-day plan. Do not include any other text or markdown formatting.

Example for one day:
"day1": [
  { "id": "task-20240728-1", "description": "Ôn tập 20 từ vựng cần xem lại", "type": "flashcard_review", "duration": 10, "completed": false },
  { "id": "task-20240728-2", "description": "Luyện nói về chủ đề công việc", "type": "conversation", "duration": 15, "completed": false },
  { "id": "task-20240728-3", "description": "Xem lại thì Hiện tại Hoàn thành", "type": "grammar", "duration": 5, "completed": false }
]`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            const jsonText = response.text.replace(/```json|```/g, '').trim();
            const plan: StudyPlan = JSON.parse(jsonText);
            
            onCreatePlan(plan, planInput);

        } catch (err) {
            console.error("Gemini Plan Generation Error:", err);
            setError("Rất tiếc, AI không thể tạo lộ trình học lúc này. Vui lòng thử lại sau.");
        } finally {
            setIsLoading(false);
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
                    {error && <p className="text-red-600 bg-red-50 p-3 rounded-md mb-4">{error}</p>}
                    {renderStepContent()}
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
                            {isLoading ? "AI đang tạo..." : "Tạo lộ trình"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudyPlanWizardView;
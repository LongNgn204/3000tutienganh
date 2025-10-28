import React, { useMemo } from 'react';
import type { User, Word, CEFRLevel, StudyPlanTask } from '../types';
import { CEFR_LEVEL_MAP } from '../cefr';

interface ProgressDashboardViewProps {
  currentUser: User;
  allWords: Word[];
}

const StatCard: React.FC<{ title: string; value: string | number; description: string; icon: React.ReactNode }> = ({ title, value, description, icon }) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
        <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <div className="text-indigo-500">{icon}</div>
        </div>
        <p className="mt-2 text-3xl font-bold text-slate-800">{value}</p>
        <p className="text-xs text-slate-500">{description}</p>
    </div>
);

const ProgressBar: React.FC<{ value: number; maxValue: number; color: string }> = ({ value, maxValue, color }) => (
    <div className="w-full bg-slate-200 rounded-full h-2.5">
        <div className={`${color} h-2.5 rounded-full`} style={{ width: `${(value / maxValue) * 100}%` }}></div>
    </div>
);

const ProgressDashboardView: React.FC<ProgressDashboardViewProps> = ({ currentUser, allWords }) => {
    
    const overallProgress = useMemo(() => {
        const learnedCount = Object.keys(currentUser.studyProgress || {}).length;
        const totalWords = allWords.length;
        const percentage = totalWords > 0 ? Math.round((learnedCount / totalWords) * 100) : 0;
        return { learnedCount, totalWords, percentage };
    }, [currentUser.studyProgress, allWords]);
    
    const skillProgress = useMemo(() => {
        if (!currentUser.studyPlan) return null;
        const skillMap: Record<string, { total: number; completed: number }> = {
            'Đọc & Viết': { total: 0, completed: 0 },
            'Nghe & Phát âm': { total: 0, completed: 0 },
            'Nói & Giao tiếp': { total: 0, completed: 0 },
            'Từ vựng & Ngữ pháp': { total: 0, completed: 0 },
        };
        const taskTypeToSkill: Record<StudyPlanTask['type'], string> = {
            reading: 'Đọc & Viết', writing: 'Đọc & Viết',
            listening: 'Nghe & Phát âm', pronunciation: 'Nghe & Phát âm',
            conversation: 'Nói & Giao tiếp', 'role-play': 'Nói & Giao tiếp',
            flashcard_new: 'Từ vựng & Ngữ pháp', flashcard_review: 'Từ vựng & Ngữ pháp', grammar: 'Từ vựng & Ngữ pháp', quiz: 'Từ vựng & Ngữ pháp'
        };

        Object.values(currentUser.studyPlan).flat().forEach(task => {
            const skill = taskTypeToSkill[task.type];
            if (skill && skillMap[skill]) {
                skillMap[skill].total++;
                if (task.completed) {
                    skillMap[skill].completed++;
                }
            }
        });
        
        return Object.entries(skillMap).map(([skill, data]) => ({
            skill,
            ...data,
            percentage: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0
        })).sort((a,b) => b.percentage - a.percentage); // Strongest first
    }, [currentUser.studyPlan]);
    
    const strongestSkill = skillProgress && skillProgress[0].percentage > 0 ? skillProgress[0].skill : 'Chưa xác định';
    const weakestSkill = skillProgress && skillProgress[skillProgress.length - 1].percentage < 100 ? skillProgress[skillProgress.length - 1].skill : 'Chưa xác định';

    return (
        <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
            <div className="text-left mb-10">
                <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Báo cáo Tiến độ</h1>
                <p className="mt-3 max-w-2xl text-xl text-slate-500">
                    Phân tích chi tiết về hành trình học tập và các kỹ năng của bạn.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard 
                    title="Từ đã học" 
                    value={`${overallProgress.learnedCount} / ${overallProgress.totalWords}`} 
                    description={`${overallProgress.percentage}% toàn bộ từ vựng`}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10.392C3.057 14.71 4.245 14 5.5 14c1.255 0 2.443.29 3.5.804V4.804zM14.5 4c-1.255 0-2.443.29-3.5.804v10.392c1.057.514 2.245.804 3.5.804c1.255 0 2.443-.29 3.5-.804V4.804C16.943 4.29 15.755 4 14.5 4z" /></svg>}
                />
                <StatCard 
                    title="Chuỗi ngày học" 
                    value={currentUser.dailyProgress?.streak ?? 0}
                    description="Ngày học liên tiếp"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.934l-6.5 11.9a1 1 0 001.64 1.065l6.5-11.9a1 1 0 00-.385-1.45z" clipRule="evenodd" /><path fillRule="evenodd" d="M8.343 3.404a1 1 0 011.414 0l6.25 6.25a1 1 0 010 1.414l-6.25 6.25a1 1 0 01-1.414-1.414L13.586 11H3a1 1 0 110-2h10.586L8.343 4.818a1 1 0 010-1.414z" clipRule="evenodd" /></svg>}
                />
                 <StatCard 
                    title="Kỹ năng mạnh nhất" 
                    value={strongestSkill}
                    description="Dựa trên lộ trình học"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" /></svg>}
                />
                <StatCard 
                    title="Kỹ năng cần cải thiện" 
                    value={weakestSkill}
                    description="Dựa trên lộ trình học"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>}
                />
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Phân tích Kỹ năng Tuần này</h2>
                {skillProgress ? (
                    <div className="space-y-6">
                        {skillProgress.map(({ skill, completed, total, percentage }) => (
                            <div key={skill}>
                                <div className="flex justify-between items-center mb-1">
                                    <p className="font-semibold text-slate-700">{skill}</p>
                                    <p className="text-sm font-medium text-slate-500">{completed}/{total} nhiệm vụ</p>
                                </div>
                                <ProgressBar value={percentage} maxValue={100} color="bg-indigo-600"/>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-slate-500 text-center py-8">Bạn chưa có Lộ trình học tập. Hãy tạo một lộ trình để bắt đầu theo dõi tiến độ kỹ năng!</p>
                )}
            </div>
        </div>
    );
};

export default ProgressDashboardView;

import React from 'react';
import type { StudyPlanTask, ViewMode } from '../types';

interface StudyPlanTaskItemProps {
    task: StudyPlanTask;
    onStartTask: (mode: ViewMode, options?: any) => void;
    onCompleteTask: (taskId: string) => void;
}

const ICONS: Record<StudyPlanTask['type'], React.ReactNode> = {
    flashcard_review: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" /><path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" /></svg>,
    flashcard_new: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>,
    reading: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10.392C3.057 14.71 4.245 14 5.5 14c1.255 0 2.443.29 3.5.804V4.804zM14.5 4c-1.255 0-2.443.29-3.5.804v10.392c1.057.514 2.245.804 3.5.804c1.255 0 2.443-.29 3.5-.804V4.804C16.943 4.29 15.755 4 14.5 4z" /></svg>,
    listening: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 8.168A1 1 0 008 9.118v1.764a1 1 0 001.555.832l3-1.764a1 1 0 000-1.664l-3-1.764z" clipRule="evenodd" /></svg>,
    conversation: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" /></svg>,
    pronunciation: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8h-1a6 6 0 11-12 0H3a7.001 7.001 0 006 6.93V17H7a1 1 0 100 2h6a1 1 0 100-2h-2v-2.07z" clipRule="evenodd" /></svg>,
    'role-play': <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.75.75 0 011.02.043 8.002 8.002 0 0111.985 0 .75.75 0 011.02-.043 9.502 9.502 0 00-14.025 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14.51 15.326a.75.75 0 011.02.043A8.003 8.003 0 0117 18.25a.75.75 0 11-1.44.438 6.503 6.503 0 00-11.12 0 .75.75 0 11-1.44-.438 8.003 8.003 0 012.92-2.88.75.75 0 011.02.043z" /></svg>,
    grammar: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v.755a4.5 4.5 0 016.364 4.108l.353.353a.75.75 0 11-1.06 1.06l-.354-.353a4.5 4.5 0 01-8.107 0l-.353.353a.75.75 0 01-1.06-1.06l.353-.353A4.5 4.5 0 019.25 4.505V3.75A.75.75 0 0110 3zm-2.25 6a2.25 2.25 0 114.5 0 2.25 2.25 0 01-4.5 0z" clipRule="evenodd" /><path d="M12.25 18a.75.75 0 00-1.5 0v-2.19c-2.443-1.01-4.25-3.328-4.25-6.06V9a.75.75 0 011.5 0v.75a4.75 4.75 0 009.5 0V9a.75.75 0 011.5 0v.75c0 2.732-1.807 5.05-4.25 6.06V18z" /></svg>,
    quiz: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6.22 8.22a.75.75 0 011.06 0l1.47 1.47a.75.75 0 001.06 0l1.47-1.47a.75.75 0 111.06 1.06l-1.47 1.47a.75.75 0 000 1.06l1.47 1.47a.75.75 0 11-1.06 1.06L10 12.56l-1.47 1.47a.75.75 0 11-1.06-1.06l1.47-1.47a.75.75 0 000-1.06L6.22 9.28a.75.75 0 010-1.06z" clipRule="evenodd" /><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM4 10a6 6 0 1112 0 6 6 0 01-12 0z" clipRule="evenodd" /></svg>,
    writing: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>,
};

const TASK_TYPE_TO_VIEW_MODE: Record<StudyPlanTask['type'], ViewMode> = {
    flashcard_review: 'flashcard',
    flashcard_new: 'flashcard',
    reading: 'reading',
    listening: 'listening',
    conversation: 'conversation',
    pronunciation: 'pronunciation',
    'role-play': 'role-play',
    grammar: 'grammar',
    quiz: 'quiz',
    writing: 'writing'
};

const StudyPlanTaskItem: React.FC<StudyPlanTaskItemProps> = ({ task, onStartTask, onCompleteTask }) => {

    const handleStart = () => {
        const viewMode = TASK_TYPE_TO_VIEW_MODE[task.type];
        const options: { initialFilter?: 'review' | 'new', initialCategory?: string } = {};

        if (task.type === 'flashcard_review') {
            options.initialFilter = 'review';
        }
        if (task.type === 'flashcard_new') {
            options.initialFilter = 'new';
        }
        
        if ((task.type === 'flashcard_new' || task.type === 'flashcard_review') && task.targetId) {
            options.initialCategory = task.targetId;
        }
        
        onStartTask(viewMode, options);
        onCompleteTask(task.id); 
    };

    return (
        <div className={`p-4 rounded-xl flex items-center gap-4 transition-all duration-300 ${task.completed ? 'bg-green-50 text-slate-500' : 'bg-slate-50 hover:bg-slate-100'}`}>
            <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-colors ${task.completed ? 'bg-green-100 text-green-600' : 'bg-indigo-100 text-indigo-600'}`}>
                {ICONS[task.type]}
            </div>
            <div className="flex-grow">
                <p className={`font-semibold ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>{task.description}</p>
                <p className="text-sm text-slate-500">{task.duration} phút</p>
            </div>
            <div className="w-28 text-right">
                {task.completed ? (
                     <div className="flex items-center justify-center gap-2 text-green-600 font-semibold">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                        <span>Xong!</span>
                     </div>
                ) : (
                    <button onClick={handleStart} className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all transform hover:scale-105">
                        Bắt đầu
                    </button>
                )}
            </div>
        </div>
    );
};

export default StudyPlanTaskItem;

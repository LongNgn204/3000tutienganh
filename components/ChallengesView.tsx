import React from 'react';
import type { User } from '../types';
import { CHALLENGES } from '../challengesData';

interface ChallengesViewProps {
    currentUser: User;
}

const ChallengesView: React.FC<ChallengesViewProps> = ({ currentUser }) => {
    const { challengeProgress } = currentUser;

    return (
        <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Thử Thách Hàng Tuần</h1>
                <p className="mt-3 max-w-2xl mx-auto text-xl text-slate-500">
                    Hoàn thành các nhiệm vụ để rèn luyện kỹ năng và nhận phần thưởng!
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {CHALLENGES.map(challenge => {
                    const progress = challengeProgress?.[challenge.id] ?? { current: 0, completed: false };
                    const percentage = Math.min(100, (progress.current / challenge.target) * 100);
                    const isCompleted = progress.completed;

                    return (
                        <div key={challenge.id} className={`bg-white p-6 rounded-2xl shadow-lg border-2 transition-all ${isCompleted ? 'border-green-500 bg-green-50' : 'border-slate-200'}`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className={`text-xl font-bold ${isCompleted ? 'text-green-800' : 'text-slate-800'}`}>{challenge.title}</h3>
                                    <p className={`mt-1 text-sm ${isCompleted ? 'text-green-700' : 'text-slate-500'}`}>{challenge.description}</p>
                                </div>
                                {isCompleted && (
                                    <div className="flex-shrink-0 bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <div className="mt-4">
                                <div className="flex justify-between mb-1 text-sm font-semibold">
                                    <span className={isCompleted ? 'text-green-700' : 'text-slate-600'}>Tiến độ</span>
                                    <span className={isCompleted ? 'text-green-700' : 'text-slate-600'}>{progress.current} / {challenge.target}</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-2.5">
                                    <div 
                                        className={`h-2.5 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-indigo-600'}`} 
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ChallengesView;
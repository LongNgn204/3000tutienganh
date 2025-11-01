import React, { useState, useEffect } from 'react';
import * as api from '../services/api';
import type { User } from '../types';

interface LeaderboardViewProps {
    currentUser: User;
}

const LeaderboardView: React.FC<LeaderboardViewProps> = ({ currentUser }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            const allUsers = await api.getAllUsers();
            const sortedUsers = allUsers
                .filter(u => u.dailyProgress && u.level) // Only include users with progress
                .sort((a, b) => (b.dailyProgress?.streak ?? 0) - (a.dailyProgress?.streak ?? 0));
            setUsers(sortedUsers);
            setIsLoading(false);
        };
        fetchUsers();
    }, []);

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center h-full">
                <div className="w-14 h-14 border-4 border-slate-200 border-b-indigo-500 rounded-full animate-spin"></div>
            </div>
        );
    }
    
    const currentUserRank = users.findIndex(u => u.name === currentUser.name) + 1;

    return (
        <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Bảng Xếp Hạng</h1>
                <p className="mt-3 max-w-2xl mx-auto text-xl text-slate-500">
                    Xem thứ hạng của bạn và những người học hàng đầu dựa trên chuỗi ngày học.
                </p>
            </div>
            
            {currentUserRank > 0 && (
                 <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-indigo-500 mb-8">
                    <h2 className="text-xl font-bold text-center text-slate-800">Vị trí của bạn</h2>
                     <div className="flex items-center justify-between mt-4 text-lg">
                        <div className="flex items-center gap-4">
                            <span className="font-bold text-indigo-600 w-8 text-center">{currentUserRank}</span>
                             <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                                {currentUser.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-bold text-slate-800">{currentUser.name} (Bạn)</span>
                        </div>
                        <div className="flex items-center gap-2 font-bold text-orange-500">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.934l-6.5 11.9a1 1 0 001.64 1.065l6.5-11.9a1 1 0 00-.385-1.45z" clipRule="evenodd" /><path fillRule="evenodd" d="M8.343 3.404a1 1 0 011.414 0l6.25 6.25a1 1 0 010 1.414l-6.25 6.25a1 1 0 01-1.414-1.414L13.586 11H3a1 1 0 110-2h10.586L8.343 4.818a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                           <span>{currentUser.dailyProgress?.streak ?? 0} ngày</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                <ul className="divide-y divide-slate-200">
                    {users.map((user, index) => {
                        const isCurrentUser = user.name === currentUser.name;
                        const rank = index + 1;
                        let rankColor = 'bg-slate-200 text-slate-600';
                        if (rank === 1) rankColor = 'bg-yellow-400 text-yellow-900';
                        if (rank === 2) rankColor = 'bg-slate-300 text-slate-700';
                        if (rank === 3) rankColor = 'bg-yellow-600/70 text-white';

                        return (
                            <li key={user.name} className={`p-4 flex items-center justify-between transition-colors ${isCurrentUser ? 'bg-indigo-50' : 'hover:bg-slate-50'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${rankColor}`}>
                                        {rank}
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center font-bold text-slate-700">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800">{user.name}</p>
                                        <p className="text-sm text-slate-500">{user.level} Level</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 font-bold text-orange-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.934l-6.5 11.9a1 1 0 001.64 1.065l6.5-11.9a1 1 0 00-.385-1.45z" clipRule="evenodd" /><path fillRule="evenodd" d="M8.343 3.404a1 1 0 011.414 0l6.25 6.25a1 1 0 010 1.414l-6.25 6.25a1 1 0 01-1.414-1.414L13.586 11H3a1 1 0 110-2h10.586L8.343 4.818a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                    <span>{user.dailyProgress?.streak ?? 0} ngày</span>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>

        </div>
    );
};

export default LeaderboardView;

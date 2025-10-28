import React, { useState } from 'react';
import { FORUM_TOPICS } from '../forumData';

interface NewPostModalProps {
    onClose: () => void;
    onSubmit: () => void;
}

const NewPostModal: React.FC<NewPostModalProps> = ({ onClose, onSubmit }) => {
    const handleSubmit = () => {
        // In a real app, you'd handle form data here
        onSubmit();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b">
                    <h2 className="text-2xl font-bold text-slate-800">Tạo bài viết mới</h2>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label htmlFor="post-title" className="block text-sm font-medium text-slate-700 mb-1">Tiêu đề</label>
                        <input
                            type="text"
                            id="post-title"
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Nhập tiêu đề bài viết..."
                        />
                    </div>
                    <div>
                        <label htmlFor="post-content" className="block text-sm font-medium text-slate-700 mb-1">Nội dung</label>
                        <textarea
                            id="post-content"
                            rows={8}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Bạn đang nghĩ gì?"
                        ></textarea>
                    </div>
                </div>
                <div className="p-6 bg-slate-50 rounded-b-xl flex justify-end gap-4">
                    <button onClick={onClose} className="px-5 py-2 text-sm font-semibold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-lg">Hủy</button>
                    <button onClick={handleSubmit} className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg">Đăng bài</button>
                </div>
            </div>
        </div>
    );
};


interface CommunityForumViewProps {
    onGoalUpdate: () => void;
}

const CommunityForumView: React.FC<CommunityForumViewProps> = ({ onGoalUpdate }) => {
    const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);

    const handleNewPostSubmit = () => {
        onGoalUpdate();
        // In a real app, you'd refresh the topic list or show a success message
        alert("Bài viết của bạn đã được đăng! (Đây là chức năng giả lập)");
    };

    return (
        <>
            <div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
                <div className="flex justify-between items-center mb-10">
                    <div className="text-left">
                        <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Diễn Đàn Cộng Đồng</h1>
                        <p className="mt-2 max-w-2xl text-xl text-slate-500">
                            Kết nối, hỏi đáp, và chia sẻ kinh nghiệm học tiếng Anh.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsNewPostModalOpen(true)}
                        className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 transition-all transform hover:scale-105"
                    >
                        Tạo bài viết mới
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                    <div className="divide-y divide-slate-200">
                        {FORUM_TOPICS.map((topic) => (
                            <div key={topic.id} className="p-6 hover:bg-slate-50 transition-colors cursor-pointer">
                                <div className="flex justify-between items-center">
                                    <div className="flex-1 pr-8">
                                        <h3 className="text-lg font-bold text-indigo-700">{topic.title}</h3>
                                        <p className="text-sm text-slate-500 mt-1">{topic.description}</p>
                                    </div>
                                    <div className="flex-shrink-0 w-48 flex justify-between items-center">
                                        <div className="text-center">
                                            <p className="font-bold text-slate-700">{topic.postCount}</p>
                                            <p className="text-xs text-slate-500">bài viết</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-slate-700">{topic.lastPost.author}</p>
                                            <p className="text-xs text-slate-500">{topic.lastPost.timestamp}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {isNewPostModalOpen && <NewPostModal onClose={() => setIsNewPostModalOpen(false)} onSubmit={handleNewPostSubmit} />}
        </>
    );
};

export default CommunityForumView;
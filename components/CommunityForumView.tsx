import React, { useState } from 'react';
import type { ForumTopic, ViewMode, ForumPost, User } from '../types';

interface NewPostModalProps {
    topics: ForumTopic[];
    currentUser: User;
    onClose: () => void;
    onAddNewPost: (post: ForumPost) => void;
    onGoalUpdate: () => void;
}

const NewPostModal: React.FC<NewPostModalProps> = ({ topics, currentUser, onClose, onAddNewPost, onGoalUpdate }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [topicId, setTopicId] = useState(topics[0]?.id || '');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (!title.trim() || !content.trim() || !topicId) {
            setError('Vui lòng nhập đầy đủ tiêu đề, nội dung và chọn chủ đề.');
            return;
        }

        const newPost: ForumPost = {
            id: `p${Date.now()}`,
            topicId,
            author: currentUser.name,
            timestamp: 'Vừa xong',
            title: title.trim(),
            content: content.trim(),
            replies: []
        };
        
        onAddNewPost(newPost);
        onGoalUpdate();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b">
                    <h2 className="text-2xl font-bold text-slate-800">Tạo bài viết mới</h2>
                </div>
                <div className="p-6 space-y-4">
                     {error && <p className="text-red-500 bg-red-50 p-3 rounded-md text-sm">{error}</p>}
                    <div>
                        <label htmlFor="post-topic" className="block text-sm font-medium text-slate-700 mb-1">Chủ đề</label>
                        <select
                            id="post-topic"
                            value={topicId}
                            onChange={(e) => setTopicId(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            {topics.map(topic => (
                                <option key={topic.id} value={topic.id}>{topic.title}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="post-title" className="block text-sm font-medium text-slate-700 mb-1">Tiêu đề</label>
                        <input
                            type="text"
                            id="post-title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Nhập tiêu đề bài viết..."
                        />
                    </div>
                    <div>
                        <label htmlFor="post-content" className="block text-sm font-medium text-slate-700 mb-1">Nội dung</label>
                        <textarea
                            id="post-content"
                            rows={8}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
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
    topics: ForumTopic[];
    navigateTo: (mode: ViewMode, options?: { topicId?: string }) => void;
    onGoalUpdate: () => void;
    onAddNewPost: (post: ForumPost) => void;
    currentUser: User;
}

const CommunityForumView: React.FC<CommunityForumViewProps> = ({ topics, navigateTo, onGoalUpdate, onAddNewPost, currentUser }) => {
    const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);

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
                        {topics.map((topic) => (
                            <div key={topic.id} onClick={() => navigateTo('forum-topic', { topicId: topic.id })} className="p-6 hover:bg-slate-50 transition-colors cursor-pointer">
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
            {isNewPostModalOpen && <NewPostModal 
                                      topics={topics}
                                      currentUser={currentUser}
                                      onClose={() => setIsNewPostModalOpen(false)} 
                                      onAddNewPost={onAddNewPost}
                                      onGoalUpdate={onGoalUpdate}
                                   />}
        </>
    );
};

export default CommunityForumView;
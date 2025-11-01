import React from 'react';
import type { ForumTopic, ForumPost, User, ViewMode, ForumReply } from '../types';
import ForumPostItem from './ForumPostItem';

interface ForumTopicViewProps {
    topicId: string;
    topics: ForumTopic[];
    posts: ForumPost[];
    currentUser: User;
    navigateTo: (mode: ViewMode) => void;
    onAddNewReply: (topicId: string, postId: string, newReply: ForumReply) => void;
}

const ForumTopicView: React.FC<ForumTopicViewProps> = ({ topicId, topics, posts, currentUser, navigateTo, onAddNewReply }) => {
    const topic = topics.find(t => t.id === topicId);

    if (!topic) {
        return (
            <div className="p-8 text-center">
                <p>Không tìm thấy chủ đề này.</p>
                <button onClick={() => navigateTo('community-forum')} className="mt-4 text-indigo-600 font-semibold hover:underline">
                    Quay lại diễn đàn
                </button>
            </div>
        );
    }

    return (
        <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
            <div className="mb-8">
                <button onClick={() => navigateTo('community-forum')} className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    Quay lại danh sách chủ đề
                </button>
                <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight mt-4">{topic.title}</h1>
                <p className="mt-2 text-xl text-slate-500">{topic.description}</p>
            </div>

            <div className="space-y-6">
                {posts.length > 0 ? (
                    posts.map(post => (
                        <ForumPostItem 
                            key={post.id} 
                            post={post} 
                            currentUser={currentUser}
                            onAddNewReply={onAddNewReply}
                        />
                    ))
                ) : (
                    <div className="text-center bg-white p-10 rounded-xl shadow-md border">
                        <h3 className="text-xl font-semibold text-slate-700">Chưa có bài viết nào</h3>
                        <p className="text-slate-500 mt-2">Hãy là người đầu tiên bắt đầu cuộc thảo luận trong chủ đề này!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForumTopicView;
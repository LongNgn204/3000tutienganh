import React, { useState } from 'react';
import type { ForumPost, User, ForumReply } from '../types';

interface ForumPostItemProps {
    post: ForumPost;
    currentUser: User;
    onAddNewReply: (topicId: string, postId: string, newReply: ForumReply) => void;
}

const ForumPostItem: React.FC<ForumPostItemProps> = ({ post, currentUser, onAddNewReply }) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    
    const handleReplySubmit = () => {
        if (!replyContent.trim()) return;
        const newReply: ForumReply = {
            id: `r${Date.now()}`,
            author: currentUser.name,
            timestamp: 'Vừa xong',
            content: replyContent.trim(),
        };
        onAddNewReply(post.topicId, post.id, newReply);
        setReplyContent('');
        setShowReplyForm(false);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-slate-200">
            {/* Main Post */}
            <div className="p-6">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center font-bold text-slate-700 flex-shrink-0">
                        {post.author.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-center">
                            <p className="font-bold text-slate-800">{post.author}</p>
                            <p className="text-xs text-slate-400">{post.timestamp}</p>
                        </div>
                        <h3 className="text-xl font-bold text-indigo-700 mt-2">{post.title}</h3>
                        <p className="mt-2 text-slate-700 whitespace-pre-wrap">{post.content}</p>
                    </div>
                </div>
            </div>

            {/* Replies */}
            {post.replies.length > 0 && (
                 <div className="px-6 pb-4">
                    <div className="ml-14 pl-4 border-l-2 border-slate-200 space-y-4">
                        {post.replies.map(reply => (
                            <div key={reply.id} className="flex items-start gap-3">
                                 <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-sm flex-shrink-0">
                                    {reply.author.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 bg-slate-100 p-3 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold text-sm text-slate-700">{reply.author}</p>
                                        <p className="text-xs text-slate-400">{reply.timestamp}</p>
                                    </div>
                                    <p className="mt-1 text-sm text-slate-600 whitespace-pre-wrap">{reply.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Reply Form */}
            <div className="p-6 border-t border-slate-200">
                {showReplyForm ? (
                    <div className="ml-14">
                        <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="Viết câu trả lời của bạn..."
                            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            rows={3}
                            autoFocus
                        />
                        <div className="mt-2 flex justify-end gap-2">
                            <button onClick={() => setShowReplyForm(false)} className="px-4 py-1.5 text-sm font-semibold text-slate-600 rounded-md hover:bg-slate-100">Hủy</button>
                            <button onClick={handleReplySubmit} className="px-4 py-1.5 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Gửi</button>
                        </div>
                    </div>
                ) : (
                    <div className="ml-14">
                        <button onClick={() => setShowReplyForm(true)} className="text-sm font-semibold text-indigo-600 hover:underline">
                            Trả lời bài viết này
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForumPostItem;
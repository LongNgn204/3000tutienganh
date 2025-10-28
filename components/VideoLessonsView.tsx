import React, { useState } from 'react';
import { VIDEO_LESSONS, VideoLesson } from '../videoData';

const VideoModal: React.FC<{ video: VideoLesson; onClose: () => void }> = ({ video, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-slate-900 rounded-xl shadow-2xl w-full max-w-4xl" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-slate-700">
                    <h3 className="text-lg font-bold text-white">{video.title}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white text-3xl leading-none">&times;</button>
                </div>
                <div className="aspect-video">
                    <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
                        title={video.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>
        </div>
    );
};


interface VideoLessonsViewProps {
  onGoalUpdate: () => void;
}

const VideoLessonsView: React.FC<VideoLessonsViewProps> = ({ onGoalUpdate }) => {
    const [selectedVideo, setSelectedVideo] = useState<VideoLesson | null>(null);

    const handleCloseModal = () => {
        if(selectedVideo) {
            onGoalUpdate(); // Update goal when user finishes watching
        }
        setSelectedVideo(null);
    };

    return (
        <>
            <div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Bài Giảng Video</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-500">
                        Học các chủ đề ngữ pháp, từ vựng và kỹ năng qua các bài giảng video sinh động.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {VIDEO_LESSONS.map((lesson) => (
                        <div key={lesson.id} className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col group cursor-pointer" onClick={() => setSelectedVideo(lesson)}>
                            <div className="aspect-video bg-slate-200 overflow-hidden relative">
                                <img src={lesson.thumbnail} alt={lesson.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/></svg>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 flex-grow flex flex-col">
                                <span className="text-xs font-semibold bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full self-start">{lesson.level}</span>
                                <h3 className="mt-2 font-bold text-slate-800 flex-grow">{lesson.title}</h3>
                                <p className="text-sm text-slate-500 mt-1">{lesson.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {selectedVideo && <VideoModal video={selectedVideo} onClose={handleCloseModal} />}
        </>
    );
};

export default VideoLessonsView;
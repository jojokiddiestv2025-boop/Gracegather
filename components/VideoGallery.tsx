import React, { useState, useEffect } from 'react';
import { PlayCircle, Plus, Trash2, Film, X, User as UserIcon, AlertCircle, ExternalLink, Loader2, Cloud, CloudOff } from 'lucide-react';
import { AuthService } from '../services/authService';
import { VideoService } from '../services/videoService';
import { StorageService } from '../services/storageService';
import { VideoItem, User, UserRole } from '../types';

const VideoGallery: React.FC = () => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isCloudEnabled, setIsCloudEnabled] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    loadVideos();
    setCurrentUser(AuthService.getCurrentUser());
    const settings = StorageService.getCloudSettings();
    setIsCloudEnabled(!!(settings?.enabled && settings?.binId));
  }, []);

  const loadVideos = async () => {
    setLoading(true);
    const data = await VideoService.getVideos();
    setVideos(data);
    setLoading(false);
  };

  const getEmbedUrl = (inputUrl: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = inputUrl.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    return inputUrl;
  };

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url) return;
    setPosting(true);

    await VideoService.addVideo({
      title,
      description,
      url: getEmbedUrl(url),
      postedBy: currentUser?.name || 'Pastor'
    });

    setTitle(''); setDescription(''); setUrl('');
    setShowForm(false);
    await loadVideos();
    setPosting(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this video?')) {
      await VideoService.deleteVideo(id);
      loadVideos();
    }
  };

  const canPost = currentUser?.role === UserRole.ADMIN || currentUser?.role === UserRole.PASTOR;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-church-900 text-white py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center z-10">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start mb-2">
              <PlayCircle className="w-8 h-8 text-gold-500 mr-3" />
              <span className="text-gold-500 font-bold tracking-widest uppercase text-sm">Media Library</span>
            </div>
            <h1 className="text-4xl font-display font-bold text-white mb-2">Sermons & Teachings</h1>
            <p className="text-church-200 max-w-xl flex items-center justify-center md:justify-start">
              A collection of spiritual messages.
              {isCloudEnabled ? (
                 <span className="ml-3 flex items-center text-xs bg-green-500/20 px-2 py-0.5 rounded text-green-300 border border-green-500/30">
                    <Cloud className="w-3 h-3 mr-1" /> Live Sync
                 </span>
              ) : (
                 <span className="ml-3 flex items-center text-xs bg-gray-700 px-2 py-0.5 rounded text-gray-400">
                    <CloudOff className="w-3 h-3 mr-1" /> Local
                 </span>
              )}
            </p>
          </div>

          {canPost && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-gold-500 hover:bg-gold-600 text-white px-6 py-3 rounded-full font-bold shadow-lg flex items-center transition-colors transform hover:scale-105"
            >
              <Plus className="w-5 h-5 mr-2" /> Post Video
            </button>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="bg-church-50 p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-xl text-church-900">Post New Video</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handlePost} className="p-6 space-y-4">
              <div className="bg-yellow-50 border-l-4 border-gold-500 p-4 rounded-r-lg mb-4">
                 <div className="flex">
                    <AlertCircle className="w-5 h-5 text-gold-600 mr-2 flex-shrink-0" />
                    <p className="text-sm text-gold-800">
                       <strong>Pastoral Note:</strong> Only religious content (Sermons, Worship) is permitted in this gallery.
                    </p>
                 </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Video Title</label>
                <input
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-church-500 outline-none"
                  placeholder="e.g. Sunday Sermon: The Power of Faith"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">YouTube URL</label>
                <div className="relative">
                    <ExternalLink className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                    required
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-church-500 outline-none"
                    placeholder="https://www.youtube.com/watch?v=..."
                    />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-church-500 outline-none"
                  rows={3}
                  placeholder="Brief summary..."
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={posting}
                  className="w-full py-3 bg-church-800 hover:bg-church-900 text-white font-bold rounded-lg transition-colors flex justify-center items-center"
                >
                  {posting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Publish to Gallery'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gallery Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
           <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 text-church-500 animate-spin" />
           </div>
        ) : videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200 text-center">
            <div className="bg-gray-50 p-6 rounded-full mb-6">
               <Film className="w-16 h-16 text-gray-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-400 mb-2">The Gallery is Empty</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Our pastoral team hasn't posted any videos yet. Please check back soon.
            </p>
            {canPost && (
                <button 
                  onClick={() => setShowForm(true)}
                  className="mt-6 text-church-600 font-bold hover:underline"
                >
                    Post the first video
                </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map(video => (
              <div key={video.id} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all group">
                <div className="aspect-video bg-black relative">
                  <iframe
                    src={video.url}
                    title={video.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                     <h3 className="font-bold text-lg text-church-900 line-clamp-2 leading-tight">{video.title}</h3>
                     {canPost && (
                        <button
                            onClick={() => handleDelete(video.id)}
                            className="text-gray-300 hover:text-red-500 transition-colors ml-2"
                            title="Delete Video"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                     )}
                  </div>
                  
                  <div className="flex items-center text-xs text-gray-400 mb-4">
                    <UserIcon className="w-3 h-3 mr-1" />
                    <span className="mr-3">{video.postedBy}</span>
                    <span>{new Date(video.date).toLocaleDateString()}</span>
                  </div>

                  {video.description && (
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {video.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoGallery;
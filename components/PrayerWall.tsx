import React, { useState, useEffect } from 'react';
import { Heart, Send, Users, Clock, Loader2, Sparkles } from 'lucide-react';
import { PrayerService } from '../services/prayerService';
import { PrayerRequest } from '../types';

const PrayerWall: React.FC = () => {
  const [requests, setRequests] = useState<PrayerRequest[]>([]);
  const [newPrayer, setNewPrayer] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [prayedForIds, setPrayedForIds] = useState<Set<string>>(new Set());

  // Polling for live updates
  useEffect(() => {
    const fetchPrayers = () => {
        const data = PrayerService.getRequests();
        setRequests(data);
    };

    fetchPrayers();
    const interval = setInterval(fetchPrayers, 3000); // Live refresh every 3s
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrayer.trim()) return;

    setSubmitting(true);
    // Simulate network delay for feel
    setTimeout(() => {
        PrayerService.addRequest(authorName || 'Guest', newPrayer, isAnonymous);
        setNewPrayer('');
        setAuthorName('');
        setSubmitting(false);
        // Immediate refresh
        setRequests(PrayerService.getRequests());
    }, 600);
  };

  const handlePray = (id: string) => {
    if (prayedForIds.has(id)) return;
    
    PrayerService.incrementPrayerCount(id);
    setPrayedForIds(prev => new Set(prev).add(id));
    
    // Optimistic update
    setRequests(prev => prev.map(p => 
        p.id === id ? { ...p, prayerCount: p.prayerCount + 1 } : p
    ));
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
       {/* Header */}
       <div className="bg-church-800 text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
             <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                 <Heart className="w-8 h-8 text-pink-400" />
             </div>
             <h1 className="text-4xl font-display font-bold mb-4">Community Prayer Wall</h1>
             <p className="text-xl text-church-200 max-w-2xl mx-auto">
                "Carry each other’s burdens, and in this way you will fulfill the law of Christ." — Galatians 6:2
             </p>
             <div className="mt-8 flex items-center justify-center gap-2 text-sm text-green-400 font-bold bg-white/5 inline-flex px-4 py-2 rounded-full">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                LIVE UPDATES ACTIVE
             </div>
          </div>
       </div>

       <div className="max-w-6xl mx-auto px-4 -mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             
             {/* Submit Form */}
             <div className="md:col-span-1">
                <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24 border-t-4 border-pink-500">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <Send className="w-5 h-5 mr-2 text-pink-500" /> Share Request
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Your Prayer</label>
                            <textarea 
                                required
                                rows={4}
                                value={newPrayer}
                                onChange={e => setNewPrayer(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none resize-none"
                                placeholder="How can we pray for you today?"
                            />
                        </div>
                        
                        <div className="flex items-center gap-2 mb-2">
                             <input 
                                type="checkbox" 
                                id="anon"
                                checked={isAnonymous}
                                onChange={e => setIsAnonymous(e.target.checked)}
                                className="rounded text-pink-500 focus:ring-pink-500"
                             />
                             <label htmlFor="anon" className="text-sm text-gray-600 select-none cursor-pointer">Post Anonymously</label>
                        </div>

                        {!isAnonymous && (
                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Your Name</label>
                                <input 
                                    type="text"
                                    required={!isAnonymous}
                                    value={authorName}
                                    onChange={e => setAuthorName(e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                                    placeholder="Brother/Sister Name"
                                />
                             </div>
                        )}

                        <button 
                            type="submit" 
                            disabled={submitting}
                            className="w-full py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-lg shadow-md transition-all flex items-center justify-center disabled:opacity-70"
                        >
                            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Post to Prayer Wall'}
                        </button>
                    </form>
                </div>
             </div>

             {/* Feed */}
             <div className="md:col-span-2 space-y-4">
                 <h3 className="text-gray-500 font-bold uppercase tracking-wider text-sm mb-2 flex justify-between items-center">
                    <span>Latest Prayers</span>
                    <span>{requests.length} Active Requests</span>
                 </h3>
                 
                 {requests.length === 0 ? (
                    <div className="bg-white p-12 rounded-2xl text-center text-gray-400 border border-dashed border-gray-300">
                        <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-30" />
                        <p>Be the first to share a prayer request.</p>
                    </div>
                 ) : (
                     requests.map(request => (
                         <div key={request.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow animate-fade-in">
                             <div className="flex justify-between items-start mb-4">
                                 <div className="flex items-center">
                                     <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${request.isAnonymous ? 'bg-gray-100 text-gray-500' : 'bg-pink-50 text-pink-600'}`}>
                                         <Users className="w-5 h-5" />
                                     </div>
                                     <div>
                                         <h4 className="font-bold text-gray-800">{request.author}</h4>
                                         <span className="text-xs text-gray-400 flex items-center">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {new Date(request.timestamp).toLocaleString()}
                                         </span>
                                     </div>
                                 </div>
                             </div>
                             
                             <p className="text-gray-700 text-lg leading-relaxed mb-6 font-serif">
                                 "{request.content}"
                             </p>
                             
                             <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                                 <button 
                                     onClick={() => handlePray(request.id)}
                                     disabled={prayedForIds.has(request.id)}
                                     className={`flex items-center px-4 py-2 rounded-full text-sm font-bold transition-all ${
                                         prayedForIds.has(request.id) 
                                         ? 'bg-green-100 text-green-700 cursor-default' 
                                         : 'bg-gray-100 text-gray-600 hover:bg-pink-50 hover:text-pink-600'
                                     }`}
                                 >
                                     <Heart className={`w-4 h-4 mr-2 ${prayedForIds.has(request.id) ? 'fill-current' : ''}`} />
                                     {prayedForIds.has(request.id) ? 'Prayed' : 'I Prayed'}
                                 </button>
                                 
                                 <span className="text-sm text-gray-400">
                                     {request.prayerCount} {request.prayerCount === 1 ? 'person' : 'people'} prayed
                                 </span>
                             </div>
                         </div>
                     ))
                 )}
             </div>
          </div>
       </div>
    </div>
  );
};

export default PrayerWall;
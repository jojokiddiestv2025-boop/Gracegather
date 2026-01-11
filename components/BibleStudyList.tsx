import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, Clock, User as UserIcon, Plus, Video, Trash2, StopCircle } from 'lucide-react';
import { ScheduleService } from '../services/scheduleService';
import { AuthService } from '../services/authService';
import { StreamEvent, UserRole, User } from '../types';

const BibleStudyList: React.FC = () => {
  const [events, setEvents] = useState<StreamEvent[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    loadEvents();
    setCurrentUser(AuthService.getCurrentUser());
    
    // Refresh every 5s for live status updates
    const interval = setInterval(loadEvents, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadEvents = () => {
    const allEvents = ScheduleService.getEvents();
    // Filter for Bible Study type events
    const studyEvents = allEvents.filter(e => e.type === 'BIBLE_STUDY');
    setEvents(studyEvents);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const dateTime = `${date}T${time}`;
    ScheduleService.addEvent(
      title, 
      dateTime, 
      description, 
      'BIBLE_STUDY', 
      currentUser?.name || 'Pastor'
    );
    setShowForm(false);
    loadEvents();
    resetForm();
  };

  const resetForm = () => {
    setTitle(''); setDescription(''); setDate(''); setTime('');
  };

  const handleDelete = (id: string) => {
    if(confirm('Delete this Bible Study?')) {
      ScheduleService.deleteEvent(id);
      loadEvents();
    }
  };

  const handleJoin = (id: string) => {
    window.location.hash = `/conference?id=${id}`;
  };

  const handleStart = (id: string) => {
    ScheduleService.setLiveStatus(id, true);
    loadEvents(); // Refresh immediately
    window.location.hash = `/conference?id=${id}`;
  };

  const handleStop = (id: string) => {
    if(confirm('End this study session?')) {
        ScheduleService.setLiveStatus(id, false);
        loadEvents();
    }
  };

  const canManage = currentUser?.role === UserRole.ADMIN || currentUser?.role === UserRole.PASTOR;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Hero Header */}
      <div className="bg-church-800 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
             <div className="flex items-center mb-4">
                <div className="bg-white/10 p-3 rounded-full mr-4">
                   <BookOpen className="w-8 h-8 text-gold-400" />
                </div>
                <h1 className="text-4xl font-display font-bold">Bible Study Groups</h1>
             </div>
             <p className="text-church-200 text-lg max-w-xl">
               Join a small group to dive deeper into the Word, ask questions, and grow together in fellowship.
             </p>
          </div>
          
          {canManage && (
            <button 
              onClick={() => setShowForm(!showForm)}
              className="bg-gold-500 hover:bg-gold-600 text-white px-6 py-3 rounded-full font-bold shadow-lg flex items-center transition-colors"
            >
              {showForm ? 'Cancel Creation' : 'Create New Group'} 
              {!showForm && <Plus className="w-5 h-5 ml-2" />}
            </button>
          )}
        </div>
      </div>

      {/* Creation Form */}
      {showForm && (
        <div className="max-w-2xl mx-auto -mt-8 mb-12 px-4 relative z-10">
          <div className="bg-white rounded-xl shadow-xl p-8 border-t-4 border-gold-500 animate-fade-in">
             <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Schedule a Bible Study</h3>
             <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Topic</label>
                  <input 
                    required 
                    value={title} 
                    onChange={e => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold-500 outline-none" 
                    placeholder="e.g. Study of Romans"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date</label>
                    <input 
                      type="date" 
                      required 
                      value={date} 
                      onChange={e => setDate(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold-500 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Time</label>
                    <input 
                      type="time" 
                      required 
                      value={time} 
                      onChange={e => setTime(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold-500 outline-none" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                  <textarea 
                    value={description} 
                    onChange={e => setDescription(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold-500 outline-none" 
                    rows={3} 
                    placeholder="What will we be discussing?"
                  />
                </div>
                <button type="submit" className="w-full py-3 bg-church-800 text-white font-bold rounded-lg hover:bg-church-900 transition-colors">
                  Schedule Meeting
                </button>
             </form>
          </div>
        </div>
      )}

      {/* List */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {events.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
             <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
             <h3 className="text-xl font-bold text-gray-500">No active Bible Studies</h3>
             <p className="text-gray-400 mt-2">Check back later or contact a pastor.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => (
              <div key={event.id} className={`bg-white rounded-xl overflow-hidden border transition-all hover:shadow-lg ${event.isLive ? 'border-red-400 shadow-md' : 'border-gray-200'}`}>
                {event.isLive && (
                  <div className="bg-red-600 text-white text-xs font-bold text-center py-1 uppercase tracking-wider animate-pulse">
                     Live Now
                  </div>
                )}
                <div className="p-6">
                   <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
                   <div className="space-y-2 mb-6">
                     <div className="flex items-center text-sm text-gray-600">
                        <UserIcon className="w-4 h-4 mr-2 text-church-500" />
                        Host: <span className="font-bold ml-1">{event.host || 'Pastor'}</span>
                     </div>
                     <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 text-church-500" />
                        {new Date(event.dateTime).toLocaleDateString()}
                     </div>
                     <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2 text-church-500" />
                        {new Date(event.dateTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                     </div>
                   </div>
                   
                   <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                     {event.description}
                   </p>

                   <div className="flex gap-2">
                     {event.isLive ? (
                        <button 
                          onClick={() => handleJoin(event.id)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-bold flex items-center justify-center transition-colors"
                        >
                          <Video className="w-4 h-4 mr-2" /> Join Room
                        </button>
                     ) : (
                        canManage ? (
                           <button 
                              onClick={() => handleStart(event.id)}
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-bold flex items-center justify-center transition-colors"
                           >
                              Start Now
                           </button>
                        ) : (
                           <button disabled className="flex-1 bg-gray-100 text-gray-400 py-2 rounded-lg font-bold cursor-not-allowed">
                              Scheduled
                           </button>
                        )
                     )}
                     
                     {canManage && event.isLive && (
                        <button 
                           onClick={() => handleStop(event.id)}
                           className="bg-gray-800 hover:bg-gray-900 text-white px-3 rounded-lg"
                           title="Stop Meeting"
                        >
                           <StopCircle className="w-4 h-4" />
                        </button>
                     )}

                     {canManage && (
                        <button 
                          onClick={() => handleDelete(event.id)}
                          className="px-3 py-2 border border-gray-200 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                     )}
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BibleStudyList;
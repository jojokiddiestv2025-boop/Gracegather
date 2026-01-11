import React, { useEffect, useRef, useState } from 'react';
import { 
  Video, VideoOff, Users, MessageSquare, Heart, Share2, Info, Send
} from 'lucide-react';
import { ScheduleService } from '../services/scheduleService';
import { AuthService } from '../services/authService';
import { UserRole, StreamEvent } from '../types';

const LiveConference: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{user: string, message: string, color: string}>>([]);
  
  // Event Data
  const [currentEvent, setCurrentEvent] = useState<StreamEvent | null>(null);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    setIsAdmin(user?.role === UserRole.ADMIN || user?.role === UserRole.PASTOR);
    
    // Parse URL params
    // Format: #/conference?id=123
    const hash = window.location.hash;
    const queryString = hash.split('?')[1];
    const params = new URLSearchParams(queryString);
    const eventId = params.get('id');

    if (eventId) {
       // Look up specific event
       const event = ScheduleService.getEventById(eventId);
       if (event) {
          setCurrentEvent(event);
          setIsBroadcasting(event.isLive);
       }
    } else {
       // Default to global broadcast (legacy support or main stream)
       setCurrentEvent({
          id: 'main',
          title: 'Main Sanctuary Stream',
          dateTime: new Date().toISOString(),
          description: 'Official Church Broadcast',
          isLive: false,
          type: 'BROADCAST',
          host: 'Church'
       });
       
       // Check if ANY live broadcast exists if we are in default mode
       const activeEvent = ScheduleService.getLiveEvent();
       if (activeEvent && activeEvent.type === 'BROADCAST') {
          setIsBroadcasting(true);
       }
    }

    // Polling for status updates if we are just a viewer
    const interval = setInterval(() => {
        if (eventId) {
            const updated = ScheduleService.getEventById(eventId);
            if (updated) setIsBroadcasting(updated.isLive);
        } else {
             const activeEvent = ScheduleService.getLiveEvent();
             if (activeEvent && activeEvent.type === 'BROADCAST') {
                 setIsBroadcasting(true);
             } else {
                 if (!stream) setIsBroadcasting(false); // Only set false if I am not the one streaming
             }
        }
    }, 5000);

    return () => clearInterval(interval);

  }, [stream]); // Dependency on stream to avoid toggling off my own broadcast via polling

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Simulate viewer joining when broadcast starts
  useEffect(() => {
    if (isBroadcasting) {
        setViewerCount(Math.floor(Math.random() * 5) + 1);
    } else {
        setViewerCount(0);
    }
  }, [isBroadcasting]);

  const toggleBroadcast = async () => {
    if (isBroadcasting && stream) {
      // Stop Broadcasting
      stream.getTracks().forEach(t => t.stop());
      setStream(null);
      setIsBroadcasting(false);
      
      // Update persistent state
      if (currentEvent && currentEvent.id !== 'main') {
          ScheduleService.setLiveStatus(currentEvent.id, false);
      } else {
          ScheduleService.setLiveStatus('manual-override', false);
      }

    } else {
      // Start Broadcasting
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(s);
        setIsBroadcasting(true);
        
        // Update persistent state
        if (currentEvent && currentEvent.id !== 'main') {
            ScheduleService.setLiveStatus(currentEvent.id, true);
        } else {
            ScheduleService.setLiveStatus('manual-override', true);
        }
      } catch (e) {
        alert("Camera access required for broadcast.");
      }
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    
    const user = AuthService.getCurrentUser();
    setChatHistory([...chatHistory, {
        user: user?.name || 'Guest',
        message: chatMessage,
        color: 'bg-church-500'
    }]);
    setChatMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
       {/* Top Bar */}
       <div className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
             <div className="bg-red-600 p-2 rounded-lg mr-3">
                <Video className="w-5 h-5 text-white" />
             </div>
             <div>
                <h1 className="font-bold text-lg">{currentEvent?.title}</h1>
                <p className="text-xs text-slate-400">
                    {currentEvent?.type === 'BIBLE_STUDY' ? 'Interactive Group Session' : 'Live Broadcast'}
                </p>
             </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center bg-black/30 px-3 py-1.5 rounded-full">
                <Users className="w-4 h-4 text-slate-400 mr-2" />
                <span className="text-sm font-bold text-slate-200">{isBroadcasting ? viewerCount : 0}</span>
             </div>
             {isBroadcasting && (
                 <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                 </span>
             )}
          </div>
       </div>

       {/* Main Content */}
       <div className="flex-grow max-w-7xl mx-auto w-full p-4 lg:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
             
             {/* Video Player Section */}
             <div className="lg:col-span-2 flex flex-col">
                <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-slate-700">
                    {stream ? (
                       <video 
                         ref={videoRef} 
                         autoPlay 
                         muted={true} // Mute local preview to avoid feedback
                         className="w-full h-full object-cover"
                       />
                    ) : (
                       <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950">
                          {isBroadcasting && !stream ? (
                             // Viewer View (Mock)
                             <div className="text-center">
                                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
                                   <Video className="w-8 h-8 text-slate-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Live Stream Active</h3>
                                <p className="text-slate-500 max-w-md px-4">
                                   The host is live. In a full production environment, the video player would load the stream URL here.
                                </p>
                             </div>
                          ) : (
                             // Offline View
                             <div className="text-center">
                                <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-4 mx-auto border border-slate-800">
                                   <VideoOff className="w-8 h-8 text-slate-600" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-400">Stream Offline</h3>
                                <p className="text-slate-600 mt-2">Waiting for the host to begin...</p>
                             </div>
                          )}
                       </div>
                    )}
                </div>

                {/* Stream Actions */}
                <div className="mt-4 bg-slate-800 p-4 rounded-xl flex flex-wrap justify-between items-center gap-4">
                    <div>
                       <h2 className="text-xl font-bold text-white">{currentEvent?.title}</h2>
                       <p className="text-slate-400 text-sm">Host: {currentEvent?.host || 'Church Team'}</p>
                    </div>

                    <div className="flex gap-3">
                       <button className="flex items-center px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-sm font-medium">
                          <Heart className="w-4 h-4 text-pink-500 mr-2" /> Like
                       </button>
                       <button className="flex items-center px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-sm font-medium">
                          <Share2 className="w-4 h-4 text-blue-400 mr-2" /> Share
                       </button>
                    </div>
                </div>

                {/* Admin Controls Panel */}
                {isAdmin && (
                    <div className="mt-6 bg-slate-800 border border-slate-600 rounded-xl p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-white flex items-center">
                                <Info className="w-4 h-4 mr-2 text-gold-400" /> 
                                Host Controls
                            </h3>
                            <span className="text-xs bg-gold-500/20 text-gold-400 px-2 py-1 rounded border border-gold-500/30">ADMIN ACCESS</span>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <button 
                               onClick={toggleBroadcast}
                               className={`flex-1 py-3 rounded-lg font-bold flex items-center justify-center transition-all ${
                                 isBroadcasting 
                                 ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/20' 
                                 : 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-900/20'
                               }`}
                            >
                               {isBroadcasting && stream ? (
                                 <><VideoOff className="w-5 h-5 mr-2" /> Stop Camera Broadcast</>
                               ) : (
                                 <><Video className="w-5 h-5 mr-2" /> Start Camera Broadcast</>
                               )}
                            </button>
                            
                            <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-lg border border-slate-700">
                               <div className={`w-3 h-3 rounded-full ${isBroadcasting ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                               <span className="text-sm font-mono text-slate-300">
                                   {isBroadcasting ? 'ON AIR' : 'OFF AIR'}
                               </span>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-3">
                           Note: Starting broadcast will activate your camera and microphone.
                        </p>
                    </div>
                )}
             </div>

             {/* Live Chat */}
             <div className="lg:col-span-1">
                <div className="bg-slate-800 rounded-xl border border-slate-700 h-[600px] flex flex-col">
                   <div className="p-4 border-b border-slate-700 bg-slate-800/50 rounded-t-xl">
                      <h3 className="font-bold text-sm flex items-center text-slate-200">
                         <MessageSquare className="w-4 h-4 mr-2 text-slate-400" /> 
                         Live Chat
                      </h3>
                   </div>
                   
                   <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
                      {chatHistory.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-slate-500 text-sm italic">
                           No messages yet. Say hello!
                        </div>
                      ) : (
                        chatHistory.map((msg, idx) => (
                          <div key={idx} className="flex items-start animate-fade-in">
                             <div className={`w-8 h-8 rounded-full ${msg.color} flex-shrink-0 flex items-center justify-center text-xs font-bold text-white mr-3`}>
                                {msg.user.charAt(0)}
                             </div>
                             <div>
                                <span className="text-xs font-bold text-slate-400 block mb-0.5">{msg.user}</span>
                                <p className="text-sm text-slate-200 bg-slate-700/50 px-3 py-2 rounded-tr-lg rounded-br-lg rounded-bl-lg inline-block">
                                    {msg.message}
                                </p>
                             </div>
                          </div>
                        ))
                      )}
                   </div>

                   <div className="p-4 border-t border-slate-700 bg-slate-800/50 rounded-b-xl">
                      <form onSubmit={handleSendMessage} className="relative">
                          <input 
                            type="text" 
                            value={chatMessage}
                            onChange={(e) => setChatMessage(e.target.value)}
                            placeholder="Type a message..." 
                            className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-gold-500 transition-colors"
                          />
                          <button 
                            type="submit"
                            className="absolute right-2 top-2 p-1.5 bg-gold-500 hover:bg-gold-600 text-white rounded-md transition-colors"
                          >
                             <Send className="w-4 h-4" />
                          </button>
                      </form>
                   </div>
                </div>
             </div>

          </div>
       </div>
    </div>
  );
};

export default LiveConference;
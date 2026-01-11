import React, { useEffect, useState } from 'react';
import { AppRoute, StreamEvent } from '../types';
import { ArrowRight, Heart, Users, Sun, Code, Sparkles, Calendar, Radio } from 'lucide-react';
import { ScheduleService } from '../services/scheduleService';

interface WelcomeProps {
  onNavigate: (route: AppRoute) => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onNavigate }) => {
  const [upcomingEvents, setUpcomingEvents] = useState<StreamEvent[]>([]);

  useEffect(() => {
    // Load schedule
    const events = ScheduleService.getEvents();
    // Filter for future events or live events
    const now = new Date();
    const future = events.filter(e => new Date(e.dateTime) > now || e.isLive);
    setUpcomingEvents(future.slice(0, 3)); // Show next 3
  }, []);

  return (
    <div className="flex flex-col min-h-screen relative">
      
      {/* Hero Section */}
      <div className="relative bg-church-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://picsum.photos/1920/1080?grayscale&blur=2"
            alt="Church Background"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-church-900/50 to-church-900/90" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight mb-8">
              Grow in Faith, <br />
              <span className="text-gold-400">Walk in Love</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-300 font-sans font-light">
              Welcome to GraceGather. A sanctuary for daily scripture, personal reflection, and connecting with your spiritual community.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <button
                onClick={() => onNavigate(AppRoute.CHALLENGE)}
                className="px-8 py-3 bg-gold-500 text-white font-bold rounded-full hover:bg-gold-600 transition-colors shadow-lg flex items-center"
              >
                Start Daily Challenge <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              <button
                onClick={() => onNavigate(AppRoute.CONFERENCE)}
                className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-colors flex items-center"
              >
                Join Prayer Room
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule / Live Section */}
      {upcomingEvents.length > 0 && (
        <div className="bg-slate-50 border-b border-gray-200">
             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center mb-6">
                    <div className="p-2 bg-red-100 rounded-full mr-3">
                        <Radio className="w-5 h-5 text-red-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Upcoming Live Broadcasts</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {upcomingEvents.map(event => (
                        <div key={event.id} className={`p-6 rounded-xl border ${event.isLive ? 'bg-red-600 text-white border-red-700 shadow-lg transform scale-105' : 'bg-white text-gray-800 border-gray-200 shadow-sm'}`}>
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded ${event.isLive ? 'bg-white/20' : 'bg-gray-100 text-gray-500'}`}>
                                    {event.isLive ? 'LIVE NOW' : 'Scheduled'}
                                </span>
                                {event.isLive && <span className="w-3 h-3 bg-white rounded-full animate-ping"></span>}
                            </div>
                            <h3 className="text-lg font-bold mb-1">{event.title}</h3>
                            <div className={`text-sm mb-3 flex items-center ${event.isLive ? 'text-white/80' : 'text-gray-500'}`}>
                                <Calendar className="w-4 h-4 mr-2" />
                                {new Date(event.dateTime).toLocaleDateString()} at {new Date(event.dateTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                            </div>
                            <p className={`text-sm mb-4 ${event.isLive ? 'text-white/90' : 'text-gray-600'}`}>{event.description}</p>
                            {event.isLive ? (
                                <button 
                                    onClick={() => onNavigate(AppRoute.CONFERENCE)}
                                    className="w-full py-2 bg-white text-red-600 font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-md"
                                >
                                    Join Stream
                                </button>
                            ) : (
                                <div className="text-xs italic opacity-70">Mark your calendar</div>
                            )}
                        </div>
                    ))}
                </div>
             </div>
        </div>
      )}

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-church-800">Why GraceGather?</h2>
            <p className="mt-4 text-gray-600">Tools designed to deepen your walk with Christ.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <div className="text-center p-6 rounded-2xl bg-slate-50 hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 mx-auto bg-church-100 rounded-full flex items-center justify-center mb-6">
                <Sun className="w-8 h-8 text-church-600" />
              </div>
              <h3 className="text-xl font-bold text-church-900 mb-2">Daily Inspiration</h3>
              <p className="text-gray-600">
                Receive a new challenge every morning with scripture, reflection, and action steps.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6 rounded-2xl bg-slate-50 hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 mx-auto bg-church-100 rounded-full flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-church-600" />
              </div>
              <h3 className="text-xl font-bold text-church-900 mb-2">Community Fellowship</h3>
              <p className="text-gray-600">
                Gather virtually for Bible study, prayer meetings, and encouraging discussions.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6 rounded-2xl bg-slate-50 hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 mx-auto bg-church-100 rounded-full flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-church-600" />
              </div>
              <h3 className="text-xl font-bold text-church-900 mb-2">Guided Prayer</h3>
              <p className="text-gray-600">
                Use our spiritual guides to help facilitate prayer times and scripture understanding.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Founder Section */}
      <div className="py-20 bg-church-50 border-t border-church-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="w-full md:w-1/2 flex justify-center md:justify-end">
                    <div className="relative w-full max-w-sm">
                        <div className="absolute top-4 -right-4 w-full h-full bg-gold-200 rounded-2xl"></div>
                        
                        {/* Image Container Replacement (Abstract Graphic) */}
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white aspect-[3/4] bg-church-900 group">
                            {/* Abstract Background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-church-600 via-church-800 to-church-900"></div>
                            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)', backgroundSize: '30px 30px' }}></div>
                            
                            {/* Center Icon */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Code className="w-24 h-24 text-gold-500/80 drop-shadow-lg" />
                            </div>
                            
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-church-900/90 to-transparent pt-20 pb-6 px-6 text-white pointer-events-none">
                                <h3 className="text-xl font-bold font-display">The Visionary</h3>
                                <p className="text-sm opacity-90 text-gold-300">Age 13</p>
                            </div>
                        </div>

                        <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg flex items-center gap-3">
                           <div className="p-2 bg-church-100 rounded-full">
                              <Sparkles className="w-5 h-5 text-church-600" />
                           </div>
                           <div>
                              <p className="text-xs text-gray-500 font-bold uppercase">Mission</p>
                              <p className="text-sm font-bold text-church-800">Faith + Tech</p>
                           </div>
                        </div>
                    </div>
                </div>
                
                <div className="w-full md:w-1/2 text-center md:text-left">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-gold-100 text-gold-700 text-sm font-bold mb-6">
                        <Code className="w-4 h-4 mr-2" />
                        Built with Purpose
                    </div>
                    <h2 className="text-4xl font-display font-bold text-church-900 mb-6">
                        A Young Heart for <br/>God's Kingdom
                    </h2>
                    <p className="text-lg text-gray-700 leading-relaxed mb-6 font-serif">
                        GraceGather isn't just another app—it's a testament to what faith can do at any age. 
                        Founded by a <span className="font-bold text-church-600">13-year-old developer</span>, 
                        this platform was born out of a desire to use technology to connect the body of Christ 
                        in meaningful ways.
                    </p>
                    <p className="text-lg text-gray-700 leading-relaxed mb-8 font-serif">
                        "Don't let anyone look down on you because you are young, but set an example for the believers 
                        in speech, in conduct, in love, in faith and in purity." 
                    </p>
                    <p className="text-church-500 font-display font-bold italic">— 1 Timothy 4:12</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
import React, { useEffect, useState } from 'react';
import { DailyChallenge as IDailyChallenge } from '../types';
import { generateDailyChallenge } from '../services/geminiService';
import { Loader2, Book, PenTool, Hand, Heart } from 'lucide-react';

const DailyChallenge: React.FC = () => {
  const [challenge, setChallenge] = useState<IDailyChallenge | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking if today's challenge is already local, else fetch
    const loadChallenge = async () => {
      setLoading(true);
      try {
        const data = await generateDailyChallenge();
        setChallenge(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    
    loadChallenge();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-church-50">
        <Loader2 className="w-12 h-12 text-church-500 animate-spin mb-4" />
        <p className="text-church-600 font-display">Preparing your daily manna...</p>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Unable to load challenge. Please try again later.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-church-50 py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="max-w-3xl w-full space-y-8">
        
        <div className="text-center mb-10">
          <h2 className="text-3xl font-display font-bold text-church-900">Daily Walk Challenge</h2>
          <p className="mt-2 text-church-600">Pause. Reflect. Act.</p>
        </div>

        {/* Verse Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-t-4 border-gold-500">
          <div className="p-8 sm:p-10">
            <div className="flex items-center justify-center mb-6">
              <Book className="w-8 h-8 text-church-400 mr-2" />
              <span className="uppercase tracking-widest text-sm font-bold text-church-400">Scripture of the Day</span>
            </div>
            <blockquote className="text-center">
              <p className="text-2xl sm:text-3xl font-serif text-church-800 leading-relaxed italic">
                "{challenge.verse}"
              </p>
              <footer className="mt-6 text-church-600 font-display font-bold text-lg">
                — {challenge.reference}
              </footer>
            </blockquote>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Reflection */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-church-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <PenTool className="w-6 h-6 text-church-500 mr-2" />
              <h3 className="text-xl font-bold text-church-900">Reflection</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {challenge.reflectionQuestion}
            </p>
          </div>

          {/* Action */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-gold-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <Hand className="w-6 h-6 text-gold-500 mr-2" />
              <h3 className="text-xl font-bold text-church-900">Action Step</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {challenge.actionItem}
            </p>
          </div>
        </div>

        {/* Prayer Focus */}
        <div className="bg-church-800 rounded-xl shadow-lg p-8 text-white text-center relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full bg-black/10"></div>
           <div className="relative z-10">
             <div className="flex items-center justify-center mb-4">
               <Heart className="w-6 h-6 text-pink-400 mr-2" />
               <h3 className="text-xl font-bold text-white">Prayer Focus</h3>
             </div>
             <p className="text-xl font-serif text-church-100">
               {challenge.prayerFocus}
             </p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default DailyChallenge;
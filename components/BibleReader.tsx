import React, { useState, useEffect } from 'react';
import { getBibleChapter } from '../services/geminiService';
import { BibleChapter } from '../types';
import { ChevronLeft, ChevronRight, Book, Loader2, Search } from 'lucide-react';

// Simplified list since we are in offline mode
const AVAILABLE_BOOKS = ["Genesis", "Psalms", "John"];

const BibleReader: React.FC = () => {
  const [selectedBook, setSelectedBook] = useState("Genesis");
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [chapterData, setChapterData] = useState<BibleChapter | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchChapter(selectedBook, selectedChapter);
  }, [selectedBook, selectedChapter]);

  const fetchChapter = async (book: string, chapter: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBibleChapter(book, chapter);
      setChapterData(data);
    } catch (err) {
      setError("Failed to load scripture.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    // Basic logic for demo purposes
    if (selectedBook === "Genesis" && selectedChapter === 1) return; 
    // In a full app, we would handle book transitions
    setSelectedChapter(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrev = () => {
    if (selectedChapter > 1) {
      setSelectedChapter(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-church-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Controls */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 sticky top-20 z-10 border-b-4 border-gold-500">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-grow md:flex-grow-0">
                <select 
                  value={selectedBook}
                  onChange={(e) => {
                    setSelectedBook(e.target.value);
                    // Set specific defaults for the demo content
                    if (e.target.value === "Psalms") setSelectedChapter(23);
                    else if (e.target.value === "John") setSelectedChapter(3);
                    else setSelectedChapter(1);
                  }}
                  className="w-full md:w-48 appearance-none bg-slate-50 border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-church-500"
                >
                  {AVAILABLE_BOOKS.map(book => (
                    <option key={book} value={book}>{book}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <Book className="w-4 h-4" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-500 font-medium">Ch.</span>
                <input 
                  type="number" 
                  min="1" 
                  max="150" 
                  value={selectedChapter}
                  onChange={(e) => setSelectedChapter(parseInt(e.target.value) || 1)}
                  className="w-16 border border-gray-300 rounded px-2 py-2 text-center focus:outline-none focus:border-church-500"
                />
              </div>
            </div>

            <div className="flex gap-2 w-full md:w-auto justify-end">
              <button 
                onClick={handlePrev} 
                disabled={selectedChapter <= 1 || loading}
                className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-church-600" />
              </button>
              <button 
                onClick={handleNext}
                disabled={loading}
                className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-church-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg min-h-[500px] p-8 md:p-12 relative">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 z-20 rounded-xl">
               <Loader2 className="w-12 h-12 text-gold-500 animate-spin mb-4" />
               <p className="text-church-600 font-serif italic text-lg">Opening Scripture...</p>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-20">
              <p>{error}</p>
              <button onClick={() => fetchChapter(selectedBook, selectedChapter)} className="mt-4 text-church-600 underline">Try Again</button>
            </div>
          ) : chapterData ? (
            <article>
              <header className="text-center mb-10 border-b pb-6">
                <h1 className="text-4xl font-display font-bold text-church-900 mb-2">
                  {chapterData.book} {chapterData.chapter}
                </h1>
                <p className="text-gray-500 italic font-serif max-w-2xl mx-auto">
                  {chapterData.summary}
                </p>
              </header>
              
              <div className="prose prose-lg max-w-none text-gray-800 font-serif leading-loose">
                {chapterData.verses.map((v) => (
                  <span key={v.number} className="hover:bg-yellow-50 transition-colors rounded px-1">
                    <sup className="text-xs text-church-400 font-sans mr-1 select-none">{v.number}</sup>
                    {v.text}{' '}
                  </span>
                ))}
              </div>
            </article>
          ) : null}
        </div>

      </div>
    </div>
  );
};

export default BibleReader;
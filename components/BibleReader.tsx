import React, { useState, useEffect } from 'react';
import { getBibleChapter } from '../services/geminiService';
import { BibleChapter } from '../types';
import { ChevronLeft, ChevronRight, Book, Loader2, Search, Settings, Share2, Type } from 'lucide-react';

const BIBLE_BOOKS = [
  // Old Testament
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy",
  "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel",
  "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra",
  "Nehemiah", "Esther", "Job", "Psalms", "Proverbs",
  "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah", "Lamentations",
  "Ezekiel", "Daniel", "Hosea", "Joel", "Amos",
  "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk",
  "Zephaniah", "Haggai", "Zechariah", "Malachi",
  // New Testament
  "Matthew", "Mark", "Luke", "John", "Acts",
  "Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians",
  "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy",
  "2 Timothy", "Titus", "Philemon", "Hebrews", "James",
  "1 Peter", "2 Peter", "1 John", "2 John", "3 John",
  "Jude", "Revelation"
];

const TRANSLATIONS = [
  { code: "NIV", name: "New International Version" },
  { code: "KJV", name: "King James Version" },
  { code: "ESV", name: "English Standard Version" },
  { code: "NKJV", name: "New King James Version" },
  { code: "NLT", name: "New Living Translation" },
  { code: "NASB", name: "New American Standard Bible" }
];

const BibleReader: React.FC = () => {
  const [selectedBook, setSelectedBook] = useState("Genesis");
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [selectedTranslation, setSelectedTranslation] = useState("NIV");
  
  const [chapterData, setChapterData] = useState<BibleChapter | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // UI State
  const [fontSize, setFontSize] = useState(18); // px

  useEffect(() => {
    fetchChapter(selectedBook, selectedChapter, selectedTranslation);
  }, [selectedBook, selectedChapter, selectedTranslation]);

  const fetchChapter = async (book: string, chapter: number, translation: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBibleChapter(book, chapter, translation);
      setChapterData(data);
    } catch (err) {
      setError("Unable to retrieve scripture. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    // Simple logic: just increment chapter. 
    // In a real app, check max chapters per book and handle book rollover.
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
    <div className="min-h-screen bg-stone-50 text-gray-800 font-sans">
      
      {/* Sticky Header Controls */}
      <div className="sticky top-0 z-30 bg-white border-b border-stone-200 shadow-sm transition-all duration-300">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between gap-4">
            
            {/* Book & Chapter Selection */}
            <div className="flex items-center flex-1 gap-2 min-w-0">
               <div className="relative group flex-shrink-1 min-w-[120px]">
                 <select 
                    value={selectedBook}
                    onChange={(e) => {
                        setSelectedBook(e.target.value);
                        setSelectedChapter(1); // Reset to ch 1 on book change
                    }}
                    className="w-full appearance-none bg-stone-100 hover:bg-stone-200 border-none text-church-900 font-bold py-2 pl-3 pr-8 rounded-lg cursor-pointer focus:ring-2 focus:ring-gold-500 transition-colors text-sm sm:text-base"
                 >
                    {BIBLE_BOOKS.map(book => (
                        <option key={book} value={book}>{book}</option>
                    ))}
                 </select>
                 <Book className="absolute right-2 top-2.5 w-4 h-4 text-stone-500 pointer-events-none" />
               </div>

               <div className="flex items-center bg-stone-100 hover:bg-stone-200 rounded-lg px-2 py-1">
                   <span className="text-stone-500 text-xs font-bold mr-2 uppercase tracking-wider hidden sm:inline">Chap</span>
                   <input 
                      type="number" 
                      min="1" 
                      value={selectedChapter}
                      onChange={(e) => setSelectedChapter(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-12 bg-transparent text-church-900 font-bold text-center focus:outline-none"
                   />
               </div>
            </div>

            {/* Translation & Settings */}
            <div className="flex items-center gap-2 sm:gap-4">
                <div className="relative hidden sm:block">
                    <select 
                        value={selectedTranslation}
                        onChange={(e) => setSelectedTranslation(e.target.value)}
                        className="appearance-none bg-transparent text-church-600 font-semibold py-1 pr-6 cursor-pointer focus:outline-none text-sm"
                    >
                        {TRANSLATIONS.map(t => (
                            <option key={t.code} value={t.code}>{t.code}</option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center text-church-600">
                        <span className="text-[10px]">▼</span>
                    </div>
                </div>

                {/* Mobile Translation View (Icon) */}
                <div className="sm:hidden relative">
                     <select 
                        value={selectedTranslation}
                        onChange={(e) => setSelectedTranslation(e.target.value)}
                        className="absolute inset-0 opacity-0 w-full h-full"
                    >
                         {TRANSLATIONS.map(t => (
                            <option key={t.code} value={t.code}>{t.code}</option>
                        ))}
                    </select>
                    <button className="p-2 text-church-600 bg-stone-100 rounded-md font-bold text-xs">{selectedTranslation}</button>
                </div>

                <div className="h-6 w-px bg-stone-300 hidden sm:block"></div>

                <button 
                  onClick={() => setFontSize(prev => Math.min(prev + 2, 28))} 
                  className="p-2 text-stone-500 hover:text-church-600 hover:bg-stone-100 rounded-full transition-colors hidden sm:block"
                  title="Increase Font Size"
                >
                    <Type className="w-5 h-5" />
                </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
         <div className="bg-white rounded-xl shadow-lg min-h-[60vh] relative overflow-hidden">
            {/* Texture overlay for paper feel */}
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"></div>

            {loading ? (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
                    <Loader2 className="w-12 h-12 text-gold-500 animate-spin mb-4" />
                    <p className="text-church-800 font-display text-lg animate-pulse">Seeking Scripture...</p>
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                        <Search className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Could Not Load Chapter</h3>
                    <p className="text-gray-600 max-w-md mb-6">{error}</p>
                    <button 
                        onClick={() => fetchChapter(selectedBook, selectedChapter, selectedTranslation)}
                        className="px-6 py-2 bg-church-600 text-white font-bold rounded-lg hover:bg-church-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            ) : chapterData ? (
                <div className="relative z-0 p-8 md:p-12 lg:p-16">
                    <div className="text-center mb-10 border-b border-stone-200 pb-8">
                        <span className="text-xs font-bold tracking-[0.2em] text-gold-600 uppercase mb-2 block">
                            {TRANSLATIONS.find(t => t.code === selectedTranslation)?.name}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-church-900 mb-6">
                            {chapterData.book} <span className="text-gold-500">{chapterData.chapter}</span>
                        </h1>
                        <p className="text-stone-500 italic font-serif max-w-2xl mx-auto leading-relaxed">
                            "{chapterData.summary}"
                        </p>
                    </div>

                    <div 
                        className="font-serif text-gray-800 leading-[1.8] md:leading-[2]"
                        style={{ fontSize: `${fontSize}px` }}
                    >
                        {chapterData.verses.map((verse) => (
                            <span key={verse.number} className="group relative inline hover:bg-yellow-50/50 transition-colors rounded decoration-clone py-1">
                                <sup className="text-[0.6em] text-gold-600 font-bold mr-1 select-none opacity-60 group-hover:opacity-100 align-super">
                                    {verse.number}
                                </sup>
                                <span className="mr-1">{verse.text}</span>
                            </span>
                        ))}
                    </div>

                    {/* Footer Navigation within the card */}
                    <div className="mt-16 pt-8 border-t border-stone-100 flex justify-between items-center text-sm font-bold text-church-600">
                        <button 
                            onClick={handlePrev}
                            disabled={selectedChapter <= 1}
                            className="flex items-center hover:text-gold-600 disabled:opacity-30 disabled:hover:text-church-600 transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4 mr-1" /> Previous Chapter
                        </button>
                        <button 
                            onClick={handleNext}
                            className="flex items-center hover:text-gold-600 transition-colors"
                        >
                            Next Chapter <ChevronRight className="w-4 h-4 ml-1" />
                        </button>
                    </div>
                </div>
            ) : null}
         </div>
      </main>

      {/* Floating Action Button for Quick Share (Demo) */}
      <button 
        className="fixed bottom-8 right-8 bg-gold-500 hover:bg-gold-600 text-white p-4 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all z-40 hidden md:flex items-center justify-center"
        onClick={() => alert(`Reading ${selectedBook} ${selectedChapter} (${selectedTranslation})`)}
        title="Share Current Reading"
      >
          <Share2 className="w-6 h-6" />
      </button>

    </div>
  );
};

export default BibleReader;

import React, { useState, useEffect } from 'react';
import { BibleChapter } from '../types';
import { BibleService } from '../services/bibleService';
import { ChevronLeft, ChevronRight, Book, Search, Type, Info, Menu, X, WifiOff, Globe } from 'lucide-react';

// --- Data Structures ---

type BookData = {
  name: string;
  chapters: number;
  testament: 'Old' | 'New';
};

const BIBLE_STRUCTURE: BookData[] = [
  // Old Testament
  { name: "Genesis", chapters: 50, testament: 'Old' },
  { name: "Exodus", chapters: 40, testament: 'Old' },
  { name: "Leviticus", chapters: 27, testament: 'Old' },
  { name: "Numbers", chapters: 36, testament: 'Old' },
  { name: "Deuteronomy", chapters: 34, testament: 'Old' },
  { name: "Joshua", chapters: 24, testament: 'Old' },
  { name: "Judges", chapters: 21, testament: 'Old' },
  { name: "Ruth", chapters: 4, testament: 'Old' },
  { name: "1 Samuel", chapters: 31, testament: 'Old' },
  { name: "2 Samuel", chapters: 24, testament: 'Old' },
  { name: "1 Kings", chapters: 22, testament: 'Old' },
  { name: "2 Kings", chapters: 25, testament: 'Old' },
  { name: "1 Chronicles", chapters: 29, testament: 'Old' },
  { name: "2 Chronicles", chapters: 36, testament: 'Old' },
  { name: "Ezra", chapters: 10, testament: 'Old' },
  { name: "Nehemiah", chapters: 13, testament: 'Old' },
  { name: "Esther", chapters: 10, testament: 'Old' },
  { name: "Job", chapters: 42, testament: 'Old' },
  { name: "Psalms", chapters: 150, testament: 'Old' },
  { name: "Proverbs", chapters: 31, testament: 'Old' },
  { name: "Ecclesiastes", chapters: 12, testament: 'Old' },
  { name: "Song of Solomon", chapters: 8, testament: 'Old' },
  { name: "Isaiah", chapters: 66, testament: 'Old' },
  { name: "Jeremiah", chapters: 52, testament: 'Old' },
  { name: "Lamentations", chapters: 5, testament: 'Old' },
  { name: "Ezekiel", chapters: 48, testament: 'Old' },
  { name: "Daniel", chapters: 12, testament: 'Old' },
  { name: "Hosea", chapters: 14, testament: 'Old' },
  { name: "Joel", chapters: 3, testament: 'Old' },
  { name: "Amos", chapters: 9, testament: 'Old' },
  { name: "Obadiah", chapters: 1, testament: 'Old' },
  { name: "Jonah", chapters: 4, testament: 'Old' },
  { name: "Micah", chapters: 7, testament: 'Old' },
  { name: "Nahum", chapters: 3, testament: 'Old' },
  { name: "Habakkuk", chapters: 3, testament: 'Old' },
  { name: "Zephaniah", chapters: 3, testament: 'Old' },
  { name: "Haggai", chapters: 2, testament: 'Old' },
  { name: "Zechariah", chapters: 14, testament: 'Old' },
  { name: "Malachi", chapters: 4, testament: 'Old' },
  // New Testament
  { name: "Matthew", chapters: 28, testament: 'New' },
  { name: "Mark", chapters: 16, testament: 'New' },
  { name: "Luke", chapters: 24, testament: 'New' },
  { name: "John", chapters: 21, testament: 'New' },
  { name: "Acts", chapters: 28, testament: 'New' },
  { name: "Romans", chapters: 16, testament: 'New' },
  { name: "1 Corinthians", chapters: 16, testament: 'New' },
  { name: "2 Corinthians", chapters: 13, testament: 'New' },
  { name: "Galatians", chapters: 6, testament: 'New' },
  { name: "Ephesians", chapters: 6, testament: 'New' },
  { name: "Philippians", chapters: 4, testament: 'New' },
  { name: "Colossians", chapters: 4, testament: 'New' },
  { name: "1 Thessalonians", chapters: 5, testament: 'New' },
  { name: "2 Thessalonians", chapters: 3, testament: 'New' },
  { name: "1 Timothy", chapters: 6, testament: 'New' },
  { name: "2 Timothy", chapters: 4, testament: 'New' },
  { name: "Titus", chapters: 3, testament: 'New' },
  { name: "Philemon", chapters: 1, testament: 'New' },
  { name: "Hebrews", chapters: 13, testament: 'New' },
  { name: "James", chapters: 5, testament: 'New' },
  { name: "1 Peter", chapters: 5, testament: 'New' },
  { name: "2 Peter", chapters: 3, testament: 'New' },
  { name: "1 John", chapters: 5, testament: 'New' },
  { name: "2 John", chapters: 1, testament: 'New' },
  { name: "3 John", chapters: 1, testament: 'New' },
  { name: "Jude", chapters: 1, testament: 'New' },
  { name: "Revelation", chapters: 22, testament: 'New' }
];

const TRANSLATIONS = [
  { code: 'kjv', name: 'King James Version' },
  { code: 'web', name: 'World English Bible' },
  { code: 'bbe', name: 'Bible in Basic English' },
  { code: 'asv', name: 'American Standard Version' }
];

const BibleReader: React.FC = () => {
  // State
  const [selectedBookIndex, setSelectedBookIndex] = useState(0); // Index in BIBLE_STRUCTURE
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [selectedTranslation, setSelectedTranslation] = useState('kjv');
  const [fontSize, setFontSize] = useState(18);
  const [showBookMenu, setShowBookMenu] = useState(false);
  
  // Data State
  const [chapterData, setChapterData] = useState<BibleChapter | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Derived
  const currentBook = BIBLE_STRUCTURE[selectedBookIndex];
  
  // Fetch Data
  useEffect(() => {
    const loadChapter = async () => {
        setLoading(true);
        setError('');
        
        try {
            const data = await BibleService.getChapter(currentBook.name, selectedChapter, selectedTranslation);
            if (data) {
                setChapterData(data);
            } else {
                setError('Could not load chapter. Please check your connection.');
            }
        } catch (e) {
            setError('An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    loadChapter();
  }, [selectedBookIndex, selectedChapter, selectedTranslation]);

  // Handlers
  const handleNext = () => {
    if (selectedChapter < currentBook.chapters) {
      setSelectedChapter(prev => prev + 1);
    } else if (selectedBookIndex < BIBLE_STRUCTURE.length - 1) {
      // Go to next book
      setSelectedBookIndex(prev => prev + 1);
      setSelectedChapter(1);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrev = () => {
    if (selectedChapter > 1) {
      setSelectedChapter(prev => prev - 1);
    } else if (selectedBookIndex > 0) {
      // Go to prev book
      setSelectedBookIndex(prev => prev - 1);
      // Go to last chapter of prev book
      setSelectedChapter(BIBLE_STRUCTURE[selectedBookIndex - 1].chapters);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectBook = (index: number) => {
    setSelectedBookIndex(index);
    setSelectedChapter(1);
    setShowBookMenu(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-stone-100 font-serif text-gray-900">
      
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-sm">
         <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
            
            {/* Book Selector Trigger */}
            <button 
              onClick={() => setShowBookMenu(true)}
              className="flex items-center gap-2 px-3 py-2 hover:bg-stone-50 rounded-lg transition-colors group"
            >
               <Book className="w-5 h-5 text-stone-500 group-hover:text-church-600" />
               <div className="flex flex-col items-start">
                   <span className="font-display font-bold text-base sm:text-lg text-church-900 group-hover:text-church-700 leading-tight">
                     {currentBook.name}
                   </span>
                   <span className="text-[10px] text-stone-500 uppercase tracking-wider">
                     {currentBook.testament}
                   </span>
               </div>
            </button>

            {/* Middle Controls (Translation & Chapter) */}
            <div className="flex items-center gap-2 sm:gap-4">
                 {/* Translation Selector (Desktop) */}
                 <div className="hidden md:flex items-center bg-stone-50 rounded-lg px-2 py-1 border border-stone-100">
                     <Globe className="w-4 h-4 text-stone-400 mr-2" />
                     <select 
                        value={selectedTranslation}
                        onChange={(e) => setSelectedTranslation(e.target.value)}
                        className="bg-transparent text-sm font-bold text-stone-600 focus:outline-none cursor-pointer"
                     >
                        {TRANSLATIONS.map(t => (
                            <option key={t.code} value={t.code}>{t.code.toUpperCase()}</option>
                        ))}
                     </select>
                 </div>

                 {/* Chapter Navigator */}
                 <div className="flex items-center bg-stone-100 rounded-lg p-1">
                    <button 
                        onClick={handlePrev}
                        disabled={selectedBookIndex === 0 && selectedChapter === 1}
                        className="p-1 hover:bg-white rounded-md disabled:opacity-30 transition-all"
                    >
                        <ChevronLeft className="w-5 h-5 text-stone-600" />
                    </button>
                    <div className="px-3 font-bold font-sans text-church-800 min-w-[2.5rem] text-center">
                        {selectedChapter}
                    </div>
                    <button 
                        onClick={handleNext}
                        disabled={selectedBookIndex === BIBLE_STRUCTURE.length - 1 && selectedChapter === currentBook.chapters}
                        className="p-1 hover:bg-white rounded-md disabled:opacity-30 transition-all"
                    >
                        <ChevronRight className="w-5 h-5 text-stone-600" />
                    </button>
                 </div>
            </div>

            {/* Settings */}
            <div className="hidden sm:flex items-center border-l border-stone-200 pl-4 ml-4">
               <button 
                 onClick={() => setFontSize(s => Math.min(s + 2, 28))}
                 className="p-2 hover:bg-stone-50 rounded-full"
                 title="Increase Size"
               >
                 <Type className="w-5 h-5 text-stone-500" />
               </button>
            </div>
         </div>
      </div>

      {/* Book Selection Menu Overlay */}
      {showBookMenu && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end">
           <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
              <div className="p-4 border-b flex justify-between items-center bg-stone-50">
                 <h3 className="font-bold text-lg font-display text-church-900">Select Book</h3>
                 <button onClick={() => setShowBookMenu(false)} className="p-2 hover:bg-stone-200 rounded-full">
                    <X className="w-6 h-6 text-stone-500" />
                 </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                 {/* Mobile Translation Selector */}
                 <div className="md:hidden mb-4 p-4 bg-stone-50 rounded-xl">
                    <label className="block text-xs font-bold text-stone-500 uppercase mb-2">Translation</label>
                    <div className="flex flex-wrap gap-2">
                        {TRANSLATIONS.map(t => (
                            <button
                                key={t.code}
                                onClick={() => setSelectedTranslation(t.code)}
                                className={`px-3 py-1 rounded-full text-xs font-bold ${selectedTranslation === t.code ? 'bg-church-600 text-white' : 'bg-white border border-stone-200 text-stone-600'}`}
                            >
                                {t.name}
                            </button>
                        ))}
                    </div>
                 </div>

                 <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-3">Old Testament</h4>
                    <div className="grid grid-cols-2 gap-2">
                       {BIBLE_STRUCTURE.filter(b => b.testament === 'Old').map((b, i) => (
                          <button 
                            key={b.name}
                            onClick={() => selectBook(i)}
                            className={`text-left px-3 py-2 rounded-lg text-sm font-bold transition-colors ${currentBook.name === b.name ? 'bg-church-600 text-white' : 'hover:bg-stone-100 text-stone-700'}`}
                          >
                             {b.name}
                          </button>
                       ))}
                    </div>
                 </div>
                 <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-3">New Testament</h4>
                    <div className="grid grid-cols-2 gap-2">
                       {BIBLE_STRUCTURE.map((b, i) => ({...b, originalIndex: i})).filter(b => b.testament === 'New').map((b) => (
                          <button 
                            key={b.name}
                            onClick={() => selectBook(b.originalIndex)}
                            className={`text-left px-3 py-2 rounded-lg text-sm font-bold transition-colors ${currentBook.name === b.name ? 'bg-church-600 text-white' : 'hover:bg-stone-100 text-stone-700'}`}
                          >
                             {b.name}
                          </button>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Reader Content */}
      <main className="max-w-3xl mx-auto px-4 py-8 sm:px-6">
         <div className="bg-white shadow-xl rounded-xl overflow-hidden min-h-[80vh] relative border border-stone-200">
             {/* Paper Texture */}
             <div className="absolute inset-0 bg-[#fdfbf7] opacity-100"></div>
             
             <div className="relative z-10 p-8 md:p-12">
                <div className="text-center mb-10 pb-8 border-b border-stone-200">
                   <h1 className="text-4xl md:text-5xl font-display font-bold text-church-900 mb-2">
                      {currentBook.name} <span className="text-gold-600">{selectedChapter}</span>
                   </h1>
                   <div className="flex justify-center items-center gap-2 mt-2">
                        <span className="px-2 py-0.5 bg-stone-100 text-stone-500 text-xs font-bold rounded uppercase tracking-wider">
                            {selectedTranslation.toUpperCase()}
                        </span>
                        {error ? (
                             <span className="text-red-500 text-xs font-bold flex items-center">
                                 <WifiOff className="w-3 h-3 mr-1" /> Offline / Error
                             </span>
                        ) : (
                             <span className="text-green-600 text-xs font-bold flex items-center">
                                 Read Mode
                             </span>
                        )}
                   </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                        <div className="w-2 h-2 bg-church-400 rounded-full mb-2"></div>
                        <div className="w-2 h-2 bg-church-400 rounded-full mb-2"></div>
                        <div className="w-2 h-2 bg-church-400 rounded-full"></div>
                    </div>
                ) : chapterData ? (
                    <div 
                        className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
                        style={{ fontSize: `${fontSize}px` }}
                    >
                        {chapterData.verses.map((verse) => (
                            <span key={verse.number} className="mr-1 inline">
                                <sup className="text-[0.6em] font-bold text-gold-600 mr-1 select-none">{verse.number}</sup>
                                <span className="hover:bg-yellow-100/50 transition-colors rounded px-0.5 decoration-clone">{verse.text}</span>
                            </span>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 px-6">
                        <div className="inline-block p-4 bg-red-50 rounded-full mb-4">
                            <WifiOff className="w-8 h-8 text-red-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Scripture Unavailable</h3>
                        <p className="text-gray-500 max-w-md mx-auto mb-6">
                            We couldn't fetch this chapter. If you are offline, this chapter has not been cached yet.
                        </p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="px-6 py-2 bg-church-600 text-white font-bold rounded-lg hover:bg-church-700"
                        >
                            Retry Connection
                        </button>
                    </div>
                )}

                {/* Footer Controls */}
                <div className="mt-16 pt-8 border-t border-stone-100 flex justify-between items-center">
                   <button 
                     onClick={handlePrev}
                     disabled={selectedBookIndex === 0 && selectedChapter === 1}
                     className="flex items-center text-stone-500 hover:text-church-600 disabled:opacity-30 transition-colors font-bold text-sm"
                   >
                     <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                   </button>
                   <button 
                     onClick={handleNext}
                     disabled={selectedBookIndex === BIBLE_STRUCTURE.length - 1 && selectedChapter === currentBook.chapters}
                     className="flex items-center text-stone-500 hover:text-church-600 disabled:opacity-30 transition-colors font-bold text-sm"
                   >
                     Next <ChevronRight className="w-4 h-4 ml-1" />
                   </button>
                </div>
             </div>
         </div>
      </main>

    </div>
  );
};

export default BibleReader;
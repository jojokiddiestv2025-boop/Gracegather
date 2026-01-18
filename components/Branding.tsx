import React, { useRef } from 'react';
import { Download, ChevronLeft, Palette, Layout } from 'lucide-react';
import { AppRoute } from '../types';

const Branding: React.FC = () => {
  const fullLogoRef = useRef<SVGSVGElement>(null);
  const iconLogoRef = useRef<SVGSVGElement>(null);

  const downloadSVG = (svgRef: React.RefObject<SVGSVGElement>, filename: string) => {
    if (!svgRef.current) return;

    // Get the SVG data
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svgRef.current);

    // Add XML declaration
    if (!source.match(/^<\?xml/)) {
      source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
    }

    // Convert to blob and download
    const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
             <button 
               onClick={() => window.location.hash = '/'} 
               className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
             >
                <ChevronLeft className="w-5 h-5" />
             </button>
             <h1 className="text-xl font-bold text-church-900">Brand Assets</h1>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
           <h2 className="text-3xl font-display font-bold text-church-900 mb-4">Official GraceGather Logos</h2>
           <p className="text-gray-600 max-w-2xl mx-auto">
             Downloadable vector assets for digital and print media. 
             The cross signifies faith, while the circular embrace represents our gathering community.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Full Logo Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="bg-gray-50 p-12 flex items-center justify-center border-b border-gray-100">
                {/* SVG Render */}
                <svg
                  ref={fullLogoRef}
                  width="300"
                  height="80"
                  viewBox="0 0 300 80"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                   {/* Icon Part */}
                   <g transform="translate(10, 10)">
                      <circle cx="30" cy="30" r="30" fill="#2b4972" />
                      <path d="M30 10V50" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
                      <path d="M15 25H45" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
                      <path d="M15 30C15 45 30 50 30 50C30 50 45 45 45 30" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5" />
                   </g>

                   {/* Text Part */}
                   <text x="85" y="48" fontFamily="Merriweather, serif" fontSize="32" fontWeight="bold" fill="#2b4972">Grace</text>
                   <text x="185" y="48" fontFamily="Lato, sans-serif" fontSize="32" fontWeight="300" fill="#f59e0b">Gather</text>
                </svg>
            </div>
            <div className="p-6">
               <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                        <Layout className="w-4 h-4 mr-2 text-church-500" />
                        Full Logo
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Primary logo with wordmark.</p>
                  </div>
                  <button 
                    onClick={() => downloadSVG(fullLogoRef, 'GraceGather_Full_Logo')}
                    className="flex items-center px-4 py-2 bg-church-600 hover:bg-church-700 text-white rounded-lg text-sm font-bold transition-colors shadow-md"
                  >
                    <Download className="w-4 h-4 mr-2" /> SVG
                  </button>
               </div>
            </div>
          </div>

          {/* Icon Only Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="bg-gray-50 p-12 flex items-center justify-center border-b border-gray-100">
                {/* SVG Render */}
                <svg
                  ref={iconLogoRef}
                  width="120"
                  height="120"
                  viewBox="0 0 60 60"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                   <circle cx="30" cy="30" r="30" fill="#2b4972" />
                   <path d="M30 10V50" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
                   <path d="M15 25H45" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
                   <path d="M15 30C15 45 30 50 30 50C30 50 45 45 45 30" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5" />
                </svg>
            </div>
            <div className="p-6">
               <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                        <Palette className="w-4 h-4 mr-2 text-gold-500" />
                        Symbol Only
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">For avatars and favicons.</p>
                  </div>
                  <button 
                    onClick={() => downloadSVG(iconLogoRef, 'GraceGather_Symbol')}
                    className="flex items-center px-4 py-2 bg-church-600 hover:bg-church-700 text-white rounded-lg text-sm font-bold transition-colors shadow-md"
                  >
                    <Download className="w-4 h-4 mr-2" /> SVG
                  </button>
               </div>
            </div>
          </div>

        </div>

        {/* Color Palette Info */}
        <div className="mt-12 bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
           <h3 className="font-bold text-gray-800 mb-6">Brand Colors</h3>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                 <div className="h-16 w-full bg-church-900 rounded-lg shadow-inner"></div>
                 <div>
                    <p className="font-bold text-sm">Midnight Navy</p>
                    <p className="font-mono text-xs text-gray-500">#23344d</p>
                 </div>
              </div>
              <div className="space-y-2">
                 <div className="h-16 w-full bg-church-600 rounded-lg shadow-inner"></div>
                 <div>
                    <p className="font-bold text-sm">Fellowship Blue</p>
                    <p className="font-mono text-xs text-gray-500">#355b8e</p>
                 </div>
              </div>
              <div className="space-y-2">
                 <div className="h-16 w-full bg-gold-500 rounded-lg shadow-inner"></div>
                 <div>
                    <p className="font-bold text-sm">Glory Gold</p>
                    <p className="font-mono text-xs text-gray-500">#f59e0b</p>
                 </div>
              </div>
              <div className="space-y-2">
                 <div className="h-16 w-full bg-slate-50 border border-gray-200 rounded-lg shadow-inner"></div>
                 <div>
                    <p className="font-bold text-sm">Sanctuary White</p>
                    <p className="font-mono text-xs text-gray-500">#f8fafc</p>
                 </div>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
};

export default Branding;
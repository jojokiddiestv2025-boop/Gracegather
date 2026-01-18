import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Welcome from './components/Welcome';
import DailyChallenge from './components/DailyChallenge';
import BibleReader from './components/BibleReader';
import PastorPortal from './components/PastorPortal';
import PrayerWall from './components/PrayerWall';
import VideoGallery from './components/VideoGallery';
import Branding from './components/Branding';
import Footer from './components/Footer';
import { AppRoute } from './types';

const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(AppRoute.HOME);

  // Simple Hash Router Implementation
  useEffect(() => {
    const handleHashChange = () => {
      // Get the path without query params
      const hash = window.location.hash.slice(1).split('?')[0] || '/';
      
      // Normalize hash to match AppRoute enum
      // We check if the hash starts with any of the routes because some routes might accept params/IDs (though currently params are query based)
      const matchedRoute = Object.values(AppRoute).find(route => route === hash);
      
      if (matchedRoute) {
        setCurrentRoute(matchedRoute);
      } else {
        setCurrentRoute(AppRoute.HOME);
      }
    };

    // Set initial route
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (route: AppRoute) => {
    window.location.hash = route;
  };

  const renderContent = () => {
    switch (currentRoute) {
      case AppRoute.HOME:
        return <Welcome onNavigate={navigate} />;
      case AppRoute.BIBLE:
        return <BibleReader />;
      case AppRoute.CHALLENGE:
        return <DailyChallenge />;
      case AppRoute.PRAYER_WALL:
        return <PrayerWall />;
      case AppRoute.PASTOR_PORTAL:
        return <PastorPortal />;
      case AppRoute.VIDEOS:
        return <VideoGallery />;
      case AppRoute.BRANDING:
        return <Branding />;
      default:
        return <Welcome onNavigate={navigate} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      <Navbar currentRoute={currentRoute} onNavigate={navigate} />
      <main className="flex-grow">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
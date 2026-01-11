import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Welcome from './components/Welcome';
import DailyChallenge from './components/DailyChallenge';
import LiveConference from './components/LiveConference';
import BibleReader from './components/BibleReader';
import PastorPortal from './components/PastorPortal';
import PrayerWall from './components/PrayerWall';
import Footer from './components/Footer';
import { AppRoute } from './types';

const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(AppRoute.HOME);

  // Simple Hash Router Implementation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || '/';
      // Normalize hash to match AppRoute enum
      if (Object.values(AppRoute).includes(hash as AppRoute)) {
        setCurrentRoute(hash as AppRoute);
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
      case AppRoute.CONFERENCE:
        return <LiveConference />;
      case AppRoute.PASTOR_PORTAL:
        return <PastorPortal />;
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
      {currentRoute !== AppRoute.CONFERENCE && <Footer />}
    </div>
  );
};

export default App;
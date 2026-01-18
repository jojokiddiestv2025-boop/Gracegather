import React, { useState } from 'react';
import { Home, BookOpen, Menu, X, Book, MessageCircleHeart, Heart, Video } from 'lucide-react';
import { AppRoute } from '../types';

interface NavbarProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentRoute, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Home', path: AppRoute.HOME, icon: <Home className="w-4 h-4 mr-2" /> },
    { label: 'Bible', path: AppRoute.BIBLE, icon: <Book className="w-4 h-4 mr-2" /> },
    { label: 'Daily Manna', path: AppRoute.CHALLENGE, icon: <BookOpen className="w-4 h-4 mr-2" /> },
    { label: 'Prayer Wall', path: AppRoute.PRAYER_WALL, icon: <Heart className="w-4 h-4 mr-2" /> },
    { label: 'Gallery', path: AppRoute.VIDEOS, icon: <Video className="w-4 h-4 mr-2" /> },
    { label: 'Pastoral Care', path: AppRoute.PASTOR_PORTAL, icon: <MessageCircleHeart className="w-4 h-4 mr-2" /> },
  ];

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => onNavigate(AppRoute.HOME)}>
              <span className="text-church-600 font-display font-bold text-2xl tracking-wider">Grace<span className="text-gold-500">Gather</span></span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => onNavigate(item.path as AppRoute)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    currentRoute === item.path
                      ? 'text-church-700 bg-church-50'
                      : 'text-gray-500 hover:text-church-600 hover:bg-gray-50'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    onNavigate(item.path as AppRoute);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center px-3 py-4 rounded-md text-base font-medium ${
                    currentRoute === item.path
                      ? 'text-church-700 bg-church-50'
                      : 'text-gray-500 hover:text-church-600 hover:bg-gray-50'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
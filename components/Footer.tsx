import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-church-900 text-church-200 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <span className="font-display font-bold text-lg text-white">Grace<span className="text-gold-500">Gather</span></span>
          <p className="text-sm mt-1 text-church-400">Walking together in faith.</p>
        </div>
        <div className="flex space-x-6 text-sm">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">Statement of Faith</a>
          <a href="#/branding" className="hover:text-gold-400 transition-colors font-bold">Logo & Brand Kit</a>
        </div>
        <div className="mt-4 md:mt-0 text-xs text-church-500">
          &copy; {new Date().getFullYear()} GraceGather. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
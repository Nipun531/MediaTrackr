import React from 'react';

export const Header = () => {
  return (
    <header className="bg-purple-700 text-white px-8 py-4 flex justify-between items-center shadow-md">
      <div className="flex items-center gap-2">
        <span className="text-2xl">📺</span>
        <h1 className="text-xl font-semibold">MediaTracker</h1>
      </div>
      <div>
        <button className="flex items-center gap-2 bg-white bg-opacity-15 px-3 py-2 rounded-lg hover:bg-opacity-25 transition-colors">
          <span className="text-xl">👤</span>
          <span>My Profile</span>
        </button>
      </div>
    </header>
  );
};
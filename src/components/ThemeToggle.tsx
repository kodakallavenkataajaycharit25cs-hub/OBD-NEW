import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'light') {
      setIsLight(true);
      document.documentElement.classList.add('light-mode');
    }
  }, []);

  const toggleTheme = () => {
    if (isLight) {
      document.documentElement.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
      setIsLight(false);
    } else {
      document.documentElement.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
      setIsLight(true);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center transition-all group"
      title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
    >
      {isLight ? (
        <Moon className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
      ) : (
        <Sun className="w-4 h-4 text-yellow-500 group-hover:scale-110 transition-transform" />
      )}
    </button>
  );
}

import { useState, useEffect } from 'react';

export const Header = ({ title, subtitle }) => {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark'
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleDark = () => setIsDark(!isDark);

  return (
    <header className="flex items-center justify-between border-b border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white px-8 py-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-gray-100">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-slate-500 dark:text-gray-400">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleDark}
          className="flex items-center justify-center bg-transparent transition-transform hover:scale-110 focus:outline-none"
          style={{ fontSize: '20px' }}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-slate-200 dark:bg-gray-700 text-sm font-semibold text-slate-700 dark:text-gray-200">
            AD
          </div>
          <div className="text-sm">
            <div className="font-semibold text-slate-700 dark:text-gray-200">Admin</div>
          </div>
        </div>
      </div>
    </header>
  );
};

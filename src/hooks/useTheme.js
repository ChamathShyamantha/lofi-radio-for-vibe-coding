import { useState, useEffect } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('drift_theme') || 'lamplight';
  });

  useEffect(() => {
    localStorage.setItem('drift_theme', theme);
    document.documentElement.className = `theme-${theme}`;
  }, [theme]);

  return { theme, setTheme };
}

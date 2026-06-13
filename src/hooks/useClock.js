import { useState, useEffect } from 'react';

export function useClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours();
  let greeting = 'good night';
  if (hours >= 5 && hours < 12) greeting = 'good morning';
  else if (hours >= 12 && hours < 17) greeting = 'good afternoon';
  else if (hours >= 17 && hours < 22) greeting = 'good evening';

  const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return { timeString, greeting };
}

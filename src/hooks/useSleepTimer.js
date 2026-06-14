import { useState, useEffect, useRef } from 'react';

export function useSleepTimer(radioState) {
  const [sleepMinutes, setSleepMinutes] = useState(0);
  const [sleepActive, setSleepActive] = useState(false);
  const intervalRef = useRef(null);

  const startSleepTimer = (minutes) => {
    setSleepMinutes(minutes);
    setSleepActive(true);
  };

  const cancelSleepTimer = () => {
    setSleepActive(false);
    setSleepMinutes(0);
  };

  useEffect(() => {
    if (sleepActive && sleepMinutes > 0) {
      intervalRef.current = setInterval(() => {
        setSleepMinutes((prev) => {
          if (prev <= 1) {
            // Timer finished
            radioState.setIsPlaying(false);
            setSleepActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 60000); // Every minute
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [sleepActive, radioState]);

  return {
    sleepMinutes,
    sleepActive,
    startSleepTimer,
    cancelSleepTimer
  };
}

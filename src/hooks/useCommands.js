export function useCommands({ radioState, ambientState, timerState, themeState, setShowSticky, setShowTimerUI }) {
  const { togglePlay, nextStation, prevStation, setVolume, setStation } = radioState;
  const { setLoopVolume } = ambientState || {};
  const { startTimer, stopTimer } = timerState || {};
  const { setTheme } = themeState || {};

  const parseCommand = (cmdStr) => {
    const args = cmdStr.trim().toLowerCase().split(' ');
    const cmd = args[0];

    switch (cmd) {
      case 'play':
      case 'pause':
        togglePlay();
        return `Audio ${cmd}ed.`;
      case 'next':
        nextStation();
        return 'Tuned to next station.';
      case 'prev':
        prevStation();
        return 'Tuned to previous station.';
      case 'station':
        if (args[1]) {
          return setStation(args[1]);
        }
        return 'Usage: station <name>';
      case 'theme':
        if (setTheme) {
          const validThemes = ['lamplight', 'vaporwave', 'matrix', 'dawn'];
          if (validThemes.includes(args[1])) {
            setTheme(args[1]);
            return `Theme switched to ${args[1]}`;
          }
          return `Usage: theme <lamplight|vaporwave|matrix|dawn>`;
        }
        return 'Theme system not ready';
      case 'sticky':
        if (setShowSticky) {
          setShowSticky(prev => !prev);
          return 'Toggled sticky notes.';
        }
        return 'Sticky notes not ready';
      case 'timer':
        if (startTimer && setShowTimerUI) {
          if (args[1] === 'stop' || args[1] === 'clear') {
            stopTimer();
            return 'Timer stopped.';
          }
          if (args[1] === 'ui') {
            setShowTimerUI(prev => !prev);
            return 'Toggled timer UI.';
          }
          const val = parseInt(args[1], 10);
          if (!isNaN(val) && val > 0) {
            startTimer(val);
            setShowTimerUI(true);
            return `Timer set for ${val} minutes.`;
          }
          return 'Usage: timer <minutes> | stop | ui';
        }
        return 'Timer not ready';
      case 'rain':
      case 'crackle':
      case 'fire':
      case 'cafe':
        if (setLoopVolume) {
          if (args[1]) {
            const val = Math.min(100, Math.max(0, parseInt(args[1], 10)));
            setLoopVolume(cmd, val / 100);
            return `${cmd} volume set to ${val}%`;
          }
          return `Usage: ${cmd} <0-100>`;
        }
        return 'Ambient mixer not ready';
      case 'vol':
      case 'volume':
        if (args[1]) {
          const val = Math.min(100, Math.max(0, parseInt(args[1], 10)));
          setVolume(val / 100);
          return `Volume set to ${val}%`;
        }
        return 'Usage: volume <0-100>';
      case 'help':
        return 'Commands: play, pause, next, prev, station <name>, volume <0-100>, rain, crackle, fire, cafe <0-100>';
      case '':
        return '';
      default:
        return `Command not found: ${cmd}`;
    }
  };

  return { parseCommand };
}

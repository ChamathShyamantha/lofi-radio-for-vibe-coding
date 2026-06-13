export function useCommands({ radioState, ambientState, timerState, themeState, setShowSticky, setShowTimerUI, setShowJournal }) {
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
          const validThemes = ['lamplight', 'vaporwave', 'matrix', 'dawn', 'void', 'ocean'];
          if (validThemes.includes(args[1])) {
            setTheme(args[1]);
            return `Theme switched to ${args[1]}`;
          }
          return `Usage: theme <lamplight|vaporwave|matrix|dawn|void|ocean>`;
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
      case 'fire':
      case 'crackle':
      case 'synth':
        if (setLoopVolume) {
          const vol = parseInt(args[1], 10);
          if (!isNaN(vol)) {
            setLoopVolume(cmd, vol);
            return `${cmd} set to ${vol}%`;
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
      case 'journal':
        if (setShowJournal) {
          setShowJournal(true);
          return 'Opening distraction-free journal...';
        }
        return 'Journal not ready';
      case 'feed':
        if (args[1] === 'pet' && window.driftFM?.feedPet) {
          window.driftFM.feedPet();
          return 'Feeding the vibe pet...';
        }
        return 'Usage: feed pet';
      case 'alarm':
        if (args[1]) {
          localStorage.setItem('drift_alarm', args[1]);
          return `Alarm set for ${args[1]}`;
        }
        return 'Usage: alarm HH:MM';
      case 'help':
        return 'Commands: play, pause, next, prev, station <name>, theme <name>, volume <0-100>, rain, fire, timer <min>, sticky, journal, focus, relax, coffee, status';
      case 'focus':
        if (setTheme) setTheme('matrix');
        if (setLoopVolume) setLoopVolume('synth', 30);
        if (startTimer && setShowTimerUI) {
          startTimer(25);
          setShowTimerUI(true);
        }
        return 'Focus mode engaged. Timer started, matrix theme applied.';
      case 'relax':
        if (setTheme) setTheme('lamplight');
        if (setLoopVolume) setLoopVolume('fire', 50);
        if (startTimer) stopTimer();
        return 'Relax mode engaged. Taking a breather...';
      case 'coffee':
        return 'Error 418: I am a teapot. But you should definitely go grab a coffee.';
      case 'status':
        return 'System ready. Vibe check: PASSED. Aesthetics: MAXIMUM.';
      case 'matrix':
        if (setTheme) {
          setTheme('matrix');
          return 'Wake up, Neo...';
        }
        return 'Theme system not ready';
      case '':
        return '';
      default:
        return `Command not found: ${cmd}`;
    }
  };

  return { parseCommand };
}

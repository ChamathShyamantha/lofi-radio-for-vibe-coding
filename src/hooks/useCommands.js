export function useCommands({ radioState }) {
  const { togglePlay, nextStation, prevStation, setVolume, setStation } = radioState;

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
      case 'vol':
      case 'volume':
        if (args[1]) {
          const val = Math.min(100, Math.max(0, parseInt(args[1], 10)));
          setVolume(val / 100);
          return `Volume set to ${val}%`;
        }
        return 'Usage: volume <0-100>';
      case 'help':
        return 'Commands: play, pause, next, prev, station <name>, volume <0-100>';
      case '':
        return '';
      default:
        return `Command not found: ${cmd}`;
    }
  };

  return { parseCommand };
}

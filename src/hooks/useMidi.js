import { useEffect } from 'react';

export function useMidi() {
  useEffect(() => {
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then(access => {
        for (let input of access.inputs.values()) {
          input.onmidimessage = (message) => {
            const [command, note, velocity] = message.data;
            if (command === 144 && velocity > 0) { // Note on
              if (window.driftFM && window.driftFM.spawnItem) {
                window.driftFM.spawnItem(
                  window.innerWidth / 2, 
                  window.innerHeight / 2
                );
              }
            }
          };
        }
      }).catch(err => console.log("MIDI access denied", err));
    }
  }, []);
}

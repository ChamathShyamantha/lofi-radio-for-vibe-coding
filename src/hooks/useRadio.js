import { useState, useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { STATIONS } from '../data/stations';

// Helper to play a short burst of white noise using Web Audio API
function playStaticNoise(durationMs = 300) {
  const ctx = Howler.ctx;
  if (!ctx) return;
  
  const bufferSize = ctx.sampleRate * (durationMs / 1000);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  
  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = buffer;
  
  // Highpass filter for that "radio static" sound
  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 1000;
  
  // Fade out envelope
  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + (durationMs / 1000));
  
  noiseSource.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  noiseSource.start();
}

export function useRadio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [currentStationIndex, setCurrentStationIndex] = useState(() => {
    return parseInt(localStorage.getItem('drift_station') || '0', 10);
  });
  const [volume, setVolume] = useState(() => {
    return parseFloat(localStorage.getItem('drift_volume') || '0.5');
  });
  const howlRef = useRef(null);
  const isTransitioning = useRef(false);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);

  useEffect(() => { localStorage.setItem('drift_station', currentStationIndex); }, [currentStationIndex]);
  useEffect(() => { localStorage.setItem('drift_volume', volume); }, [volume]);

  const station = STATIONS[currentStationIndex];

  useEffect(() => {
    if (!Howler.ctx) return;
    if (!analyserRef.current) {
      const analyser = Howler.ctx.createAnalyser();
      analyser.fftSize = 64; // small fftSize for chunky visualizer
      Howler.masterGain.connect(analyser);
      analyserRef.current = analyser;
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
    }
  }, [isPlaying]);

  useEffect(() => {
    const oldHowl = howlRef.current;
    
    if (oldHowl) {
      isTransitioning.current = true;
      oldHowl.fade(volume, 0, 800);
      setTimeout(() => {
        oldHowl.unload();
      }, 800);
      playStaticNoise(300);
    }

    const newHowl = new Howl({
      src: [station.url],
      html5: true,
      volume: oldHowl && isPlaying ? 0 : volume,
      onplay: () => { setIsPlaying(true); setIsBuffering(false); },
      onpause: () => setIsPlaying(false),
      onstop: () => setIsPlaying(false),
      onload: () => setIsBuffering(false),
      onloaderror: () => setIsBuffering(false),
      onplayerror: () => {
        newHowl.once('unlock', () => {
          newHowl.play();
        });
      }
    });

    howlRef.current = newHowl;

    if (isPlaying) {
      setIsBuffering(true);
      newHowl.play();
      if (oldHowl) {
        newHowl.fade(0, volume, 800);
        setTimeout(() => {
          isTransitioning.current = false;
        }, 800);
      }
    }

    return () => {};
  }, [station.url]);

  useEffect(() => {
    if (howlRef.current && !isTransitioning.current) {
      howlRef.current.volume(volume);
    }
  }, [volume]);

  const togglePlay = () => {
    if (!howlRef.current) return;
    if (isPlaying) {
      howlRef.current.pause();
    } else {
      howlRef.current.play();
    }
  };

  const nextStation = () => {
    setCurrentStationIndex((prev) => (prev + 1) % STATIONS.length);
  };

  const prevStation = () => {
    setCurrentStationIndex((prev) => (prev - 1 + STATIONS.length) % STATIONS.length);
  };

  const setStation = (query) => {
    const q = query.toLowerCase();
    const index = STATIONS.findIndex(s => s.id === q || s.name.includes(q));
    if (index !== -1) {
      setCurrentStationIndex(index);
      return `Tuned to ${STATIONS[index].name}`;
    }
    return `Station not found: ${query}`;
  };

  const getAudioData = () => {
    if (analyserRef.current && dataArrayRef.current && isPlaying) {
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      return dataArrayRef.current;
    }
    return null;
  };

  return {
    station,
    currentStationIndex,
    setCurrentStationIndex,
    isPlaying,
    setIsPlaying,
    isBuffering,
    volume,
    setVolume,
    togglePlay,
    nextStation,
    prevStation,
    setStation,
    getAudioData
  };
}

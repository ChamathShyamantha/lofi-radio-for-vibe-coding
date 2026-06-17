import { useState, useEffect, useRef, useCallback } from 'react';
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

// ─── YouTube IFrame API loader ─────────────────────────────────────────────
let ytApiReady = false;
let ytApiPromise = null;

function loadYouTubeAPI() {
  if (ytApiReady) return Promise.resolve();
  if (ytApiPromise) return ytApiPromise;

  ytApiPromise = new Promise((resolve) => {
    // If the API is already loaded by something else
    if (window.YT && window.YT.Player) {
      ytApiReady = true;
      resolve();
      return;
    }

    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      ytApiReady = true;
      if (prev) prev();
      resolve();
    };

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
  });

  return ytApiPromise;
}

// ────────────────────────────────────────────────────────────────────────────

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

  // YouTube refs
  const ytPlayerRef = useRef(null);
  const ytContainerRef = useRef(null);
  const wasPlayingRef = useRef(false); // track play intent across station changes

  useEffect(() => { localStorage.setItem('drift_station', currentStationIndex); }, [currentStationIndex]);
  useEffect(() => { localStorage.setItem('drift_volume', volume); }, [volume]);

  const station = STATIONS[currentStationIndex];
  const isYouTube = !!station.youtubeId;

  // ─── Ensure hidden YouTube container exists in the DOM ──────────────────
  useEffect(() => {
    let container = document.getElementById('yt-player-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'yt-player-container';
      container.style.cssText = 'position:fixed;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none;z-index:-1;left:-9999px;top:-9999px;';
      document.body.appendChild(container);

      const playerDiv = document.createElement('div');
      playerDiv.id = 'yt-player';
      container.appendChild(playerDiv);
    }
    ytContainerRef.current = container;
  }, []);

  // ─── Howler analyser setup ──────────────────────────────────────────────
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

  // ─── Destroy helpers ───────────────────────────────────────────────────
  const destroyHowl = useCallback(() => {
    if (howlRef.current) {
      howlRef.current.unload();
      howlRef.current = null;
    }
  }, []);

  const destroyYTPlayer = useCallback(() => {
    if (ytPlayerRef.current) {
      try { ytPlayerRef.current.destroy(); } catch { /* ignore */ }
      ytPlayerRef.current = null;
      // Re-create the div so next YT.Player can bind
      const container = document.getElementById('yt-player-container');
      if (container) {
        container.innerHTML = '';
        const playerDiv = document.createElement('div');
        playerDiv.id = 'yt-player';
        container.appendChild(playerDiv);
      }
    }
  }, []);

  // ─── Station change handler ────────────────────────────────────────────
  useEffect(() => {
    // Remember if we were playing so we can auto-resume on station switch
    const shouldAutoPlay = isPlaying || wasPlayingRef.current;
    wasPlayingRef.current = false;

    playStaticNoise(300);

    if (isYouTube) {
      // Tear down Howler if it was active
      destroyHowl();

      // Set up YouTube player
      setIsBuffering(true);
      loadYouTubeAPI().then(() => {
        // Destroy any previous YT player
        destroyYTPlayer();

        // Re-create the target div
        const container = document.getElementById('yt-player-container');
        if (container && !document.getElementById('yt-player')) {
          const playerDiv = document.createElement('div');
          playerDiv.id = 'yt-player';
          container.appendChild(playerDiv);
        }

        const player = new window.YT.Player('yt-player', {
          videoId: station.youtubeId,
          playerVars: {
            autoplay: shouldAutoPlay ? 1 : 0,
            loop: 1,
            playlist: station.youtubeId, // required for loop to work
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            rel: 0,
            iv_load_policy: 3,
          },
          events: {
            onReady: (e) => {
              e.target.setVolume(volume * 100);
              if (shouldAutoPlay) {
                e.target.playVideo();
              }
              setIsBuffering(false);
            },
            onStateChange: (e) => {
              const state = e.data;
              if (state === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true);
                setIsBuffering(false);
              } else if (state === window.YT.PlayerState.BUFFERING) {
                setIsBuffering(true);
              } else if (state === window.YT.PlayerState.PAUSED) {
                setIsPlaying(false);
              } else if (state === window.YT.PlayerState.ENDED) {
                // Loop: seek back to start and play again
                e.target.seekTo(0);
                e.target.playVideo();
              }
            },
            onError: () => {
              setIsBuffering(false);
            }
          }
        });

        ytPlayerRef.current = player;
      });
    } else {
      // Tear down YouTube player if it was active
      destroyYTPlayer();

      // Standard Howler stream
      const oldHowl = howlRef.current;
      
      if (oldHowl) {
        isTransitioning.current = true;
        oldHowl.fade(volume, 0, 800);
        setTimeout(() => { oldHowl.unload(); }, 800);
      }

      const newHowl = new Howl({
        src: [station.url],
        html5: true,
        volume: oldHowl && shouldAutoPlay ? 0 : volume,
        onplay: () => { setIsPlaying(true); setIsBuffering(false); },
        onpause: () => setIsPlaying(false),
        onstop: () => setIsPlaying(false),
        onload: () => setIsBuffering(false),
        onloaderror: () => setIsBuffering(false),
        onplayerror: () => {
          newHowl.once('unlock', () => { newHowl.play(); });
        }
      });

      howlRef.current = newHowl;

      if (shouldAutoPlay) {
        setIsBuffering(true);
        newHowl.play();
        if (oldHowl) {
          newHowl.fade(0, volume, 800);
          setTimeout(() => { isTransitioning.current = false; }, 800);
        }
      }
    }

    return () => {};
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [station.id]);

  // ─── Volume sync ───────────────────────────────────────────────────────
  useEffect(() => {
    if (isYouTube) {
      if (ytPlayerRef.current && typeof ytPlayerRef.current.setVolume === 'function') {
        ytPlayerRef.current.setVolume(volume * 100);
      }
    } else {
      if (howlRef.current && !isTransitioning.current) {
        howlRef.current.volume(volume);
      }
    }
  }, [volume, isYouTube]);

  // ─── Media Session & Title Sync (For PreMiD & OS Media Controls) ───────
  useEffect(() => {
    // Update document title for PreMiD scraping and UX
    const status = isPlaying ? '🎵' : '⏸️';
    document.title = `${status} ${station.name} | VibeCode FM`;

    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: station.name,
        artist: 'VibeCode FM',
        album: station.vibe,
        artwork: [
          { src: '/vite.svg', sizes: '192x192', type: 'image/svg+xml' } // generic icon fallback
        ]
      });

      // We define these as functions that call the latest togglePlay/etc
      // Since they are registered once, we use a wrapper or update them when needed
      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
    }
  }, [station, isPlaying]);

  // We set action handlers separately so they always have access to the latest state/functions
  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => {
        // We can't directly call togglePlay if it's stale, but togglePlay is re-created every render
        // Actually, best to just trigger the play state
        if (isYouTube && ytPlayerRef.current) {
          ytPlayerRef.current.playVideo();
        } else if (howlRef.current) {
          howlRef.current.play();
        }
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        if (isYouTube && ytPlayerRef.current) {
          ytPlayerRef.current.pauseVideo();
        } else if (howlRef.current) {
          howlRef.current.pause();
        }
      });
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        setCurrentStationIndex((prev) => (prev - 1 + STATIONS.length) % STATIONS.length);
        wasPlayingRef.current = true;
      });
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        setCurrentStationIndex((prev) => (prev + 1) % STATIONS.length);
        wasPlayingRef.current = true;
      });
    }
  }, [isYouTube]); // Re-bind if youtube/audio mode changes


  // ─── Controls ──────────────────────────────────────────────────────────
  const togglePlay = () => {
    if (isYouTube) {
      const player = ytPlayerRef.current;
      if (!player) return;
      try {
        const state = player.getPlayerState();
        if (state === window.YT.PlayerState.PLAYING) {
          player.pauseVideo();
        } else {
          player.playVideo();
        }
      } catch {
        // Player might not be ready yet
      }
    } else {
      if (!howlRef.current) return;
      if (isPlaying) {
        howlRef.current.pause();
      } else {
        howlRef.current.play();
      }
    }
  };

  const nextStation = () => {
    wasPlayingRef.current = isPlaying;
    setCurrentStationIndex((prev) => (prev + 1) % STATIONS.length);
  };

  const prevStation = () => {
    wasPlayingRef.current = isPlaying;
    setCurrentStationIndex((prev) => (prev - 1 + STATIONS.length) % STATIONS.length);
  };

  const setStation = (query) => {
    const q = query.toLowerCase();
    const index = STATIONS.findIndex(s => s.id === q || s.name.includes(q));
    if (index !== -1) {
      wasPlayingRef.current = isPlaying;
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

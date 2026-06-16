import { useState, useEffect, useRef } from 'react';

export function useNowPlaying(station) {
  const [nowPlaying, setNowPlaying] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    // YouTube stations don't have SomaFM metadata
    if (station?.youtubeId) {
      setNowPlaying({
        title: station.vibe || 'YouTube Stream',
        artist: station.name || 'Unknown',
      });
      return;
    }

    if (!station?.somaId) {
      setNowPlaying(null);
      return;
    }

    const fetchNowPlaying = async () => {
      try {
        const res = await fetch(`https://somafm.com/songs/${station.somaId}.json`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.songs && data.songs.length > 0) {
          const song = data.songs[0];
          setNowPlaying({
            title: song.title || 'Unknown',
            artist: song.artist || 'Unknown Artist',
          });
        }
      } catch {
        // Silently fail — don't break the UI for metadata
      }
    };

    fetchNowPlaying();
    intervalRef.current = setInterval(fetchNowPlaying, 30000); // poll every 30s

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [station?.somaId]);

  return nowPlaying;
}

import { useEffect } from 'react';

export function useWeatherSync(ambientState, themeState) {
  useEffect(() => {
    let mounted = true;
    
    async function syncWeather() {
      try {
        const ipRes = await fetch('https://ipapi.co/json/');
        const ipData = await ipRes.json();
        
        if (!mounted || !ipData.latitude) return;
        
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${ipData.latitude}&longitude=${ipData.longitude}&current_weather=true`);
        const weatherData = await weatherRes.json();
        
        if (!mounted || !weatherData.current_weather) return;
        
        const code = weatherData.current_weather.weathercode;
        // WMO codes for Rain: 51-65, 80-82, 95-99
        const isRaining = [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(code);
        
        if (isRaining && ambientState.setLoopVolume) {
          ambientState.setLoopVolume('rain', 50, false);
        }
        
        const hour = new Date().getHours();
        if (hour >= 5 && hour <= 8 && themeState.setTheme) {
          themeState.setTheme('dawn');
        } else if (hour >= 18 && hour <= 20 && themeState.setTheme) {
          themeState.setTheme('vaporwave');
        }
      } catch (e) {
        console.log("Weather sync failed", e);
      }
    }
    
    syncWeather();
    
    return () => { mounted = false; };
  }, []);
}

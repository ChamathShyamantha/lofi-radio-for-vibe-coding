export const SNIPPETS = [
  "// TIP: Type 'play' to start the music.\nstartRadioStream();",
  "// MANTRA: One task at a time.\nconst focus = true;",
  "// TIP: Try 'timer 25' for a pomodoro session.\ninitTimer(25);",
  "// TIP: Change the vibe with 'theme vaporwave'.\nsetTheme('vaporwave');",
  "// MANTRA: Breathe in, breathe out.\nawait relax();",
  "// TIP: You can drag the windows around!\nmakeDraggable();",
  "// TIP: Type 'rain 50' to add some rain sounds.\nsetAmbient('rain', 50);",
  "// MANTRA: Progress, not perfection.\ncommitChanges();",
  "// TIP: Explore themes: lamplight, vaporwave, matrix, dawn.\nloadThemes();"
];

export function highlightText(text) {
  let html = text
    .replace(/\/\/.*/g, match => `<span class="text-haze">${match}</span>`)
    .replace(/(while|if|for|const|let|var|return|await)/g, `<span class="text-phosphor">$1</span>`)
    .replace(/('.*'|".*")/g, `<span class="text-lamp">$1</span>`)
    .replace(/([a-zA-Z0-9_]+)\(/g, `<span class="text-ember">$1</span>(`);

  return { __html: html };
}

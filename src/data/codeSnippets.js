export const SNIPPETS = [
  "// TIP: Type 'play' to start the music.\nstartRadioStream();",
  "// VIBE CODING: One task at a time.\nconst focus = true;",
  "// TIP: Try 'timer 25' for a pomodoro session.\ninitTimer(25);",
  "// VIBE CODING: Let the aesthetic guide the logic.\nsetTheme('vaporwave');",
  "// TIP: Type 'rain 50' or 'fire 30' to set the mood.\nawait mixAmbientSounds();",
  "// VIBE CODING: Less stressing, more vibing.\nrelaxAndCode();",
  "// TIP: Type 'coffee' or 'matrix' for hidden commands.\nloadEasterEggs();",
  "// MANTRA: Progress, not perfection.\ncommitChanges();",
  "// TIP: Type 'journal' to open a distraction-free notepad.\nopenJournal();"
];

export function highlightText(text) {
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\/\/.*/g, match => `<span class="text-haze">${match}</span>`)
    .replace(/\b(while|if|for|const|let|var|return|await)\b/g, `<span class="text-phosphor">$1</span>`)
    .replace(/('.*?')/g, `<span class="text-lamp">$1</span>`)
    .replace(/([a-zA-Z0-9_]+)\(/g, `<span class="text-ember">$1</span>(`);

  return { __html: html };
}

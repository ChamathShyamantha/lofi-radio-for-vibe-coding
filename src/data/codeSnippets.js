export const SNIPPETS = [
  "brewCoffee();",
  "applyForce(vibes);",
  "while(night) { focus++; }",
  "// TODO: sleep"
];

export function highlightText(text) {
  // Simple regex-based syntax highlighter for the typewriter
  let html = text
    .replace(/\/\/.*/g, match => `<span class="text-haze">${match}</span>`)
    .replace(/(while|if|for|const|let|var|return)/g, `<span class="text-phosphor">$1</span>`)
    .replace(/('.*'|".*")/g, `<span class="text-lamp">$1</span>`)
    .replace(/([a-zA-Z0-9_]+)\(/g, `<span class="text-ember">$1</span>(`);

  // Default color for unmatched
  return { __html: html };
}

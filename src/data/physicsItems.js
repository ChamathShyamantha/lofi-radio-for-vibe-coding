const makeSvgUri = (svgStr) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgStr)}`;

const keycapSvg = `<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="36" height="36" rx="6" fill="#1A1F2E" stroke="#FFB454" stroke-width="2"/><rect x="6" y="6" width="28" height="24" rx="4" fill="#0B0E14"/></svg>`;
const mugSvg = `<svg width="50" height="40" viewBox="0 0 50 40" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="30" height="35" rx="4" fill="#E8606B"/><path d="M 35 10 C 45 10, 45 30, 35 30" fill="none" stroke="#E8606B" stroke-width="6" stroke-linecap="round"/></svg>`;
const cassetteSvg = `<svg width="60" height="40" viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="60" height="40" rx="4" fill="#8B93A7"/><rect x="5" y="5" width="50" height="15" fill="#1A1F2E"/><circle cx="15" cy="12.5" r="5" fill="#0B0E14"/><circle cx="45" cy="12.5" r="5" fill="#0B0E14"/></svg>`;

export const PHYSICS_ITEMS = [
  { name: 'keycap', width: 40, height: 40, texture: makeSvgUri(keycapSvg) },
  { name: 'mug', width: 50, height: 40, texture: makeSvgUri(mugSvg) },
  { name: 'cassette', width: 60, height: 40, texture: makeSvgUri(cassetteSvg) },
];

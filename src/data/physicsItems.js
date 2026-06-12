export const makeSvgUri = (svgStr) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgStr)}`;

const keycapSvg = `<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="36" height="36" rx="6" fill="#1A1F2E" stroke="#FFB454" stroke-width="2"/><rect x="6" y="6" width="28" height="24" rx="4" fill="#0B0E14"/></svg>`;
const mugSvg = `<svg width="50" height="40" viewBox="0 0 50 40" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="30" height="35" rx="4" fill="#E8606B"/><path d="M 35 10 C 45 10, 45 30, 35 30" fill="none" stroke="#E8606B" stroke-width="6" stroke-linecap="round"/></svg>`;
const cassetteSvg = `<svg width="60" height="40" viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="60" height="40" rx="4" fill="#8B93A7"/><rect x="5" y="5" width="50" height="15" fill="#1A1F2E"/><circle cx="15" cy="12.5" r="5" fill="#0B0E14"/><circle cx="45" cy="12.5" r="5" fill="#0B0E14"/></svg>`;

const gameboySvg = `<svg width="40" height="60" viewBox="0 0 40 60" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="40" height="60" rx="4" fill="#8B93A7"/><rect x="4" y="4" width="32" height="24" rx="2" fill="#1A1F2E"/><circle cx="28" cy="40" r="4" fill="#E8606B"/><circle cx="16" cy="46" r="4" fill="#E8606B"/><rect x="6" y="38" width="12" height="12" fill="none" stroke="#0B0E14" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const plantSvg = `<svg width="40" height="50" viewBox="0 0 40 50" xmlns="http://www.w3.org/2000/svg"><path d="M 20 40 C 5 20, 15 5, 20 5 C 25 5, 35 20, 20 40" fill="#9FE88D"/><rect x="15" y="40" width="10" height="10" fill="#FFB454"/></svg>`;
const moonSvg = `<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M 35 20 C 35 30, 25 35, 15 35 C 25 35, 30 25, 30 15 C 30 10, 25 5, 15 5 C 25 5, 35 10, 35 20 Z" fill="#FFB454"/></svg>`;
export const petSvg = `<svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="20" width="30" height="20" rx="5" fill="#9FE88D"/><circle cx="15" cy="15" r="5" fill="#9FE88D"/><circle cx="35" cy="15" r="5" fill="#9FE88D"/><circle cx="20" cy="25" r="2" fill="#0B0E14"/><circle cx="30" cy="25" r="2" fill="#0B0E14"/><path d="M 22 30 Q 25 35 28 30" fill="none" stroke="#0B0E14" stroke-width="2"/></svg>`;
export const foodSvg = `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="10" fill="#E8606B"/></svg>`;

export const PHYSICS_ITEMS = [
  { name: 'keycap', width: 40, height: 40, texture: makeSvgUri(keycapSvg) },
  { name: 'mug', width: 50, height: 40, texture: makeSvgUri(mugSvg) },
  { name: 'cassette', width: 60, height: 40, texture: makeSvgUri(cassetteSvg) },
  { name: 'gameboy', width: 40, height: 60, texture: makeSvgUri(gameboySvg) },
  { name: 'plant', width: 40, height: 50, texture: makeSvgUri(plantSvg) },
  { name: 'moon', width: 40, height: 40, texture: makeSvgUri(moonSvg) },
];

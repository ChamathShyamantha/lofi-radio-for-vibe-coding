export const makeSvgUri = (svgStr) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgStr)}`;

const keycapSvg = `<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="36" height="36" rx="6" fill="#1A1F2E" stroke="#FFB454" stroke-width="2"/><rect x="6" y="6" width="28" height="24" rx="4" fill="#0B0E14"/></svg>`;
const mugSvg = `<svg width="50" height="40" viewBox="0 0 50 40" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="30" height="35" rx="4" fill="#E8606B"/><path d="M 35 10 C 45 10, 45 30, 35 30" fill="none" stroke="#E8606B" stroke-width="6" stroke-linecap="round"/></svg>`;
const cassetteSvg = `<svg width="60" height="40" viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="60" height="40" rx="4" fill="#8B93A7"/><rect x="5" y="5" width="50" height="15" fill="#1A1F2E"/><circle cx="15" cy="12.5" r="5" fill="#0B0E14"/><circle cx="45" cy="12.5" r="5" fill="#0B0E14"/></svg>`;
const gameboySvg = `<svg width="40" height="60" viewBox="0 0 40 60" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="40" height="60" rx="4" fill="#8B93A7"/><rect x="4" y="4" width="32" height="24" rx="2" fill="#1A1F2E"/><circle cx="28" cy="40" r="4" fill="#E8606B"/><circle cx="16" cy="46" r="4" fill="#E8606B"/><rect x="6" y="38" width="12" height="12" fill="none" stroke="#0B0E14" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const plantSvg = `<svg width="40" height="50" viewBox="0 0 40 50" xmlns="http://www.w3.org/2000/svg"><path d="M 20 40 C 5 20, 15 5, 20 5 C 25 5, 35 20, 20 40" fill="#9FE88D"/><rect x="15" y="40" width="10" height="10" fill="#FFB454"/></svg>`;
const moonSvg = `<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M 35 20 C 35 30, 25 35, 15 35 C 25 35, 30 25, 30 15 C 30 10, 25 5, 15 5 C 25 5, 35 10, 35 20 Z" fill="#FFB454"/></svg>`;
const headphonesSvg = `<svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><path d="M 10 30 C 10 15, 40 15, 40 30" fill="none" stroke="#c77dff" stroke-width="4" stroke-linecap="round"/><rect x="5" y="28" width="10" height="16" rx="4" fill="#c77dff"/><rect x="35" y="28" width="10" height="16" rx="4" fill="#c77dff"/></svg>`;
const vinylSvg = `<svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><circle cx="25" cy="25" r="23" fill="#1A1F2E" stroke="#8B93A7" stroke-width="2"/><circle cx="25" cy="25" r="15" fill="none" stroke="#8B93A7" stroke-width="0.5" opacity="0.5"/><circle cx="25" cy="25" r="10" fill="none" stroke="#8B93A7" stroke-width="0.5" opacity="0.5"/><circle cx="25" cy="25" r="5" fill="#E8606B"/><circle cx="25" cy="25" r="2" fill="#0B0E14"/></svg>`;
const starSvg = `<svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg"><polygon points="18,2 22,14 35,14 25,22 28,34 18,27 8,34 11,22 1,14 14,14" fill="#FFB454" opacity="0.8"/></svg>`;
const bookSvg = `<svg width="40" height="50" viewBox="0 0 40 50" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="2" width="30" height="46" rx="2" fill="#E8606B"/><rect x="5" y="2" width="6" height="46" fill="#c0392b"/><line x1="15" y1="12" x2="32" y2="12" stroke="#0B0E14" stroke-width="2" opacity="0.3"/><line x1="15" y1="18" x2="28" y2="18" stroke="#0B0E14" stroke-width="2" opacity="0.3"/></svg>`;
const clockSvg = `<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="18" fill="#1A1F2E" stroke="#9FE88D" stroke-width="2"/><line x1="20" y1="20" x2="20" y2="8" stroke="#9FE88D" stroke-width="2" stroke-linecap="round"/><line x1="20" y1="20" x2="28" y2="20" stroke="#9FE88D" stroke-width="2" stroke-linecap="round"/><circle cx="20" cy="20" r="2" fill="#9FE88D"/></svg>`;
const noteSvg = `<svg width="30" height="36" viewBox="0 0 30 36" xmlns="http://www.w3.org/2000/svg"><ellipse cx="10" cy="30" rx="8" ry="5" fill="#c77dff"/><line x1="18" y1="30" x2="18" y2="4" stroke="#c77dff" stroke-width="3"/><path d="M 18 4 C 18 4, 28 6, 28 14" fill="none" stroke="#c77dff" stroke-width="3" stroke-linecap="round"/></svg>`;
const cloudSvg = `<svg width="50" height="35" viewBox="0 0 50 35" xmlns="http://www.w3.org/2000/svg"><ellipse cx="25" cy="22" rx="20" ry="12" fill="#8B93A7" opacity="0.5"/><ellipse cx="18" cy="16" rx="12" ry="10" fill="#8B93A7" opacity="0.5"/><ellipse cx="34" cy="18" rx="10" ry="8" fill="#8B93A7" opacity="0.5"/></svg>`;
const heartSvg = `<svg width="36" height="34" viewBox="0 0 36 34" xmlns="http://www.w3.org/2000/svg"><path d="M 18 30 C 4 20, -2 8, 9 4 C 14 2, 18 8, 18 8 C 18 8, 22 2, 27 4 C 38 8, 32 20, 18 30 Z" fill="#E8606B" opacity="0.7"/></svg>`;

// New batch of items
const catSvg = `<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><ellipse cx="20" cy="25" rx="14" ry="12" fill="#FFB454"/><polygon points="8,18 6,4 16,14" fill="#FFB454"/><polygon points="32,18 34,4 24,14" fill="#FFB454"/><circle cx="15" cy="22" r="2" fill="#0B0E14"/><circle cx="25" cy="22" r="2" fill="#0B0E14"/><ellipse cx="20" cy="26" rx="2" ry="1.5" fill="#E8606B"/></svg>`;
const lampSvg = `<svg width="36" height="50" viewBox="0 0 36 50" xmlns="http://www.w3.org/2000/svg"><path d="M 8 5 L 28 5 L 24 28 L 12 28 Z" fill="#FFB454" opacity="0.8"/><rect x="14" y="28" width="8" height="6" fill="#8B93A7"/><rect x="12" y="34" width="12" height="4" rx="2" fill="#8B93A7"/><line x1="18" y1="5" x2="18" y2="0" stroke="#8B93A7" stroke-width="2"/></svg>`;
const pizzaSvg = `<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M 20 5 L 5 35 L 35 35 Z" fill="#FFB454"/><circle cx="16" cy="25" r="3" fill="#E8606B"/><circle cx="24" cy="22" r="3" fill="#E8606B"/><circle cx="20" cy="30" r="2.5" fill="#9FE88D"/></svg>`;
const rocketSvg = `<svg width="30" height="50" viewBox="0 0 30 50" xmlns="http://www.w3.org/2000/svg"><ellipse cx="15" cy="20" rx="8" ry="18" fill="#8B93A7"/><circle cx="15" cy="16" r="4" fill="#00f5d4" opacity="0.7"/><path d="M 7 30 L 3 40 L 10 35" fill="#E8606B"/><path d="M 23 30 L 27 40 L 20 35" fill="#E8606B"/><path d="M 11 38 L 15 46 L 19 38" fill="#FFB454"/></svg>`;
const diamondSvg = `<svg width="36" height="40" viewBox="0 0 36 40" xmlns="http://www.w3.org/2000/svg"><polygon points="18,2 34,14 18,38 2,14" fill="#00f5d4" opacity="0.6"/><polygon points="18,2 34,14 18,14" fill="#00f5d4" opacity="0.4"/><line x1="18" y1="2" x2="18" y2="38" stroke="#fff" stroke-width="0.5" opacity="0.3"/></svg>`;
const floppySvg = `<svg width="44" height="44" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="40" height="40" rx="3" fill="#1A1F2E" stroke="#c77dff" stroke-width="2"/><rect x="10" y="2" width="20" height="16" fill="#8B93A7"/><rect x="18" y="4" width="8" height="12" fill="#1A1F2E"/><rect x="8" y="26" width="28" height="14" rx="2" fill="#0B0E14"/></svg>`;
const coffeeBeanSvg = `<svg width="30" height="36" viewBox="0 0 30 36" xmlns="http://www.w3.org/2000/svg"><ellipse cx="15" cy="18" rx="12" ry="16" fill="#6F4E37"/><path d="M 15 4 C 10 12, 10 24, 15 32" fill="none" stroke="#0B0E14" stroke-width="2" opacity="0.4"/></svg>`;
const joystickSvg = `<svg width="40" height="50" viewBox="0 0 40 50" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="32" width="30" height="14" rx="4" fill="#1A1F2E" stroke="#E8606B" stroke-width="2"/><rect x="17" y="14" width="6" height="22" rx="3" fill="#8B93A7"/><circle cx="20" cy="12" r="7" fill="#E8606B"/></svg>`;
const speakerSvg = `<svg width="40" height="50" viewBox="0 0 40 50" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="36" height="46" rx="4" fill="#1A1F2E" stroke="#8B93A7" stroke-width="2"/><circle cx="20" cy="20" r="10" fill="#0B0E14" stroke="#8B93A7" stroke-width="1.5"/><circle cx="20" cy="20" r="4" fill="#8B93A7"/><circle cx="20" cy="40" r="4" fill="#0B0E14" stroke="#8B93A7" stroke-width="1"/></svg>`;
const pencilSvg = `<svg width="14" height="50" viewBox="0 0 14 50" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="8" width="10" height="34" fill="#FFB454"/><polygon points="2,42 12,42 7,50" fill="#f5cba7"/><rect x="2" y="6" width="10" height="6" fill="#E8606B"/><polygon points="2,8 12,8 7,2" fill="#8B93A7"/></svg>`;

export const petSvg = `<svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="20" width="30" height="20" rx="5" fill="#9FE88D"/><circle cx="15" cy="15" r="5" fill="#9FE88D"/><circle cx="35" cy="15" r="5" fill="#9FE88D"/><circle cx="20" cy="25" r="2" fill="#0B0E14"/><circle cx="30" cy="25" r="2" fill="#0B0E14"/><path d="M 22 30 Q 25 35 28 30" fill="none" stroke="#0B0E14" stroke-width="2"/></svg>`;
export const foodSvg = `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="10" fill="#E8606B"/></svg>`;

export const PHYSICS_ITEMS = [
  { name: 'keycap', width: 40, height: 40, texture: makeSvgUri(keycapSvg) },
  { name: 'mug', width: 50, height: 40, texture: makeSvgUri(mugSvg) },
  { name: 'cassette', width: 60, height: 40, texture: makeSvgUri(cassetteSvg) },
  { name: 'gameboy', width: 40, height: 60, texture: makeSvgUri(gameboySvg) },
  { name: 'plant', width: 40, height: 50, texture: makeSvgUri(plantSvg) },
  { name: 'moon', width: 40, height: 40, texture: makeSvgUri(moonSvg) },
  { name: 'headphones', width: 50, height: 50, texture: makeSvgUri(headphonesSvg) },
  { name: 'vinyl', width: 50, height: 50, texture: makeSvgUri(vinylSvg) },
  { name: 'star', width: 36, height: 36, texture: makeSvgUri(starSvg) },
  { name: 'book', width: 40, height: 50, texture: makeSvgUri(bookSvg) },
  { name: 'clock', width: 40, height: 40, texture: makeSvgUri(clockSvg) },
  { name: 'note', width: 30, height: 36, texture: makeSvgUri(noteSvg) },
  { name: 'cloud', width: 50, height: 35, texture: makeSvgUri(cloudSvg) },
  { name: 'heart', width: 36, height: 34, texture: makeSvgUri(heartSvg) },
  { name: 'cat', width: 40, height: 40, texture: makeSvgUri(catSvg) },
  { name: 'lamp', width: 36, height: 50, texture: makeSvgUri(lampSvg) },
  { name: 'pizza', width: 40, height: 40, texture: makeSvgUri(pizzaSvg) },
  { name: 'rocket', width: 30, height: 50, texture: makeSvgUri(rocketSvg) },
  { name: 'diamond', width: 36, height: 40, texture: makeSvgUri(diamondSvg) },
  { name: 'floppy', width: 44, height: 44, texture: makeSvgUri(floppySvg) },
  { name: 'coffeeBean', width: 30, height: 36, texture: makeSvgUri(coffeeBeanSvg) },
  { name: 'joystick', width: 40, height: 50, texture: makeSvgUri(joystickSvg) },
  { name: 'speaker', width: 40, height: 50, texture: makeSvgUri(speakerSvg) },
  { name: 'pencil', width: 14, height: 50, texture: makeSvgUri(pencilSvg) },
];

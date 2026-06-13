import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const VIBE_QUOTES = [
  "Remember to hydrate, friend.",
  "One line of code at a time.",
  "Your aesthetic is immaculate today.",
  "Take a deep breath. You got this.",
  "The bugs fear your vibe.",
  "Don't forget to blink.",
  "Is your posture good right now?",
  "Chill beats, clean code.",
  "You're doing great.",
  "Everything is falling into place.",
  "Vibe check: Passed.",
  "Drink some water, save your code."
];

const PixelCat = () => (
  <svg width="64" height="64" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_8px_rgba(139,147,167,0.4)]">
    {/* Body */}
    <rect x="3" y="6" width="10" height="10" fill="currentColor" />
    {/* Ears */}
    <rect x="3" y="4" width="2" height="2" fill="currentColor" />
    <rect x="11" y="4" width="2" height="2" fill="currentColor" />
    <rect x="4" y="3" width="1" height="1" fill="currentColor" />
    <rect x="11" y="3" width="1" height="1" fill="currentColor" />
    {/* Eyes */}
    <rect x="4.5" y="8" width="2" height="2" fill="var(--color-ink, #0B0E14)" />
    <rect x="9.5" y="8" width="2" height="2" fill="var(--color-ink, #0B0E14)" />
    {/* Nose */}
    <rect x="7.5" y="10" width="1" height="1" fill="var(--color-ember, #E8606B)" />
    {/* Tail */}
    <rect x="13" y="11" width="2" height="2" fill="currentColor" />
    <rect x="14" y="9" width="1" height="2" fill="currentColor" />
  </svg>
);

export default function VibePet() {
  const [isVisible, setIsVisible] = useState(false);
  const [quote, setQuote] = useState("");

  useEffect(() => {
    let timeout;
    
    // Show up exactly after 5 seconds on load
    const initialDelay = 5000;

    const showPet = () => {
      setQuote(VIBE_QUOTES[Math.floor(Math.random() * VIBE_QUOTES.length)]);
      setIsVisible(true);

      // Hide after 6 to 10 seconds
      setTimeout(() => {
        setIsVisible(false);
        scheduleNext();
      }, Math.random() * 4000 + 6000);
    };

    const scheduleNext = () => {
      // Come back every 3 to 10 minutes
      const nextDelay = Math.random() * 420000 + 180000;
      timeout = setTimeout(showPet, nextDelay);
    };

    timeout = setTimeout(showPet, initialDelay);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="fixed bottom-0 right-4 md:right-16 z-[100] pointer-events-none flex flex-col items-end">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
            className="mb-2 bg-dusk/90 backdrop-blur-md border border-haze/20 px-4 py-3 rounded-2xl rounded-br-sm shadow-[0_4px_20px_rgba(0,0,0,0.4)] max-w-[200px]"
          >
            <p className="font-mono text-xs text-lamp leading-relaxed">{quote}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ y: 100 }}
        animate={{ y: isVisible ? 0 : 100 }}
        transition={{ type: "spring", stiffness: 120, damping: 15 }}
        className="text-haze hover:text-lamp transition-colors pointer-events-auto cursor-pointer"
        onClick={() => {
          // If clicked while visible, it can say another thing or hide
          if (isVisible) {
            setQuote(VIBE_QUOTES[Math.floor(Math.random() * VIBE_QUOTES.length)]);
          }
        }}
      >
        <PixelCat />
      </motion.div>
    </div>
  );
}

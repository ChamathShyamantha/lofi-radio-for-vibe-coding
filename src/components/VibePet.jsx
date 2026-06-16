import { useState, useEffect, useRef, useCallback } from 'react';
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
  "Drink some water, save your code.",
  "meow.",
  "zzzZZZ...",
  "*purrs in lofi*",
  "I caught a bug for you!",
  "Ship it! 🚀",
];

const PixelCat = ({ flipped }) => (
  <svg
    width="64"
    height="64"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="drop-shadow-[0_0_8px_rgba(139,147,167,0.4)]"
    style={{ transform: flipped ? 'scaleX(-1)' : 'none' }}
  >
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

/* Running cat with legs animated via CSS */
const RunningCat = ({ flipped }) => (
  <svg
    width="64"
    height="64"
    viewBox="0 0 18 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="drop-shadow-[0_0_8px_rgba(139,147,167,0.4)]"
    style={{ transform: flipped ? 'scaleX(-1)' : 'none' }}
  >
    {/* Body - slightly stretched for running */}
    <rect x="2" y="5" width="12" height="7" fill="currentColor" />
    {/* Head */}
    <rect x="12" y="3" width="5" height="6" fill="currentColor" />
    {/* Ears */}
    <rect x="13" y="1" width="2" height="2" fill="currentColor" />
    <rect x="16" y="1" width="1" height="2" fill="currentColor" />
    {/* Eyes */}
    <rect x="14" y="5" width="1.5" height="1.5" fill="var(--color-ink, #0B0E14)" />
    {/* Nose */}
    <rect x="16" y="7" width="1" height="1" fill="var(--color-ember, #E8606B)" />
    {/* Front legs - animated */}
    <rect x="10" y="12" width="2" height="3" fill="currentColor" className="animate-leg-front" />
    <rect x="7" y="12" width="2" height="3" fill="currentColor" className="animate-leg-back" />
    {/* Back legs - animated */}
    <rect x="3" y="12" width="2" height="3" fill="currentColor" className="animate-leg-front" />
    <rect x="0" y="12" width="2" height="3" fill="currentColor" className="animate-leg-back" />
    {/* Tail - up */}
    <rect x="0" y="4" width="2" height="2" fill="currentColor" />
    <rect x="-1" y="2" width="2" height="3" fill="currentColor" />
  </svg>
);

export default function VibePet() {
  const [isVisible, setIsVisible] = useState(false);
  const [quote, setQuote] = useState("");
  const [isDashing, setIsDashing] = useState(false);
  const [dashDirection, setDashDirection] = useState('left-to-right');
  const dashTimeoutRef = useRef(null);
  const quoteTimeoutRef = useRef(null);
  const hideTimeoutRef = useRef(null);

  // Expose feedPet globally
  useEffect(() => {
    window.driftFM = window.driftFM || {};
    window.driftFM.feedPet = () => {
      setQuote("*munch munch* thank you!");
      setIsVisible(true);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = setTimeout(() => setIsVisible(false), 4000);
    };
  }, []);

  // ─── Quote popup cycle ──────────────────────────────────────────────
  useEffect(() => {
    const showPet = () => {
      setQuote(VIBE_QUOTES[Math.floor(Math.random() * VIBE_QUOTES.length)]);
      setIsVisible(true);

      // Hide after 6 to 10 seconds
      hideTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
        scheduleNextQuote();
      }, Math.random() * 4000 + 6000);
    };

    const scheduleNextQuote = () => {
      // Come back every 3 to 10 minutes
      const nextDelay = Math.random() * 420000 + 180000;
      quoteTimeoutRef.current = setTimeout(showPet, nextDelay);
    };

    // Show up after 5 seconds on load
    quoteTimeoutRef.current = setTimeout(showPet, 5000);

    return () => {
      if (quoteTimeoutRef.current) clearTimeout(quoteTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  // ─── Dash across screen cycle ───────────────────────────────────────
  const startDash = useCallback(() => {
    // Don't dash if the quote popup is active
    if (isVisible) {
      scheduleDash();
      return;
    }

    const dir = Math.random() > 0.5 ? 'left-to-right' : 'right-to-left';
    setDashDirection(dir);
    setIsDashing(true);

    // Dash lasts 3-4 seconds
    const dashDuration = 3000 + Math.random() * 1000;
    setTimeout(() => {
      setIsDashing(false);
      scheduleDash();
    }, dashDuration);
  }, [isVisible]);

  const scheduleDash = useCallback(() => {
    // Dash every 2 to 5 minutes
    const nextDelay = 120000 + Math.random() * 180000;
    dashTimeoutRef.current = setTimeout(() => startDash(), nextDelay);
  }, [startDash]);

  useEffect(() => {
    // First dash after 30-60 seconds
    const initialDelay = 30000 + Math.random() * 30000;
    dashTimeoutRef.current = setTimeout(() => startDash(), initialDelay);

    return () => {
      if (dashTimeoutRef.current) clearTimeout(dashTimeoutRef.current);
    };
  }, [startDash]);

  return (
    <>
      {/* ─── Dash animation ─────────────────────────────────────────── */}
      <AnimatePresence>
        {isDashing && (
          <motion.div
            className="fixed bottom-0 z-[99] pointer-events-none text-haze"
            initial={{
              x: dashDirection === 'left-to-right' ? '-80px' : 'calc(100vw + 80px)',
              y: 0,
            }}
            animate={{
              x: dashDirection === 'left-to-right' ? 'calc(100vw + 80px)' : '-80px',
              y: [0, -12, 0, -8, 0, -12, 0, -8, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{
              x: { duration: 3.5, ease: 'linear' },
              y: { duration: 0.4, repeat: Infinity, ease: 'easeInOut' },
            }}
          >
            <RunningCat flipped={dashDirection === 'right-to-left'} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Stationary quote popup ─────────────────────────────────── */}
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
            if (isVisible) {
              setQuote(VIBE_QUOTES[Math.floor(Math.random() * VIBE_QUOTES.length)]);
            }
          }}
        >
          <PixelCat />
        </motion.div>
      </div>
    </>
  );
}

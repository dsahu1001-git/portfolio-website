'use client';

import { ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const HERO_THRESHOLD = 420;

export function ScrollSignal() {
  const pathname = usePathname();
  const [showCue, setShowCue] = useState(true);

  useEffect(() => {
    function updateScrollSignal() {
      setShowCue(window.scrollY < HERO_THRESHOLD);
    }

    updateScrollSignal();
    window.addEventListener('scroll', updateScrollSignal, { passive: true });
    window.addEventListener('resize', updateScrollSignal);

    return () => {
      window.removeEventListener('scroll', updateScrollSignal);
      window.removeEventListener('resize', updateScrollSignal);
    };
  }, []);

  function scrollPastHero() {
    window.scrollTo({
      behavior: 'smooth',
      top: Math.min(window.innerHeight - 64, 720),
    });
  }

  if (pathname !== '/') {
    return null;
  }

  return (
    <button
      aria-label="Scroll to explore"
      className={`scroll-cue fixed bottom-5 left-1/2 z-30 -translate-x-1/2 transition-all duration-500 ${
        showCue
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-4 opacity-0'
      }`}
      onClick={scrollPastHero}
      type="button"
    >
      <span className="font-mono text-[9px] uppercase text-cyan-100">
        Scroll_to_explore
      </span>
      <ChevronDown
        className="scroll-cue-arrow h-4 w-4 text-primary"
        aria-hidden="true"
      />
    </button>
  );
}

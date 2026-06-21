'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggle = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', toggle, { passive: true });
    return () => window.removeEventListener('scroll', toggle);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className={cn(
        'liquid-card fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full border p-0 transition-opacity duration-300',
        visible ? 'cursor-pointer opacity-100' : 'pointer-events-none opacity-0',
      )}
    >
      <svg
        className="h-5 w-5 text-primary"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 15l7-7 7 7"
        />
      </svg>
    </button>
  );
}
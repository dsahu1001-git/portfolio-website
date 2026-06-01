'use client';

import { useEffect, useState } from 'react';

const SAMPLE_INTERVAL = 1200;

export function LiveSystemStatus() {
  const [latency, setLatency] = useState<number | null>(null);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    function sampleLatency() {
      const startedAt = performance.now();

      timeoutId = setTimeout(() => {
        setLatency(
          Math.max(
            1,
            Math.round(performance.now() - startedAt - SAMPLE_INTERVAL),
          ),
        );
        sampleLatency();
      }, SAMPLE_INTERVAL);
    }

    sampleLatency();

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <span
      aria-label="Interface system status"
      className="mr-2 hidden items-center gap-2 font-mono text-[9px] uppercase text-muted-foreground lg:flex"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_#00f5ff]" />
      UI_node: active
      <span className="text-primary/70">|</span>
      latency: {latency ?? '--'}ms
    </span>
  );
}

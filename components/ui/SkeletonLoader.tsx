'use client';

import { cn } from '@/lib/utils';

type SkeletonVariant = 'text' | 'text-multi' | 'card' | 'circle' | 'image';

interface SkeletonLoaderProps {
  variant?: SkeletonVariant;
  lines?: number;
  className?: string;
}

const shimmer =
  'bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer';

export function SkeletonLoader({
  variant = 'text',
  lines = 3,
  className,
}: SkeletonLoaderProps) {
  if (variant === 'text') {
    return (
      <div
        className={cn(
          'h-4 w-full rounded bg-white/5',
          shimmer,
          className,
        )}
        role="status"
        aria-label="Loading content"
      />
    );
  }

  if (variant === 'text-multi') {
    return (
      <div className={cn('space-y-3', className)} role="status" aria-label="Loading content">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-4 rounded bg-white/5',
              shimmer,
              i === lines - 1 ? 'w-3/4' : 'w-full',
            )}
          />
        ))}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div
        className={cn(
          'liquid-card rounded-xl p-6 space-y-4',
          className,
        )}
        role="status"
        aria-label="Loading card"
      >
        <div className="h-4 w-1/3 rounded bg-white/5" />
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-3 rounded bg-white/5',
                shimmer,
                i === 2 ? 'w-2/3' : 'w-full',
              )}
            />
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'circle') {
    return (
      <div
        className={cn(
          'h-12 w-12 rounded-full bg-white/5',
          shimmer,
          className,
        )}
        role="status"
        aria-label="Loading avatar"
      />
    );
  }

  if (variant === 'image') {
    return (
      <div
        className={cn(
          'aspect-video w-full rounded-lg bg-white/5',
          shimmer,
          className,
        )}
        role="status"
        aria-label="Loading image"
      />
    );
  }

  return null;
}
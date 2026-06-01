'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import type { CSSProperties } from 'react';
import { BlogCard } from '@/components/blog/BlogCard';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { BlogPost } from '@/types/blog';

interface BlogCarouselProps {
  posts: BlogPost[];
}

export function BlogCarousel({ posts }: BlogCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  function selectPost(index: number) {
    setActiveIndex(Math.min(Math.max(index, 0), posts.length - 1));
  }

  if (posts.length === 0) {
    return <p className="text-muted-foreground">No posts published yet.</p>;
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="font-mono text-[10px] uppercase text-muted-foreground">
          {String(activeIndex + 1).padStart(2, '0')} /{' '}
          {String(posts.length).padStart(2, '0')}
        </p>
        <div className="flex gap-2">
          <Button
            aria-label="Previous featured article"
            className="h-9 w-9 px-0"
            disabled={activeIndex === 0}
            onClick={() => selectPost(activeIndex - 1)}
            type="button"
            variant="outline"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button
            aria-label="Next featured article"
            className="h-9 w-9 px-0"
            disabled={activeIndex === posts.length - 1}
            onClick={() => selectPost(activeIndex + 1)}
            type="button"
            variant="outline"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
      <div
        aria-label="Featured articles"
        className="featured-stack mx-auto"
        role="region"
      >
        {posts.map((post, index) => {
          const offset = index - activeIndex;
          const stackPosition =
            offset === 0 ? 'active' : offset < 0 ? 'before' : 'after';

          return (
            <div
              aria-label={
                offset === 0
                  ? `Current featured article: ${post.title}`
                  : `Bring featured article to front: ${post.title}`
              }
              className={cn(
                'featured-stack-card',
                `featured-stack-card--${stackPosition}`,
              )}
              data-active={offset === 0}
              key={post.slug}
              onClick={() => selectPost(index)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  selectPost(index);
                }
              }}
              role={offset === 0 ? undefined : 'button'}
              style={
                {
                  '--stack-depth': Math.min(Math.abs(offset), 2),
                } as CSSProperties
              }
              tabIndex={offset === 0 ? -1 : 0}
            >
              <span className="featured-stack-depth font-mono text-[9px] uppercase text-cyan-100/70">
                Signal {String(index + 1).padStart(2, '0')}
              </span>
            <BlogCard post={post} />
          </div>
          );
        })}
      </div>
    </div>
  );
}

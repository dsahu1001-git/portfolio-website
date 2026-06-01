'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState } from 'react';
import { BlogCard } from '@/components/blog/BlogCard';
import { Button } from '@/components/ui/Button';
import type { BlogPost } from '@/types/blog';

interface BlogCarouselProps {
  posts: BlogPost[];
}

export function BlogCarousel({ posts }: BlogCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  function scrollTo(index: number) {
    const nextIndex = Math.min(Math.max(index, 0), posts.length - 1);
    const scroller = scrollerRef.current;
    const card = scroller?.children.item(nextIndex);

    if (!(card instanceof HTMLElement)) {
      return;
    }

    card.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start',
    });
    setActiveIndex(nextIndex);
  }

  function handleScroll() {
    const scroller = scrollerRef.current;

    if (!scroller) {
      return;
    }

    const cards = Array.from(scroller.children);
    const nearestIndex = cards.reduce((closestIndex, card, index) => {
      const closestCard = cards[closestIndex];
      const closestDistance = Math.abs(
        closestCard.getBoundingClientRect().left -
          scroller.getBoundingClientRect().left,
      );
      const distance = Math.abs(
        card.getBoundingClientRect().left -
          scroller.getBoundingClientRect().left,
      );

      return distance < closestDistance ? index : closestIndex;
    }, 0);

    setActiveIndex(nearestIndex);
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
            onClick={() => scrollTo(activeIndex - 1)}
            type="button"
            variant="outline"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button
            aria-label="Next featured article"
            className="h-9 w-9 px-0"
            disabled={activeIndex === posts.length - 1}
            onClick={() => scrollTo(activeIndex + 1)}
            type="button"
            variant="outline"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
      <div
        className="grid snap-x snap-mandatory auto-cols-[88%] grid-flow-col gap-4 overflow-x-auto pb-3 sm:auto-cols-[64%] lg:auto-cols-[46%]"
        onScroll={handleScroll}
        ref={scrollerRef}
      >
        {posts.map((post) => (
          <div className="snap-start" key={post.slug}>
            <BlogCard post={post} />
          </div>
        ))}
      </div>
    </div>
  );
}

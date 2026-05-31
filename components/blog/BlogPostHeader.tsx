import { format } from 'date-fns';
import Image from 'next/image';
import { Badge } from '@/components/ui/Badge';
import type { BlogPost } from '@/types/blog';

interface BlogPostHeaderProps {
  post: BlogPost;
}

export function BlogPostHeader({ post }: BlogPostHeaderProps) {
  return (
    <header className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Badge>{post.category}</Badge>
      <h1 className="mt-5 font-heading text-4xl font-bold tracking-tight sm:text-5xl">
        {post.title}
      </h1>
      <p className="mt-4 text-lg leading-8 text-muted-foreground">
        {post.description}
      </p>
      <div className="mt-6 flex flex-wrap gap-3 text-sm text-muted-foreground">
        <span>{format(new Date(post.publishedAt), 'MMM d, yyyy')}</span>
        <span>{post.readingTime}</span>
        <span>By {post.author}</span>
      </div>
      {post.heroImage ? (
        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-xl border border-border bg-muted">
          <Image
            alt={post.heroImageAlt ?? ''}
            className="object-cover"
            fill
            priority
            sizes="(min-width: 768px) 768px, 100vw"
            src={post.heroImage}
          />
        </div>
      ) : null}
    </header>
  );
}

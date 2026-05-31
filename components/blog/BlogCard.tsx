import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import type { BlogPost } from '@/types/blog';

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Card className="group h-full overflow-hidden hover:border-primary hover:shadow-signal">
      {post.heroImage ? (
        <Link
          className="relative block aspect-[16/9] overflow-hidden bg-muted"
          href={`/blog/${post.slug}`}
        >
          <Image
            alt={post.heroImageAlt ?? ''}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            src={post.heroImage}
          />
        </Link>
      ) : null}
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{post.category}</Badge>
          <span className="text-xs text-muted-foreground">
            {format(new Date(post.publishedAt), 'MMM d, yyyy')}
          </span>
        </div>
        <h2 className="mt-4 font-heading text-2xl font-bold">
          <Link className="hover:text-primary" href={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </h2>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-muted-foreground">
          {post.description}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {post.tags.slice(0, 3).map((tag) => (
            <Link
              className="text-xs text-primary hover:underline"
              href={`/blog/tag/${tag}`}
              key={tag}
            >
              #{tag}
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

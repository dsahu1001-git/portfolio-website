import {
  Activity,
  Boxes,
  Gauge,
  GitBranch,
  Network,
  RadioTower,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BlogPost } from '@/types/blog';

interface BlogPreviewVisualProps {
  className?: string;
  post: BlogPost;
}

function getPreview(post: BlogPost) {
  if (post.tags.includes('cicd')) {
    return {
      eyebrow: 'CI/CD / GitOps',
      title: 'Modern delivery systems',
      icon: GitBranch,
      nodes: [GitBranch, Boxes, Activity],
      accent: 'text-primary',
    };
  }

  if (post.tags.includes('observability')) {
    return {
      eyebrow: 'Telemetry / Leadership',
      title: 'Observability migration',
      icon: RadioTower,
      nodes: [Activity, Gauge, ShieldCheck],
      accent: 'text-amber-400',
    };
  }

  return {
    eyebrow: 'Architecture / Performance',
    title: 'Static-first systems',
    icon: Boxes,
    nodes: [Network, ShieldCheck, Activity],
    accent: 'text-primary',
  };
}

export function BlogPreviewVisual({ className, post }: BlogPreviewVisualProps) {
  const preview = getPreview(post);
  const Icon = preview.icon;

  return (
    <div
      className={cn(
        'systems-grid flex h-full min-h-48 flex-col justify-between bg-[#07111f] p-5',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={cn('font-mono text-[10px] uppercase', preview.accent)}>
            {preview.eyebrow}
          </p>
          <p className="mt-2 font-heading text-xl font-bold text-slate-100">
            {preview.title}
          </p>
        </div>
        <Icon className={cn('h-7 w-7', preview.accent)} aria-hidden="true" />
      </div>
      <div className="mt-8 grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2">
        {preview.nodes.map((Node, index) => (
          <div className="contents" key={index}>
            <div className="flex min-h-14 items-center justify-center border border-border bg-background/65">
              <Node className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            {index < preview.nodes.length - 1 ? (
              <span className="h-px w-3 bg-primary" />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

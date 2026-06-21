import { SkeletonLoader } from '@/components/ui/SkeletonLoader';

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <div className="space-y-2">
          <SkeletonLoader variant="text" className="h-3 w-24" />
          <SkeletonLoader variant="text" className="h-10 w-2/3" />
          <SkeletonLoader variant="text-multi" lines={2} />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonLoader key={i} variant="card" />
          ))}
        </div>
      </div>
    </div>
  );
}
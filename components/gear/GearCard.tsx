import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import type { GearProduct } from '@/types/gear';

interface GearCardProps {
  category: string;
  product: GearProduct;
}

export function GearCard({ category, product }: GearCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-[4/3] bg-muted">
        <Image
          alt={product.name}
          className="object-cover"
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          src={product.image}
        />
      </div>
      <CardContent>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-heading text-xl font-bold">{product.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {product.price}
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-amber-600">
            <Star className="h-4 w-4 fill-current" aria-hidden="true" />
            {product.rating}
          </span>
        </div>
        <Link
          className="mt-5 inline-flex text-sm font-semibold text-primary hover:underline"
          href={`/api/affiliate?category=${category}&product=${encodeURIComponent(product.name)}&url=${encodeURIComponent(product.affiliateUrl)}`}
        >
          View recommendation
        </Link>
      </CardContent>
    </Card>
  );
}

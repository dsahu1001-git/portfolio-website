import type { GearProduct } from '@/types/gear';

interface GearComparisonProps {
  products: GearProduct[];
}

export function GearComparison({ products }: GearComparisonProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="p-4">Product</th>
            <th className="p-4">Price</th>
            <th className="p-4">Rating</th>
            <th className="p-4">Best for</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr className="border-t border-border" key={product.name}>
              <td className="p-4 font-medium">{product.name}</td>
              <td className="p-4">{product.price}</td>
              <td className="p-4">{product.rating}/5</td>
              <td className="p-4 text-muted-foreground">
                {product.pros.slice(0, 2).join(', ')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

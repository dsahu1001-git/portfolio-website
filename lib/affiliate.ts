export interface AffiliateClick {
  product: string;
  category: string;
  url: string;
}

export function buildAffiliateRedirect({
  product,
  category,
  url,
}: AffiliateClick) {
  const searchParams = new URLSearchParams({ product, category, url });
  return `/api/affiliate?${searchParams.toString()}`;
}

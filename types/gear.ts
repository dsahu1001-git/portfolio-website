export interface GearProduct {
  name: string;
  price: string;
  affiliateUrl: string;
  image: string;
  rating: number;
  pros: string[];
  cons: string[];
}

export interface GearGuide {
  slug: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  updatedAt?: string;
  products: GearProduct[];
  content: string;
}

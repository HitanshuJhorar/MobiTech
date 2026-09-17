export interface ApiCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface ApiProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: { _id: string; name: string; slug: string } | string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  isNewArrival: boolean;
  isFeatured: boolean;
  isTrending: boolean;
  isBestSeller: boolean;
  inStock: boolean;
  stockQuantity: number;
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  inStock?: boolean;
  isNew?: boolean;
  description?: string;
}

export const mapApiProductToUI = (p: ApiProduct): Product => {
  let catName = 'Accessories';
  if (typeof p.category === 'object' && p.category !== null && 'name' in p.category) {
    catName = p.category.name;
  }
  
  return {
    id: p._id,
    name: p.name,
    category: catName,
    price: p.price,
    image: p.images && p.images.length > 0 ? p.images[0] : '/images/placeholder.svg',
    inStock: p.inStock,
    isNew: p.isNewArrival,
    description: p.description,
  };
};

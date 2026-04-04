interface SearchParams {
  search?: string;
  limit?: number;
  categoryId?: number;
  storeId?: number;
  brandName?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

interface SearchProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  newPrice: number | null;
  images: string[];
  brandName: string | null;
  stockCount: number;
  createdAt: string;
  category: { id: number; name: string };
  store: { id: number; name: string; rating?: number };
}

interface SearchResult {
  products: SearchProduct[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

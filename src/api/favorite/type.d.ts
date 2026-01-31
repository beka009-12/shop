interface Category {
  id: number;
  name: string;
  parentId?: number | null;
  parent?: Category | null;
  children?: Category[];
  createdAt: string;
  updatedAt: string;
}

interface Store {
  id: number;
  name: string;
  logo?: string | null;
  isVerified: boolean;
  rating?: number | null;
}

interface IProduct {
  id: number;
  storeId: number;
  categoryId: number;
  brandName?: string | null;
  title: string;
  description: string;
  images: string[];
  price: number;
  oldPrice?: number | null;
  stockCount: number;
  tags: string[];
  isActive: boolean;
  archivedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  category: Category;
  store?: Store; // ✅ Добавили store
}

namespace FavoriteAPI {
  type CardProduct = {
    id: number;
    title: string;
    description: string;
    price: number;
    oldPrice?: number | null;
    images: string[];
    brandName?: string | null;
    createdAt: string;
    category: Category;
    categoryId: number;
  };

  type FavoriteRes = {
    id: number;
    userId: number;
    productId: number;
    product: CardProduct;
  };

  type FavoriteReq = {
    productId: number;
    userId: number;
  };

  type GetFavoritesRes = {
    message: string;
    favorites: FavoriteRes[];
  };

  type useDeleteFavoriteRes = {
    message: string;
    favorite: FavoriteRes;
  };

  type useDeleteFavoriteReq = {
    productId: number;
  };
}

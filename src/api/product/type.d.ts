// types/product.types.ts

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

namespace ProductAPI {
  type useGetProductForUserRes = {
    products: IProduct[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
  type useGetProductForUserReq = void;

  type useGetProductByIdRes = IProduct; // ✅ Просто продукт, не обёрнутый
  type useGetProductByIdReq = { id: number };
}

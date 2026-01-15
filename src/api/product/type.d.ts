interface Category {
  id: number;
  name: string;
  parentId?: number | null;
  parent?: Category | null;
  children?: Category[];
  createdAt: string;
  updatedAt: string;
}

interface Brand {
  id: number;
  name: string;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface IProduct {
  id: number;
  shopId: number;
  categoryId?: number;
  brandId?: number;
  title?: string;
  description?: string;
  images?: string[];
  sizes?: number[] | string[];
  colors?: string[];
  price?: number;
  newPrice?: number;
  sale?: boolean;
  rating?: number;
  reviews?: number;
  store: {
    id: number;
    name: string;
    logo?: string;
  };
  category?: Category;
  brand?: Brand;
  favorites?: { userId: number }[];
  tags?: string[];
  stockCount?: number;
  createdAt?: string;

  isArchived?: boolean;
  archivedAt?: string | null;
}

namespace ProductAPI {
  type useGetProductForUserRes = IProduct[];
  type useGetProductForUserReq = void;

  type useGetProductByIdRes = IProduct;
  type useGetProductByIdReq = { id: number };

  type useGetBrandByIdRes = {
    id: number;
    name: string;
    logoUrl?: string;
    createdAt: string;
    updatedAt: string;
  };
  type useGetBrandByIdReq = {
    id: number;
  };
}

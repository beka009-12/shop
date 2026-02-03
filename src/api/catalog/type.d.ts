interface CategoryItem {
  id: number;
  name: string;
  parentId: number | null;
  parent?: {
    id: number;
    name: string;
    parentId: number | null;
  } | null;
  children: CategoryItem[]; // рекурсивно
  _count?: {
    products: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface GetCategories {
  categories: CategoryItem[];
}

namespace CatalogAPI {
  type GetCategoriesReq = {};

  type GetCategoriesRes = {
    categories: CategoryItem[];
  };

  type GetCategoriesTreeReq = {};

  type GetCategoriesTreeRes = {
    categories: CategoryItem[];
  };
}

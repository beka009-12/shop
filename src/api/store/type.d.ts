interface Store {
  id: number;
  name: string;
  description: string | null;
  logo: string | null;
  address: string | null;
  region: string | null;
  isVerified: boolean;
  isActive: boolean;
  rating: number | null;
  ownerId: number;
  createdAt: string;
  updatedAt: string;
}

interface StoreListItem extends Store {
  _count: {
    products: number;
  };
}

// ? NAMESPACE
namespace StoreAPI {
  type GetStoresResponse = {
    stores: StoreListItem[];
    total: number;
    totalPages: number;
    currentPage: number;
  };

  type GetStoresRequest = {
    search?: string;
    region?: string;
    isVerified?: boolean;
    sortBy?: "name" | "rating" | "createdAt";
    order?: "asc" | "desc";
    page?: number;
    limit?: number;
  };
}

namespace FavoriteAPI {
  type FavoriteRes = {
    id: number;
    userId: number;
    productId: number;
  };

  type FavoriteReq = {
    productId: number;
    userId: number;
  };

  type FavoriteRes = {
    id: number;
    userId: number;
    productId: number;
  };

  type getFavoritesRes = {
    message: string;
    favorites: FavoriteRes[];
  };
}

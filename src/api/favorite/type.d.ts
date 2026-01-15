namespace FavoriteAPI {
  type sendFavoriteReq = {
    id: number;
    userId: number;
    productId: number;
  };
  type sendFavoriteRes = {
    success: boolean;
    message: string;
  };

  
}

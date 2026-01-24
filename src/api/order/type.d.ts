namespace ORDER {
  type CreateOrderRes = {
    id: number;
    userId: number;
    total: number;
    status: "PENDING" | "PAID" | "SHIPPED" | "COMPLETED" | "CANCELED";
    items: {
      productId: number;
      quantity?: number;
      price: number;
    }[];
    deliveryName: string;
    deliveryPhone: string;
    deliveryAddress: string;
    createdAt: string;
    updatedAt: string;
  };

  type CreateOrderReq = {
    userId: number;
    items: {
      productId: number;
      quantity?: number;
    }[];
    deliveryName: string;
    deliveryPhone: string;
    deliveryAddress: string;
  };

  type CartItemRes = {
    id: number;
    userId: number;
    quantity?: number;
    product: {
      id: number;
      title: string;
      price: number;
      oldPrice?: number;
      images: string[];
      brandName?: string;
    };
    createdAt: string;
  };

  type DeleteAllOrderRes = {
    message: string;
  };

  type DeleteAllOrderReq = {
    userId: number;
  };
}

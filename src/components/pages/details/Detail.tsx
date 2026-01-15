"use client";
import { useState, useEffect, type FC } from "react";
import { useParams } from "next/navigation";
import { useGetBrandById, useGetProductById } from "@/api/product";
import scss from "./Detail.module.scss";
import Loader from "@/utils/loader/Loader";
import { CartBtn } from "@/utils/ui/GlobalBtn/Btn";
import { useDeleteFavorite, useToggleFavorite } from "@/api/favorite";
import { useGetMe } from "@/api/user";
import toast from "react-hot-toast";

const Detail: FC = () => {
  const { id } = useParams();

  const { data: product, isPending } = useGetProductById(Number(id));
  const { data: brand } = useGetBrandById(product?.brandId);
  const { data: me } = useGetMe();
  console.log(product);

  const { mutateAsync: addFavorite } = useToggleFavorite();
  const { mutateAsync: removeFavorite } = useDeleteFavorite();

  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  useEffect(() => {
    if (!product || !me) return;

    const fav = product.favorites?.some(
      (f: { userId: number }) => f.userId === me.user.id
    );

    setIsFavorite(Boolean(fav));
  }, [product, me]);

  if (isPending) return <Loader />;
  if (!product) return <div className={scss.notFound}>Продукт не найден</div>;

  const mainImage = activeImage || product.images?.[0];

  // 🔹 Toggle избранного
  const handleToggleFavorite = async () => {
    if (!product || !me) return;

    try {
      if (isFavorite) {
        await removeFavorite({
          userId: me.user.id,
          productId: product.id,
        });

        setIsFavorite(false);
        toast.success("Удалено из избранного");
      } else {
        await addFavorite({
          userId: me.user.id,
          productId: product.id,
        });

        setIsFavorite(true);
        toast.success("Добавлено в избранное");
      }
    } catch {
      toast.error("Ошибка. Попробуйте снова");
    }
  };

  return (
    <section className={scss.detail}>
      <div className={scss.container}>
        <div className={scss.gallery}>
          <div className={scss.thumbnails}>
            {product.images?.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(img)}
                className={`${scss.thumb} ${
                  mainImage === img ? scss.activeThumb : ""
                }`}
              >
                <img src={img} alt="" loading="lazy" />
              </button>
            ))}
          </div>

          <div className={scss.mainImageWrapper}>
            <img src={mainImage} className={scss.mainImage} loading="lazy" />
          </div>
        </div>

        <div className={scss.info}>
          <span className={scss.brandPill}>{brand?.name}</span>
          <h1 className={scss.title}>{product.title}</h1>

          <div className={scss.actions}>
            <CartBtn title="Добавить в корзину" />

            <button
              className={`${scss.favoriteBtn} ${
                isFavorite ? scss.activeFavorite : ""
              }`}
              onClick={handleToggleFavorite}
            >
              {isFavorite ? "В избранном ❤️" : "В избранное 🤍"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Detail;

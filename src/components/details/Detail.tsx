// "use client";
// import { type FC } from "react";
// import scss from "./Detail.module.scss";
// import { useParams } from "next/navigation";

// const Detail: FC = () => {
//   const { id } = useParams();
//   const productId = Number(id);

//   if (isLoading) return <p>Загрузка...</p>;
//   if (isError || !data || data.length === 0) return <p>Товар не найден</p>;

//   const product = data[0];

//   return (
//     <section className={scss.Detail}>
//       <div className="container">
//         <div className={scss.content}>
//           <h2>{product.title}</h2>
//           <p>{product.description}</p>
//           {product.images && product.images.length > 0 && (
//             <img src={product.images[0]} alt={product.title} />
//           )}
//           <p>
//             {product.sale && product.newPrice ? (
//               <>
//                 <span className={scss.oldPrice}>{product.price} сом</span>{" "}
//                 <span className={scss.newPrice}>{product.newPrice} сом</span>
//               </>
//             ) : (
//               <span>{product.price} сом</span>
//             )}
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Detail;

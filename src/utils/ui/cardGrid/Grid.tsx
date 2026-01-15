import { type FC } from "react";
import scss from "./Grid.module.scss";
import Cards from "../cards/Cards";

interface IBaseCard {
  id: number;
  shopId: number;
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
  tags?: string[];
  createdAt?: string;
}

interface GridProps {
  cards?: IBaseCard[];
}

const Grid: FC<GridProps> = ({ cards = [] }) => {
  console.log(cards);

  return (
    <div className={scss.Grid}>
      {cards.map((item) => (
        <Cards key={item.id} {...item} />
      ))}
    </div>
  );
};

export default Grid;

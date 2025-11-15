import { type FC } from "react";
import scss from "./Comments.module.scss";
import Stars from "@/utils/ui/stars/Stars";

const Comments: FC = () => {
  return (
    <div className={scss.Comments}>
      <div className="container">
        <div className={scss.content}>
          <div className={scss.comments}>
            <div className={scss.info}>
              <img
                src="https://img.gazeta.ru/files3/55/15441055/avatar._chelovek-amfibiya2_16629-pic4_zoom-1500x1500-8974.jpg"
                alt="лого"
              />
              <div className={scss.rating}>
                <span>Александр</span>
                <Stars />
              </div>
            </div>

            <p>Отличный товар, очень доволен покупкой! Рекомендую всем!</p>
          </div>
          <div className={scss.comments}>
            <div className={scss.info}>
              <img
                src="https://img.gazeta.ru/files3/55/15441055/avatar._chelovek-amfibiya2_16629-pic4_zoom-1500x1500-8974.jpg"
                alt="лого"
              />
              <div className={scss.rating}>
                <span>Александр</span>
                <Stars />
              </div>
            </div>

            <p>Отличный товар, очень доволен покупкой! Рекомендую всем!</p>
          </div>
          <div className={scss.comments}>
            <div className={scss.info}>
              <img
                src="https://img.gazeta.ru/files3/55/15441055/avatar._chelovek-amfibiya2_16629-pic4_zoom-1500x1500-8974.jpg"
                alt="лого"
              />
              <div className={scss.rating}>
                <span>Александр</span>
                <Stars />
              </div>
            </div>

            <p>Отличный товар, очень доволен покупкой! Рекомендую всем!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comments;

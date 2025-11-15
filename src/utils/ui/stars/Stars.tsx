import { type FC } from "react";
import scss from "./Stars.module.scss";

const Stars: FC = () => {
  return (
    <div className={scss.rating}>
      <input defaultValue={5} name="rating" id="star5" type="radio" />
      <label title="5 stars" htmlFor="star5">
        <svg
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth={2}
          stroke="#000000"
          fill="none"
          viewBox="0 0 24 24"
          height={30}
          width={30}
          xmlns="http://www.w3.org/2000/svg"
          className={scss.svgOne}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        <svg
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth={2}
          stroke="#000000"
          fill="none"
          viewBox="0 0 24 24"
          height={30}
          width={30}
          xmlns="http://www.w3.org/2000/svg"
          className={scss.svgTwo}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        <div className={scss.ombre} />
      </label>
      <input defaultValue={4} name="rating" id="star4" type="radio" />
      <label title="4 stars" htmlFor="star4">
        <svg
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth={2}
          stroke="#000000"
          fill="none"
          viewBox="0 0 24 24"
          height={30}
          width={30}
          xmlns="http://www.w3.org/2000/svg"
          className={scss.svgOne}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        <svg
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth={2}
          stroke="#000000"
          fill="none"
          viewBox="0 0 24 24"
          height={30}
          width={30}
          xmlns="http://www.w3.org/2000/svg"
          className={scss.svgTwo}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        <div className={scss.ombre} />
      </label>
      <input defaultValue={3} name="rating" id="star3" type="radio" />
      <label title="3 stars" htmlFor="star3">
        <svg
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth={2}
          stroke="#000000"
          fill="none"
          viewBox="0 0 24 24"
          height={30}
          width={30}
          xmlns="http://www.w3.org/2000/svg"
          className={scss.svgOne}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        <svg
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth={2}
          stroke="#000000"
          fill="none"
          viewBox="0 0 24 24"
          height={30}
          width={30}
          xmlns="http://www.w3.org/2000/svg"
          className={scss.svgTwo}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        <div className={scss.ombre} />
      </label>
      <input defaultValue={2} name="rating" id="star2" type="radio" />
      <label title="2 stars" htmlFor="star2">
        <svg
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth={2}
          stroke="#000000"
          fill="none"
          viewBox="0 0 24 24"
          height={30}
          width={30}
          xmlns="http://www.w3.org/2000/svg"
          className={scss.svgOne}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        <svg
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth={2}
          stroke="#000000"
          fill="none"
          viewBox="0 0 24 24"
          height={30}
          width={30}
          xmlns="http://www.w3.org/2000/svg"
          className={scss.svgTwo}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        <div className={scss.ombre} />
      </label>
      <input defaultValue={1} name="rating" id="star1" type="radio" />
      <label title="1 star" htmlFor="star1">
        <svg
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth={2}
          stroke="#000000"
          fill="none"
          viewBox="0 0 24 24"
          height={30}
          width={30}
          xmlns="http://www.w3.org/2000/svg"
          className={scss.svgOne}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        <svg
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth={2}
          stroke="#000000"
          fill="none"
          viewBox="0 0 24 24"
          height={30}
          width={30}
          xmlns="http://www.w3.org/2000/svg"
          className={scss.svgTwo}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        <div className={scss.ombre} />
      </label>
    </div>
  );
};

export default Stars;

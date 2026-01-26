"use client";
import { type FC, useState, useEffect, useRef, useCallback } from "react";
import scss from "./Advertising.module.scss";

const IMAGES = [
  { img: "image1", id: 1 },
  { img: "image2", id: 2 },
  { img: "image3", id: 3 },
];

const SLIDE_INTERVAL = 4000;
const TRANSITION_TIME = 400;

const Advertising: FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const imagesLength = IMAGES.length;

  const slides = [...IMAGES, IMAGES[0]];

  const scrollToIndex = useCallback((index: number, smooth = true) => {
    const slider = sliderRef.current;
    if (!slider) return;

    const width = slider.clientWidth;
    slider.scrollTo({
      left: index * width,
      behavior: smooth ? "smooth" : "auto",
    });
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, SLIDE_INTERVAL);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (currentIndex === imagesLength) {
      scrollToIndex(currentIndex);

      const timeout = setTimeout(() => {
        scrollToIndex(0, false);
        setCurrentIndex(0);
      }, TRANSITION_TIME);

      return () => clearTimeout(timeout);
    }

    scrollToIndex(currentIndex);
  }, [currentIndex, imagesLength, scrollToIndex]);

  useEffect(() => {
    const handleResize = () => scrollToIndex(currentIndex, false);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentIndex, scrollToIndex]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  return (
    <section className={scss.Advertising}>
      <div className="container">
        <div className={scss.sliderWrapper}>
          <div className={scss.slider} ref={sliderRef}>
            {slides.map((item, index) => (
              <div key={`${item.id}-${index}`} className={scss.slide}>
                <div className={scss.placeholder}>{item.img}</div>
              </div>
            ))}
          </div>

          <div className={scss.dots}>
            {IMAGES.map((_, index) => (
              <button
                key={index}
                className={`${scss.dot} ${
                  index === currentIndex % imagesLength ? scss.active : ""
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`Перейти к слайду ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Advertising;

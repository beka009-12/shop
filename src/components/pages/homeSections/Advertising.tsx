"use client";
import { type FC, useState, useEffect, useRef, useCallback } from "react";
import scss from "./Advertising.module.scss";

const IMAGES = [
  {
    img: "https://img.freepik.com/free-psd/banner-fashion-store-template_23-2148675207.jpg",
    id: 1,
  },
  {
    img: "https://img.freepik.com/free-psd/fashion-clothes-banner-template_23-2148578502.jpg",
    id: 2,
  },
  {
    img: "https://img.freepik.com/free-vector/fashion-sale-banner-with-photo_52683-15783.jpg?semt=ais_hybrid&w=740&q=80",
    id: 3,
  },
];

const SLIDE_INTERVAL = 4000;
const TRANSITION_TIME = 400;
const SWIPE_THRESHOLD = 50;

const Advertising: FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [prevTranslate, setPrevTranslate] = useState(0);

  const sliderRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

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

  // Автопрокрутка
  const startAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }

    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, SLIDE_INTERVAL);
  }, []);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  }, []);

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [startAutoPlay, stopAutoPlay]);

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

  // Touch Events
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      setIsDragging(true);
      setStartX(e.touches[0].clientX);
      setPrevTranslate(currentIndex * -(sliderRef.current?.clientWidth || 0));
      stopAutoPlay();
    },
    [currentIndex, stopAutoPlay],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging) return;

      const currentX = e.touches[0].clientX;
      const diff = currentX - startX;
      setCurrentTranslate(prevTranslate + diff);
    },
    [isDragging, startX, prevTranslate],
  );

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;

    setIsDragging(false);
    const movedBy = currentTranslate - prevTranslate;

    if (movedBy < -SWIPE_THRESHOLD) {
      setCurrentIndex((prev) => (prev + 1) % (imagesLength + 1));
    } else if (movedBy > SWIPE_THRESHOLD) {
      setCurrentIndex((prev) => {
        if (prev === 0) {
          scrollToIndex(imagesLength, false);
          setTimeout(() => {
            scrollToIndex(imagesLength - 1);
          }, 0);
          return imagesLength - 1;
        }
        return prev - 1;
      });
    } else {
      // Возвращаемся к текущему слайду
      scrollToIndex(currentIndex);
    }

    setCurrentTranslate(0);
    setPrevTranslate(0);

    // Возобновляем автопрокрутку через 2 секунды после свайпа
    setTimeout(() => {
      startAutoPlay();
    }, 2000);
  }, [
    isDragging,
    currentTranslate,
    prevTranslate,
    currentIndex,
    imagesLength,
    scrollToIndex,
    startAutoPlay,
  ]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setIsDragging(true);
      setStartX(e.clientX);
      setPrevTranslate(currentIndex * -(sliderRef.current?.clientWidth || 0));
      stopAutoPlay();
    },
    [currentIndex, stopAutoPlay],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;

      const currentX = e.clientX;
      const diff = currentX - startX;
      setCurrentTranslate(prevTranslate + diff);
    },
    [isDragging, startX, prevTranslate],
  );

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;

    setIsDragging(false);
    const movedBy = currentTranslate - prevTranslate;

    if (movedBy < -SWIPE_THRESHOLD) {
      setCurrentIndex((prev) => (prev + 1) % (imagesLength + 1));
    } else if (movedBy > SWIPE_THRESHOLD) {
      setCurrentIndex((prev) => {
        if (prev === 0) {
          scrollToIndex(imagesLength, false);
          setTimeout(() => {
            scrollToIndex(imagesLength - 1);
          }, 0);
          return imagesLength - 1;
        }
        return prev - 1;
      });
    } else {
      scrollToIndex(currentIndex);
    }

    setCurrentTranslate(0);
    setPrevTranslate(0);

    setTimeout(() => {
      startAutoPlay();
    }, 2000);
  }, [
    isDragging,
    currentTranslate,
    prevTranslate,
    currentIndex,
    imagesLength,
    scrollToIndex,
    startAutoPlay,
  ]);

  const handleMouseLeave = useCallback(() => {
    if (isDragging) {
      handleMouseUp();
    }
  }, [isDragging, handleMouseUp]);

  return (
    <section className={scss.Advertising}>
      <div className="container">
        <div className={scss.sliderWrapper}>
          <div
            className={scss.slider}
            ref={sliderRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            style={{
              cursor: isDragging ? "grabbing" : "grab",
            }}
          >
            {slides.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className={scss.slide}
                style={{
                  userSelect: "none",
                  pointerEvents: isDragging ? "none" : "auto",
                }}
              >
                <img
                  src={item.img}
                  alt={`Рекламный баннер ${index + 1}`}
                  draggable={false}
                />
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

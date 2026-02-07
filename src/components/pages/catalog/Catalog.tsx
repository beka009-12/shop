"use client";
import { type FC, useState, useEffect } from "react";
import scss from "./Catalog.module.scss";
import { useGetCategoriesTree } from "@/api/catalog";

interface Category {
  id: number;
  name: string;
  parentId: number | null;
  children?: Category[];
  _count?: { products: number };
}

interface CatalogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory?: (categoryId: number | null) => void;
}

const Catalog: FC<CatalogProps> = ({ isOpen, onClose, onSelectCategory }) => {
  const { data: categories } = useGetCategoriesTree();
  const [breadcrumbs, setBreadcrumbs] = useState<Category[]>([]);
  const [currentCategories, setCurrentCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (categories && categories.categories.length > 0) {
      setCurrentCategories(categories.categories);
    }
  }, [categories]);

  const handleCategoryClick = (category: Category) => {
    onSelectCategory?.(category.id);

    if (category.children && category.children.length > 0) {
      setBreadcrumbs([...breadcrumbs, category]);
      setCurrentCategories(category.children);
    } else {
      handleClose();
    }
  };

  const handleBack = () => {
    if (breadcrumbs.length === 0) return;

    const newBreadcrumbs = [...breadcrumbs];
    newBreadcrumbs.pop();
    setBreadcrumbs(newBreadcrumbs);

    if (newBreadcrumbs.length === 0) {
      setCurrentCategories(categories?.categories || []);
    } else {
      const previousCategory = newBreadcrumbs[newBreadcrumbs.length - 1];
      setCurrentCategories(previousCategory.children || []);
    }
  };

  const handleClose = () => {
    setBreadcrumbs([]);
    setCurrentCategories(categories?.categories || []);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={scss.overlay} onClick={handleClose} />
      <div className={`${scss.Catalog} ${isOpen ? scss.open : ""}`}>
        <div className={scss.content}>
          <div className={scss.header}>
            {breadcrumbs.length > 0 ? (
              <>
                <button className={scss.backButton} onClick={handleBack}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 19.5 8.25 12l7.5-7.5"
                    />
                  </svg>
                  Назад
                </button>
                <h3>{breadcrumbs[breadcrumbs.length - 1].name}</h3>
              </>
            ) : (
              <h3>Каталог</h3>
            )}
            <button className={scss.closeButton} onClick={handleClose}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className={scss.categories}>
            {currentCategories.map((category) => (
              <div
                key={category.id}
                className={scss.categoryItem}
                onClick={() => handleCategoryClick(category)}
              >
                <span className={scss.categoryName}>{category.name}</span>
                {category.children && category.children.length > 0 && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className={scss.arrow}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m8.25 4.5 7.5 7.5-7.5 7.5"
                    />
                  </svg>
                )}
              </div>
            ))}
          </div>

          {breadcrumbs.length > 0 && (
            <div className={scss.breadcrumbsPath}>
              <span>Главная</span>
              {breadcrumbs.map((crumb, index) => (
                <span key={crumb.id}>
                  {" > "}
                  {crumb.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Catalog;

// components/CategoryList/CategoryList.tsx (Server Component)
import styles from "./categoryList.module.css";
import Link from "next/link";

const colors = [
  "#D6EFFF",
  "#FFD6E8",
  "#D6FFD9",
  "#FFE8D6",
  "#FFF6D6",
  "#E8D6FF",
];

const assignRandomColors = (categories) => {
  return categories.map((item) => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return {
      ...item,
      color: colors[randomIndex],
    };
  });
};

const getData = async () => {
  const res = await fetch(
    "http://localhost:3000/api/categories?page=1&perPage=6",
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  return res.json();
};

const CategoryList = async ({ initialCategories = [] }) => {
  const hasInitial = initialCategories.length > 0;

  let categories = [];

  if (hasInitial) {
    categories = assignRandomColors(initialCategories);
  } else {
    const { categories: fetchedCategories } = await getData();
    categories = assignRandomColors(fetchedCategories);
  }

  if (!categories || categories.length === 0) return null;

  return (
    <div className={styles.container}>
      {initialCategories.length === 0 && (
        <>
          <p className={styles.subtitle}>Discover by topic</p>
          <h2 className={styles.title}>Categories</h2>
        </>
      )}

      <div className={styles.grid}>
        {categories.map((item) => (
          <Link
            href={`/blog?cat=${item.slug}`}
            key={item.id}
            className={styles.card}
            style={{ backgroundColor: item.color }}
          >
            {item.title}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;

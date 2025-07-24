// components/TagList/TagList.tsx (Server Component)
import styles from "./tagList.module.css";
import Link from "next/link";

const colors = [
  "#D6EFFF",
  "#FFD6E8",
  "#D6FFD9",
  "#FFE8D6",
  "#FFF6D6",
  "#E8D6FF",
];

const assignRandomColors = (tags) => {
  return tags.map((tag) => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return {
      ...tag,
      color: colors[randomIndex],
    };
  });
};

const getData = async () => {
  const res = await fetch("http://localhost:3000/api/tags", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch tags");
  }

  return res.json();
};

const TagList = async ({ initialTags = [] }) => {
  const hasInitial = initialTags.length > 0;

  const tags = hasInitial
    ? assignRandomColors(initialTags)
    : assignRandomColors(await getData());

  if (!tags || tags.length === 0) return null;

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {tags.map((item) => (
          <Link
            href={`/blog?tag=${item.name}`}
            key={item.id}
            className={styles.card}
            style={{ backgroundColor: item.color }}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TagList;

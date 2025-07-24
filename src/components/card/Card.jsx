import Image from "next/image";
import styles from "./card.module.css";
import Link from "next/link";

const Card = ({ item }) => {
  return (
    <div className={styles.card}>
      {item.img && (
        <Link href={`/posts/${item.slug}`} className={styles.imageWrapper}>
          <Image
            src={item.img}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={styles.image}
          />
        </Link>
      )}
      <div className={styles.content}>
        <div className={styles.meta}>
          <span className={styles.date}>{item.createdAt.substring(0, 10)}</span>
          <span className={styles.separator}>•</span>
          <span className={styles.category}>{item.catSlug}</span>
        </div>

        <Link href={`/posts/${item.slug}`}>
          <h2 className={styles.title}>{item.title}</h2>
        </Link>

        <div
          className={styles.desc}
          dangerouslySetInnerHTML={{
            __html: item?.desc.substring(0, 100) + "...",
          }}
        />

        <Link href={`/posts/${item.slug}`} className={styles.readMore}>
          Read more →
        </Link>
      </div>
    </div>
  );
};

export default Card;

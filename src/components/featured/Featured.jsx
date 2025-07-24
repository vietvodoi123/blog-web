import React from "react";
import styles from "./featured.module.css";
import Image from "next/image";
import Link from "next/link";

const getFeaturedPost = async () => {
  const res = await fetch(
    `http://localhost:3000/api/posts?page=1&perPage=1&type=featured`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) throw new Error("Lỗi khi lấy bài viết nổi bật");

  const data = await res.json();
  return data.posts[0];
};

const Featured = async () => {
  const post = await getFeaturedPost();

  if (!post) return null;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Hot Topics</h1>
      <p className={styles.subtitle}>
        Explore the most viewed articles recently.
      </p>

      <div className={styles.card}>
        <div className={styles.imageWrapper}>
          <Image
            src={post.img || "/default.jpg"}
            alt={post.title}
            fill
            className={styles.image}
          />
        </div>

        <div className={styles.info}>
          <h2 className={styles.postTitle}>{post.title}</h2>
          <p className={styles.meta}>
            🖋️ {post.user?.name || "Ẩn danh"} · ⏱️{" "}
            {Math.ceil(post.desc.length / 400)} min read
          </p>
          <p className={styles.excerpt}>
            {post.seoDesc || post.desc?.slice(0, 160) + "..."}
          </p>
          <Link href={`/posts/${post.slug}`}>
            <button className={styles.button}>Read more</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Featured;

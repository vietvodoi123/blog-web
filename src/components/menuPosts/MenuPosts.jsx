"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import styles from "./menuPosts.module.css";
import { MessageSquare } from "lucide-react";

const MenuPosts = ({ category = null, type = "latest", withImage = false }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      let url = `/api/posts?perPage=5`;

      if (category) {
        url += `&cat=${category}`;
      }

      if (type === "popular") {
        url += `&sort=views`;
      } else if (type === "commented") {
        url += `&sort=comments`;
      } else {
        url += `&sort=createdAt`; // mặc định: bài mới nhất
      }

      const res = await fetch(url);
      const data = await res.json();
      setPosts(data.posts || []);
    };

    fetchPosts();
  }, [category, type]);

  return (
    <div className={styles.wrapper}>
      {posts.map((post) => (
        <Link
          href={`/posts/${post.slug}`}
          className={styles.postItem}
          key={post.id}
        >
          {withImage && (
            <div className={styles.imageWrapper}>
              <Image
                src={post.img || "/default.jpg"}
                alt={post.title}
                fill
                className={styles.image}
              />
            </div>
          )}
          <div className={styles.content}>
            <h3 className={styles.title}>{post.seoTitle}</h3>
            <p className={styles.desc}>{post.seoDesc?.slice(0, 100)}...</p>
            {post.comments?.length > 0 && (
              <div className={styles.comments}>
                <MessageSquare size={14} /> {post.comments.length}
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default MenuPosts;

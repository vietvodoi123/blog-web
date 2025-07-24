import React from "react";
import styles from "./cardList.module.css";
import Pagination from "../pagination/Pagination";
import Card from "../card/Card";

const getData = async (page, cat, perPage) => {
  const res = await fetch(
    `http://localhost:3000/api/posts?page=${page}&cat=${
      cat || ""
    }&perPage=${perPage}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed");
  }

  return res.json();
};

const CardList = async ({ page, cat, perPage = 10 }) => {
  const { posts, count } = await getData(page, cat, perPage);

  const hasPrev = perPage * (page - 1) > 0;
  const hasNext = perPage * (page - 1) + perPage < count;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Recent Posts</h1>
      <div className={styles.posts}>
        {posts?.map((item) => (
          <Card item={item} key={item._id} />
        ))}
      </div>
      <Pagination page={page} hasPrev={hasPrev} hasNext={hasNext} />
    </div>
  );
};

export default CardList;

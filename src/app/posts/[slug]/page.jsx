import Menu from "@/components/Menu/Menu";
import styles from "./singlePage.module.css";
import Image from "next/image";
import Comments from "@/components/comments/Comments";
import CategoryList from "@/components/categoryList/CategoryList";
import TagList from "@/components/tagList/TagList";

const getData = async (slug) => {
  const res = await fetch(`http://localhost:3000/api/posts/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed");
  }

  return res.json();
};

const SinglePage = async ({ params }) => {
  const { slug } = params;
  const data = await getData(slug);
  return (
    <div className={styles.container}>
      <article className={styles.article}>
        <header className={styles.header}>
          <h1 className={styles.title}>{data?.title}</h1>
          <div className={styles.meta}>
            {data?.user?.image && (
              <Image
                src={data.user.image}
                alt={data?.user?.name || "Tác giả"}
                width={48}
                height={48}
                className={styles.avatar}
              />
            )}
            <div className={styles.metaText}>
              <span className={styles.author}>{data?.user?.name}</span>
              <span className={styles.date}>01.01.2024</span>
            </div>
          </div>
          {data?.img && (
            <div className={styles.coverImage}>
              <Image
                src={data.img}
                alt="Ảnh bài viết"
                width={800}
                height={400}
                className={styles.image}
              />
            </div>
          )}
        </header>

        <section
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: data?.desc }}
        />
        <CategoryList initialCategories={data.categories} />
        <TagList initialTags={data.tags} />
        <section className={styles.comments}>
          <h2 className={styles.commentsTitle}>Bình luận</h2>
          <Comments postSlug={slug} />
        </section>
      </article>

      <aside className={styles.sidebar}>
        <Menu />
      </aside>
    </div>
  );
};

export default SinglePage;

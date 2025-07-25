import Menu from "@/components/Menu/Menu";
import styles from "./singlePage.module.css";
import Image from "next/image";
import Comments from "@/components/comments/Comments";
import CategoryList from "@/components/categoryList/CategoryList";
import TagList from "@/components/tagList/TagList";
import StructuredData from "@/components/seo/StructuredData";

const getData = async (slug) => {
  const res = await fetch(`http://localhost:3000/api/posts/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed");
  }

  return res.json();
};

// singlePage.jsx

// ✅ Phần metadata động
export async function generateMetadata({ params }) {
  const { slug } = params;
  const res = await fetch(`http://localhost:3000/api/posts/${slug}`, {
    cache: "no-store",
  });
  const data = await res.json();

  return {
    title: `${data.title} | ThinkNest`,
    description:
      data.excerpt || data.desc?.slice(0, 160) || "Post from ThinkNest",
    keywords: data.tags?.join(", "),
    openGraph: {
      title: `${data.title} | ThinkNest`,
      description: data.excerpt || data.desc?.slice(0, 160),
      url: `https://thinknest.com/posts/${slug}`,
      siteName: "ThinkNest",
      images: [
        {
          url: data.img || "https://thinknest.com/og-image.jpg",
          width: 1200,
          height: 630,
          alt: data.title,
        },
      ],
      type: "article",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${data.title} | ThinkNest`,
      description: data.excerpt || data.desc?.slice(0, 160),
      images: [data.img || "https://thinknest.com/og-image.jpg"],
    },
  };
}

const SinglePage = async ({ params }) => {
  const { slug } = params;
  const data = await getData(slug);

  return (
    <>
      <StructuredData post={data} />
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
    </>
  );
};

export default SinglePage;

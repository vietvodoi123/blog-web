import CardList from "@/components/cardList/CardList";
import styles from "./blogPage.module.css";
import Menu from "@/components/Menu/Menu";
import StructuredDataList from "@/components/seo/StructuredDataList";

export async function generateMetadata({ searchParams }) {
  const { cat } = searchParams;
  const categoryTitle = cat ? `${cat} Blog` : "Blog";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${categoryTitle} | ThinkNest`,
    description: `Explore articles on this topic of ${cat}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: (await getData(1, cat, 10)).posts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `https://thinknest.com/posts/${post.slug}`,
        name: post.title,
      })),
    },
  };

  return {
    title: `${categoryTitle} | ThinkNest`,
    description: `Explore articles on this topic of ${
      cat || "synthetic"
    } tại ThinkNest.`,
    keywords: [cat, "blog", "posts", "ThinkNest"],
    alternates: {
      canonical: `https://thinknest.com/blog?cat=${cat}`,
    },
    openGraph: {
      title: `${categoryTitle} | ThinkNest`,
      description: `Explore articles on this topic of ${
        cat || "synthetic"
      } tại ThinkNest.`,
      url: `https://thinknest.com/blog?cat=${cat}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${categoryTitle} | ThinkNest`,
      description: `Explore articles on this topic of ${
        cat || "synthetic"
      } tại ThinkNest.`,
    },
    other: {
      // 👇 Structured Data trong <head>
      "application/ld+json": JSON.stringify(jsonLd),
    },
  };
}

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

const BlogPage = async ({ searchParams }) => {
  const page = parseInt(searchParams.page) || 1;
  const { cat } = searchParams;
  const { posts, count } = await getData(page, cat, 10);

  return (
    <>
      <StructuredDataList cat={cat} posts={posts} />
      <div className={styles.container}>
        <h1 className={styles.title}>{cat} Blog</h1>
        {/* Schema cho SEO */}

        <div className={styles.content}>
          <CardList page={page} cat={cat} />
          <Menu />
        </div>
      </div>
    </>
  );
};

export default BlogPage;

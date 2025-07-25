// components/seo/StructuredDataList.jsx
import React from "react";

const StructuredDataList = ({ posts, cat }) => {
  const blogPostSchemas = posts.slice(0, 10).map((post) => ({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.desc || post.excerpt || "",
    url: `https://thinknest.com/posts/${post.slug}`,
    datePublished: post.createdAt,
    author: {
      "@type": "Person",
      name: post.author || post.user?.name || "ThinkNest",
    },
    publisher: {
      "@type": "Organization",
      name: "ThinkNest",
      logo: {
        "@type": "ImageObject",
        url: "https://thinknest.com/logo.png",
      },
    },
    image: post.img || "https://thinknest.com/default-thumb.jpg",
  }));

  const jsonLd =
    blogPostSchemas.length === 1 ? blogPostSchemas[0] : blogPostSchemas;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd),
      }}
    />
  );
};

export default StructuredDataList;

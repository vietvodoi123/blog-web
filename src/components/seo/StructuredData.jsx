// components/seo/StructuredData.jsx
import React from "react";

const StructuredData = ({ post }) => {
  if (!post) return null;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

  const tagNames = post.tags?.map((tag) => tag.name) || [];
  const categoryTitles = post.categories?.map((cat) => cat.title) || [];
  const rawKeywords = post.seoKeywords
    ? post.seoKeywords.split(",").map((k) => k.trim())
    : [];
  const keywords = Array.from(
    new Set([...tagNames, ...categoryTitles, ...rawKeywords])
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.seoTitle || post.title,
    description:
      post.seoDesc || post.desc?.replace(/<[^>]+>/g, "").slice(0, 160),
    image: post.img || `${siteUrl}/og-image.jpg`,
    datePublished: post.createdAt,
    dateModified: post.updatedAt || post.createdAt,
    author: {
      "@type": "Person",
      name: post.user?.name || "ThinkNest Team",
      email: post.user?.email,
    },
    publisher: {
      "@type": "Organization",
      name: "ThinkNest",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/posts/${post.slug}`,
    },
    articleSection: categoryTitles.join(", "),
    keywords: keywords.join(", "),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export default StructuredData;

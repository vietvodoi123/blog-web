import { getAuthSession } from "@/utils/auth";
import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

// ================= GET ====================
export const GET = async (req) => {
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page")) || 1;
  const perPage = parseInt(searchParams.get("perPage")) || 4;
  const catSlug = searchParams.get("cat");
  const tagName = searchParams.get("tag");
  const type = searchParams.get("type") || "latest";

  const where = {};

  // Lọc theo category slug
  if (catSlug) {
    where.categories = {
      some: {
        category: {
          slug: catSlug,
        },
      },
    };
  }

  // Lọc theo tag name
  if (tagName) {
    where.tags = {
      some: {
        tag: {
          name: tagName,
        },
      },
    };
  }

  // Xử lý loại bài viết (latest, popular, featured, commented)
  let orderBy = { createdAt: "desc" };
  switch (type) {
    case "popular":
      orderBy = { views: "desc" };
      break;
    case "commented":
      orderBy = {
        comments: {
          _count: "desc",
        },
      };
      break;
    case "featured":
      where.isFeatured = true;
      break;
  }

  const baseQuery = {
    where,
    orderBy,
    take: perPage,
    skip: perPage * (page - 1),
    include: {
      user: true,
      comments: { select: { id: true } },
      tags: {
        include: {
          tag: true, // ✅ full thông tin tag
        },
      },
      categories: {
        include: {
          category: true, // ✅ full thông tin category
        },
      },
    },
  };

  try {
    const [posts, count] = await prisma.$transaction([
      prisma.post.findMany(baseQuery),
      prisma.post.count({ where }),
    ]);

    const simplifiedPosts = posts.map((post) => ({
      ...post,
      tags: post.tags.map((t) => t.tag),
      categories: post.categories.map((c) => c.category),
      comments: post.comments?.length || 0, // tuỳ mục đích
    }));

    return new NextResponse(
      JSON.stringify({ posts: simplifiedPosts, count }, null, 2),
      {
        status: 200,
      }
    );
  } catch (err) {
    console.error("GET /api/posts error:", err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};

// ================= POST ====================
export const POST = async (req) => {
  const session = await getAuthSession();

  if (!session) {
    return new NextResponse(JSON.stringify({ message: "Not Authenticated!" }), {
      status: 401,
    });
  }

  try {
    const body = await req.json();
    const {
      title,
      slug,
      desc,
      img,
      catSlugs = [], // ✅ mảng category
      tags = [],
      seoTitle,
      seoDesc,
      seoKeywords,
    } = body;

    // Đảm bảo catSlugs là mảng hợp lệ
    const categoryRecords = await Promise.all(
      catSlugs
        .filter((slug) => typeof slug === "string" && slug.trim() !== "") // tránh undefined/null
        .map(async (slug) => {
          return prisma.category.upsert({
            where: { slug },
            update: {},
            create: {
              slug,
              title: slug.charAt(0).toUpperCase() + slug.slice(1),
            },
          });
        })
    );

    // Tags xử lý như cũ
    const tagRecords = await Promise.all(
      tags.map(async (tagName) => {
        return prisma.tag.upsert({
          where: { name: tagName },
          update: {},
          create: { name: tagName },
        });
      })
    );

    const newPost = await prisma.post.create({
      data: {
        title,
        slug,
        desc,
        img,
        seoTitle,
        seoDesc,
        seoKeywords,
        userEmail: session.user.email,
        tags: {
          create: tagRecords.map((tag) => ({
            tag: { connect: { id: tag.id } },
          })),
        },
        categories: {
          create: categoryRecords.map((cat) => ({
            category: { connect: { id: cat.id } },
          })),
        },
      },
      include: {
        tags: { include: { tag: true } },
        categories: { include: { category: true } },
      },
    });

    return new NextResponse(JSON.stringify(newPost), { status: 201 });
  } catch (err) {
    console.error("POST /api/posts error:", err);
    return new NextResponse(
      JSON.stringify({
        message: err.message,
        error: err,
      }),
      { status: 500 }
    );
  }
};

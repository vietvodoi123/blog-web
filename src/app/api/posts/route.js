import { getAuthSession } from "@/utils/auth";
import prisma from "@/utils/connect";
import { NextResponse } from "next/server";


export const GET = async (req) => {
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page")) || 1;
  const cat = searchParams.get("cat");

  const POST_PER_PAGE = 2;

  const query = {
    take: POST_PER_PAGE,
    skip: POST_PER_PAGE * (page - 1),
    where: {
      ...(cat && { catSlug: cat }),
    },
    orderBy: {
      createdAt: "desc",
    },
    
  };

  try {
    const [posts, count] = await prisma.$transaction([
      prisma.post.findMany(query),
      prisma.post.count({ where: query.where }),
    ]);

    return new NextResponse(
      JSON.stringify({ posts, count }, null, 2),
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /api/posts error:", err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};

// POST: Create new blog post
export const POST = async (req) => {
  const session = await getAuthSession();

  if (!session) {
    return new NextResponse(
      JSON.stringify({ message: "Not Authenticated!" }),
      { status: 401 }
    );
  }

  try {
    const body = await req.json();

    const {
      title,
      slug,
      desc,
      img,
      catSlug,
      tags,
      seoTitle,
      seoDesc,
      seoKeywords,
    } = body;

    const newPost = await prisma.post.create({
      data: {
        title,
        slug,
        desc,
        img,
        catSlug,
        tags,
        seoTitle,
        seoDesc,
        seoKeywords,
        userEmail: session.user.email,
      },
    });

    return new NextResponse(JSON.stringify(newPost), { status: 201 });
  } catch (err) {
    console.error("POST /api/posts error:", err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};





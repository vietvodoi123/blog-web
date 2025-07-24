import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page")) || 1;
  const perPage = parseInt(searchParams.get("perPage")) || 6;

  try {
    // Lấy categories và đếm số bài viết liên quan
    const [categories, total] = await prisma.$transaction([
      prisma.category.findMany({
        skip: (page - 1) * perPage,
        take: perPage,
        include: {
          posts: {
            select: {
              postId: true,
            },
          },
        },
        orderBy: {
          posts: {
            _count: "desc",
          },
        },
      }),

      prisma.category.count(),
    ]);

    // Trả về dữ liệu đã map số lượng bài viết
    const result = categories.map((cat) => ({
      ...cat,
      postCount: cat.posts.length,
    }));

    return new NextResponse(
      JSON.stringify({ categories: result, total }, null, 2),
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};

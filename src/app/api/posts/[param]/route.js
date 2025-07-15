import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

export const GET = async (req, { params }) => {
  const { param } = params;

  try {
    let post;

    const isId = /^[0-9a-f]{24}$/.test(param) || param.length === 36;

    if (isId) {
      // GET by ID (for editing)
      post = await prisma.post.findUnique({
        where: { id: param },
      });
    } else {
      // GET by slug (for viewing)
      post = await prisma.post.update({
        where: { slug: param },
        data: { views: { increment: 1 } },
        include: { user: true },
      });
    }

    if (!post) {
      return new NextResponse(JSON.stringify({ message: "Post not found" }), {
        status: 404,
      });
    }

    return new NextResponse(JSON.stringify(post), { status: 200 });
  } catch (err) {
    console.error("GET post by param error:", err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};

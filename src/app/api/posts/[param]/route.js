import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

export const GET = async (req, { params }) => {
  const { param } = params;

  try {
    let post;

    const isId = /^[0-9a-f]{24}$/.test(param) || param.length === 36;

    const includeFields = {
      user: true,
      tags: {
        include: {
          tag: true,
        },
      },
      categories: {
        include: {
          category: true,
        },
      },
    };

    if (isId) {
      // GET by ID (for editing)
      post = await prisma.post.findUnique({
        where: { id: param },
        include: includeFields,
      });
    } else {
      // GET by slug (for viewing and incrementing views)
      post = await prisma.post.update({
        where: { slug: param },
        data: { views: { increment: 1 } },
        include: includeFields,
      });
    }

    if (!post) {
      return new NextResponse(JSON.stringify({ message: "Post not found" }), {
        status: 404,
      });
    }

    // Format lại tags và categories cho gọn
    const simplifiedPost = {
      ...post,
      tags: post.tags.map((t) => t.tag),
      categories: post.categories.map((c) => c.category),
    };

    return new NextResponse(JSON.stringify(simplifiedPost), { status: 200 });
  } catch (err) {
    console.error("GET post by param error:", err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};

export const PATCH = async (req, { params }) => {
  const { param } = params;

  try {
    const body = await req.json();

    // Chỉ cho phép cập nhật các trường được định nghĩa
    const allowedFields = ["isFeatured", "title", "desc", "slug", "img"];
    const dataToUpdate = {};

    for (const key of allowedFields) {
      if (body.hasOwnProperty(key)) {
        dataToUpdate[key] = body[key];
      }
    }

    const updatedPost = await prisma.post.update({
      where: {
        id: Number(param), // đảm bảo param là ID
      },
      data: dataToUpdate,
    });

    return new NextResponse(JSON.stringify(updatedPost), { status: 200 });
  } catch (err) {
    console.error("PATCH post error:", err);
    return new NextResponse(
      JSON.stringify({ message: "Lỗi khi cập nhật bài viết!" }),
      { status: 500 }
    );
  }
};

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    await prisma.post.delete({ where: { id } });
    return NextResponse.json({ message: 'Xoá thành công' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Xoá thất bại' }, { status: 500 });
  }
}
export async function PUT(req, { params }) {
  const { id } = params;
  const body = await req.json();

  try {
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title: body.title,
        slug: body.slug,
        content: body.content,
      },
    });

    return NextResponse.json(updatedPost);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Cập nhật thất bại' }, { status: 500 });
  }
}

import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { Post } from "@/generated/prisma/client";

export const GET = async (req: NextRequest) => {
  try {
    const posts: Post[] = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        content: true,
        coverImageURL: true,
        createdAt: true,
        updatedAt: true,
        categories: {
          select: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "投稿記事の一覧の取得に失敗しました" },
      { status: 500 },
    );
  }
};

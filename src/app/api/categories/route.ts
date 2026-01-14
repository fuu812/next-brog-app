import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { Category } from "@/generated/prisma/client";

export const GET = async (req: NextRequest) => {
  try {
    const categories = await prisma.category.findMany({
      //   select: {
      //     id: true,
      //     name: true,
      // _count: {
      //   posts: {
      //     select: {
      //       post: {
      //         select: {
      //           id: true,
      //           title: true,
      //         },
      //       },
      //     },
      //   },
      //   select: {
      //     posts: true,
      //   },
      // },
      //   },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(
      //   {
      //   isSuccess: true,
      //   contents: categories,
      categories,
      // }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "カテゴリの取得に失敗しました" },
      { status: 500 }, // 500: Internal Server Error
    );
  }
};

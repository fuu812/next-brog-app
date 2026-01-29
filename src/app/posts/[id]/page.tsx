"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // ◀ 注目

import type { Post } from "@/app/_types/Post";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import DOMPurify from "isomorphic-dompurify";
import dayjs from "dayjs";

const dtFmt = "YYYY-MM-DD";

// 投稿記事の詳細表示 /posts/[id]
const Page: React.FC = () => {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // 動的ルートパラメータから 記事id を取得 （URL:/posts/[id]）
  const { id } = useParams() as { id: string };

  // Use local Prisma-backed API endpoints

  // コンポーネントが読み込まれたときに「1回だけ」実行する処理
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const requestUrl = `/api/posts/${id}`;
        const response = await fetch(requestUrl, {
          method: "GET",
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error("データの取得に失敗しました");
        }
        const data = (await response.json()) as {
          id: string;
          title: string;
          content: string;
          createdAt: string;
          categories?: Array<{ category: { id: string; name: string } }>;
          coverImageURL?: string;
        };

        // Transform Prisma response to the frontend Post shape
        const transformed: Post = {
          id: data.id,
          title: data.title,
          content: data.content,
          createdAt: data.createdAt,
          categories: (data.categories || []).map(
            (c: { category: { id: string; name: string } }) => c.category,
          ),
          coverImage: {
            url: data.coverImageURL ?? "",
            // Prisma doesn't store width/height by default — use sensible defaults
            width: 800,
            height: 450,
          },
        };

        setPost(transformed);
      } catch (e) {
        setFetchError(
          e instanceof Error ? e.message : "予期せぬエラーが発生しました",
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, [id]);

  if (fetchError) {
    return <div>{fetchError}</div>;
  }

  // 投稿データの取得中は「Loading...」を表示
  if (isLoading) {
    return (
      <div className="text-gray-500">
        <FontAwesomeIcon icon={faSpinner} className="mr-1 animate-spin" />
        Loading...
      </div>
    );
  }

  // 投稿データが取得できなかったらエラーメッセージを表示
  if (!post) {
    return <div>指定idの投稿の取得に失敗しました。</div>;
  }

  // HTMLコンテンツのサニタイズ
  const safeHTML = DOMPurify.sanitize(post.content, {
    ALLOWED_TAGS: ["b", "strong", "i", "em", "u", "br"],
  });

  return (
    <main>
      <div className="space-y-2">
        <div className="mb-2 text-2xl font-bold">{post.title}</div>
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            <div>{dayjs(post.createdAt).format(dtFmt)}</div>
          </div>
          <div className="flex space-x-1.5">
            {post.categories.map((category) => (
              <div
                key={category.id}
                className={twMerge(
                  "rounded-md px-2 py-0.5",
                  "text-xs font-bold",
                  "border border-slate-400 text-slate-500",
                )}
              >
                {category.name}
              </div>
            ))}
          </div>
        </div>
        {post.coverImage.url && (
          <div>
            <Image
              src={post.coverImage.url}
              alt="Example Image"
              width={800}
              height={450}
              className="w-full rounded-xl"
            />
          </div>
        )}
        <div dangerouslySetInnerHTML={{ __html: safeHTML }} />
      </div>
    </main>
  );
};

export default Page;

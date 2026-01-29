"use client";
import { useState, useEffect } from "react";
import type { Post } from "@/app/_types/Post";
import PostSummary from "@/app/_components/PostSummary";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const Page: React.FC = () => {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Use local Prisma-backed API endpoints

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // local Prisma-backed API から記事データを取得
        const requestUrl = `/api/posts`;
        const response = await fetch(requestUrl, {
          method: "GET",
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error("データの取得に失敗しました");
        }
        const data = (await response.json()) as Array<{
          id: string;
          title: string;
          content: string;
          createdAt: string;
          categories?: Array<{ category: { id: string; name: string } }>;
          coverImageURL?: string;
        }>;

        // Transform Prisma response to the frontend Post shape
        const transformed: Post[] = (data || []).map(
          (p: {
            id: string;
            title: string;
            content: string;
            createdAt: string;
            categories?: Array<{ category: { id: string; name: string } }>;
            coverImageURL?: string;
          }) => ({
            id: p.id,
            title: p.title,
            content: p.content,
            createdAt: p.createdAt,
            categories: (p.categories || []).map(
              (c: { category: { id: string; name: string } }) => c.category,
            ),
            coverImage: {
              url: p.coverImageURL ?? "",
              width: 800,
              height: 450,
            },
          }),
        );

        setPosts(transformed);
      } catch (e) {
        setFetchError(
          e instanceof Error ? e.message : "予期せぬエラーが発生しました",
        );
      }
    };
    fetchPosts();
  }, []);

  if (fetchError) {
    return <div>{fetchError}</div>;
  }

  if (!posts) {
    return (
      <div className="text-gray-500">
        <FontAwesomeIcon icon={faSpinner} className="mr-1 animate-spin" />
        Loading...
      </div>
    );
  }

  return (
    <main>
      <div className="mb-2 text-2xl font-bold">投稿記事一覧</div>
      <div className="space-y-3">
        {posts.map((post) => (
          <div key={post.id}>
            <PostSummary post={post} />
            <Link href={`/admin/posts/${post.id}`}>
              <div className="text-blue-500 underline">{post.title} を編集</div>
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Page;

"use client";
import { useState, useEffect } from "react";
import type { Category } from "@/app/_types/Category";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const Page: React.FC = () => {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Use local Prisma-backed API endpoints

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // local Prisma-backed API からカテゴリデータを取得
        const requestUrl = `/api/categories`;
        const response = await fetch(requestUrl, {
          method: "GET",
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error("データの取得に失敗しました");
        }
        const data = (await response.json()) as Array<{
          id: string;
          name: string;
          createdAt: string;
        }>;

        // Transform Prisma response to the frontend Category shape
        const transformed: Category[] = (data || []).map(
          (c: { id: string; name: string; createdAt: string }) => ({
            id: c.id,
            name: c.name,
            createdAt: c.createdAt,
            //   categories: (c.categories || []).map((c: any) => c.category),
          }),
        );

        setCategories(transformed);
      } catch (e) {
        setFetchError(
          e instanceof Error ? e.message : "予期せぬエラーが発生しました",
        );
      }
    };
    fetchCategories();
  }, []);

  if (fetchError) {
    return <div>{fetchError}</div>;
  }

  if (!categories) {
    return (
      <div className="text-gray-500">
        <FontAwesomeIcon icon={faSpinner} className="mr-1 animate-spin" />
        Loading...
      </div>
    );
  }

  return (
    <main>
      <div className="mb-2 text-2xl font-bold">カテゴリ一覧</div>
      {categories.length === 0 ? (
        <div className="text-gray-500">
          （カテゴリは1個も作成されていません）
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <div
              key={category.id}
              className="rounded-md border border-slate-400 px-2 py-0.5 text-slate-500"
            >
              <Link href={`/admin/categories/${category.id}`}>
                {category.name}
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default Page;

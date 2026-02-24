import Link from 'next/link';

const AdminPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">管理者ページ</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">投稿</h2>
          <ul>
            <li>
              <Link href="/admin/posts/new" className="text-blue-500 hover:underline">
                新規投稿の作成
              </Link>
            </li>
            <li>
              <Link href="/admin/posts" className="text-blue-500 hover:underline">
                投稿の編集・削除
              </Link>
            </li>
          </ul>
        </div>
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">カテゴリ</h2>
          <ul>
            <li>
              <Link href="/admin/categories/new" className="text-blue-500 hover:underline">
                新規カテゴリの作成
              </Link>
            </li>
            <li>
              <Link href="/admin/categories" className="text-blue-500 hover:underline">
                カテゴリの編集・削除
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;

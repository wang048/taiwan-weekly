import { getTrends } from "@/lib/trends";
import { getAllPosts } from "@/lib/posts";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "本週台灣趨勢 | 走吧 Zou Ba",
  description:
    "走吧 Zou Ba — 每週精選台灣各平台熱門趨勢，涵蓋 PTT、Google 趨勢、新聞媒體等多元來源。",
};

const SOURCE_LABEL: Record<string, string> = {
  PTT: "PTT",
  "Google Trends": "Google 趨勢",
  巴哈姆特: "巴哈姆特",
  ETtoday: "ETtoday",
  UDN: "聯合新聞網",
  LTN: "自由時報",
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Taipei",
  });
}

export default function HomePage() {
  const trends = getTrends();
  const posts = getAllPosts().slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero */}
      <section className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">本週台灣趨勢</h1>
        {trends ? (
          <p className="text-gray-500 text-sm">
            {trends.week} · 更新時間：{formatDate(trends.generated_at)} ·{" "}
            {trends.total_items} 則熱門話題
          </p>
        ) : (
          <p className="text-gray-500 text-sm">載入趨勢資料中…</p>
        )}
      </section>

      {trends && (
        <>
          {/* Top Cross-Platform */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              🔥 跨平台熱門 Top 20
            </h2>
            <ol className="space-y-2">
              {trends.top_50_cross_platform.slice(0, 20).map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="flex-none w-7 h-7 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-bold mt-0.5">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-900 hover:text-blue-600 font-medium text-sm leading-snug line-clamp-2 transition-colors"
                    >
                      {item.title}
                    </a>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400">
                        {SOURCE_LABEL[item.source] ?? item.source}
                      </span>
                      {item.category && (
                        <>
                          <span className="text-gray-300">·</span>
                          <span className="text-xs text-gray-400">
                            {item.category}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <span className="flex-none text-xs text-gray-400 mt-1">
                    {Math.round(item.score)}分
                  </span>
                </li>
              ))}
            </ol>
          </section>

          {/* Per-Platform */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              📊 各平台熱門 Top 5
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(trends.platform_rankings).map(
                ([source, items]) => (
                  <div
                    key={source}
                    className="border border-gray-200 rounded-xl p-4"
                  >
                    <h3 className="font-semibold text-gray-700 mb-3 text-sm">
                      {SOURCE_LABEL[source] ?? source}
                    </h3>
                    <ol className="space-y-2">
                      {items.slice(0, 5).map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="flex-none text-xs text-gray-400 w-4 mt-0.5">
                            {i + 1}.
                          </span>
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-gray-800 hover:text-blue-600 line-clamp-1 transition-colors"
                          >
                            {item.title}
                          </a>
                        </li>
                      ))}
                    </ol>
                  </div>
                )
              )}
            </div>
          </section>

          {/* Category Summary */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              🏷️ 話題分類
            </h2>
            <div className="flex flex-wrap gap-2">
              {Object.entries(trends.category_summary)
                .slice(0, 20)
                .map(([cat, count]) => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium"
                  >
                    {cat}
                    <span className="text-gray-400 ml-1">{count}</span>
                  </span>
                ))}
            </div>
          </section>
        </>
      )}

      {/* Blog Posts */}
      {posts.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              📝 最新文章
            </h2>
            <Link
              href="/blog"
              className="text-sm text-blue-600 hover:underline"
            >
              查看全部 →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <p className="text-xs text-gray-400 mb-1">{post.date}</p>
                <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-2">
                  {post.title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-3">
                  {post.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="font-bold text-lg text-gray-900 hover:text-blue-600 transition-colors">
            🇹🇼 台灣週報趨勢
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link href="/" className="hover:text-gray-900 transition-colors">
              本週趨勢
            </Link>
            <Link href="/blog" className="hover:text-gray-900 transition-colors">
              部落格
            </Link>
            <Link
              href="/subscribe"
              className="bg-blue-600 text-white px-4 py-1.5 rounded-full hover:bg-blue-700 transition-colors"
            >
              訂閱電子報
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

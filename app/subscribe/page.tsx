import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "訂閱電子報",
  description: "訂閱走吧 Zou Ba 電子報，每週直送最新台灣熱門話題整理到您的信箱。",
};

export default function SubscribePage() {
  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">訂閱電子報</h1>
      <p className="text-gray-600 mb-8">
        每週精選台灣熱門趨勢，直送您的信箱。完全免費，隨時可取消訂閱。
      </p>
      {/* Buttondown embed */}
      <form
        action="https://buttondown.com/api/emails/embed-subscribe/zoubo"
        method="post"
        target="popupwindow"
        className="flex flex-col sm:flex-row gap-3 justify-center"
      >
        <input
          type="email"
          name="email"
          placeholder="您的電子郵件地址"
          required
          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          立即訂閱
        </button>
      </form>
      <p className="text-xs text-gray-400 mt-4">
        由 Buttondown 提供訂閱服務，不會向第三方分享您的個資。
      </p>
    </div>
  );
}

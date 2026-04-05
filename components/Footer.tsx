export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-gray-200 bg-gray-50 mt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        <p>© {year} 台灣週報趨勢。保留所有權利。</p>
        <p className="text-xs">
          資料來源：PTT、Google Trends、巴哈姆特、ETtoday、UDN、LTN
        </p>
      </div>
    </footer>
  );
}

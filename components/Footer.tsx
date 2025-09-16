export default function Footer() {
  const version = "1.1.2";
  const lastUpdate = "16.09.2025";

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2">
          <p className="text-gray-600 dark:text-gray-400">
            © 2025 aykutkaya.tr - All rights reserved
          </p>
          <div className="flex justify-center items-center space-x-4 text-sm text-gray-500 dark:text-gray-500">
            <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
              v{version}
            </span>
            <span>•</span>
            <span>Son güncelleme: {lastUpdate}</span>
            <span>•</span>
            <span className="text-green-600 dark:text-green-400 flex items-center">
              <span className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full mr-1 animate-pulse"></span>
              Canlı
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
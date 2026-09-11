export default function SearchBar() {
  return (
    <form action="/" method="GET" className="flex gap-2 mb-4">
      <input
        type="text"
        name="search"
        placeholder="Search files by name or type..."
        className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
      />
      <button type="submit" className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        Search
      </button>
      <a href="/" className="bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors duration-300 text-center flex items-center">
        Clear
      </a>
    </form>
  );
}
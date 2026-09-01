export default function SearchBar() {
  return (
    <form action="/" method="GET" className="flex gap-2 mb-4">
      <input
        type="text"
        name="search"
        placeholder="Search files by name or type..."
        className="w-full border border-gray-200 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button type="submit" className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 border border-gray-200 transition">
        Search
      </button>
      <a href="/" className="bg-white text-gray-500 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 border border-gray-200 transition text-center flex items-center">
        Clear
      </a>
    </form>
  );
}
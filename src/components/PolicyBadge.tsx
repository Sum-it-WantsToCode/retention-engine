export default function PolicyBadge({ isActive }: { isActive: boolean }) {
  if (isActive) {
    return (
      <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs px-2 py-1 rounded-full font-medium transition-colors duration-300">
        ● Active
      </span>
    );
  }
  
  return (
    <span className="bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs px-2 py-1 rounded-full font-medium transition-colors duration-300">
      ○ Paused
    </span>
  );
}
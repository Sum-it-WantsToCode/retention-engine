export default function PolicyBadge({ isActive }: { isActive: boolean }) {
  if (isActive) {
    return <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">● Active</span>;
  }
  
  return <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full font-medium">○ Paused</span>;
}
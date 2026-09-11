export default function StorageBar({ usedMb, maxMb }: { usedMb: number, maxMb: number }) {
  const percentage = Math.min(Math.round((usedMb / maxMb) * 100), 100);
  
  // Dynamic color: Turns red if over 90% capacity
  const barColor = percentage > 90 
    ? 'bg-red-500 dark:bg-red-600' 
    : 'bg-blue-600 dark:bg-blue-500';

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 mt-4 transition-colors duration-300">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Workspace Storage Limit</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Maximum capacity: {maxMb} MB</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{percentage}%</span>
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">used</span>
        </div>
      </div>
      
      {/* Progress Bar Background */}
      <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3 overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        {/* Dynamic Progress Fill */}
        <div 
          className={`h-3 rounded-full transition-all duration-500 ${barColor}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
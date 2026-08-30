export default function StorageBar({ usedMb, maxMb }: { usedMb: number, maxMb: number }) {
  const percentage = Math.min(Math.round((usedMb / maxMb) * 100), 100);
  
  // Dynamic color: Turns red if over 90% capacity
  const barColor = percentage > 90 ? 'bg-red-500' : 'bg-blue-600';

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-4">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h3 className="text-sm font-semibold text-gray-700">Workspace Storage Limit</h3>
          <p className="text-xs text-gray-500">Maximum capacity: {maxMb} MB</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-gray-900">{percentage}%</span>
          <span className="text-sm text-gray-500 ml-1">used</span>
        </div>
      </div>
      
      {/* Progress Bar Background */}
      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden border border-gray-200">
        {/* Dynamic Progress Fill */}
        <div 
          className={`h-3 rounded-full transition-all duration-500 ${barColor}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
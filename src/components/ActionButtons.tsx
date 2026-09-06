'use client';

import { useTransition } from 'react';
import { manualRunEngine, generateMockFile, clearAllData } from '../app/actions'; 

export default function ActionButtons() {
  const [isPending, startTransition] = useTransition();

  const handleGenerate = () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('fileType', 'Screenshot'); 
      await generateMockFile(formData);
    });
  };

  const handleEngine = () => {
    startTransition(async () => {
      await manualRunEngine();
    });
  };

  const handleClear = () => {
    startTransition(async () => {
      await clearAllData(); 
    });
  };

  return (
    <div className="flex gap-4">
      <button 
        onClick={handleGenerate} 
        disabled={isPending}
        className="bg-gray-800 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50 transition-opacity"
      >
        {isPending ? 'Working...' : '+ Old Screenshot'}
      </button>

      <button 
        onClick={handleEngine} 
        disabled={isPending}
        className="bg-red-600 text-white px-4 py-2 rounded-md font-medium shadow-sm hover:bg-red-700 disabled:opacity-50 transition-all"
      >
        {isPending ? 'Running...' : '⚡ Run Engine Now'}
      </button>

      <button 
        onClick={handleClear} 
        disabled={isPending}
        className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-md font-medium hover:bg-red-100 disabled:opacity-50 transition-colors"
      >
        {isPending ? 'Clearing...' : 'Clear All Data'}
      </button>
    </div>
  );
}
import { auth } from '@clerk/nextjs/server';
import { db } from '../db';
import { retentionPolicies, mockFiles, auditLogs } from '../db/schema';
import { createPolicy, deletePolicy, generateMockFile, manualRunEngine, clearLogs, togglePolicy, resetWorkspace } from './actions';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import StorageBar from '../components/StorageBar';
import PolicyBadge from '../components/PolicyBadge';
import { ilike, or } from 'drizzle-orm';
import SearchBar from '../components/SearchBar';

// Accept searchParams from the URL
export default async function Dashboard({ searchParams }: { searchParams: { search?: string } }) {
  await auth.protect();
  const policies = await db.select().from(retentionPolicies);
  const logs = await db.select().from(auditLogs); 
  const displayLogs = logs.reverse();

  // Search Filtering Logic
  const searchTerm = searchParams?.search;
  const files = await db.select()
    .from(mockFiles)
    .where(
      searchTerm 
        ? or(
            ilike(mockFiles.fileName, `%${searchTerm}%`),
            ilike(mockFiles.fileType, `%${searchTerm}%`)
          )
        : undefined
    );

  // JavaScript Math to calculate our dashboard stats
  const totalPolicies = policies.length;
  const totalFiles = files.length;
  const totalStorageMb = files.reduce((sum, file) => sum + file.fileSize, 0);
  const totalEngineRuns = logs.length;
  const STORAGE_LIMIT_MB = 200;

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 pb-12">
      <Navbar /> 
      
      <div className="p-8 max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Policy Control Center</h1>
          <p className="text-gray-600">Automate your digital cleanup based on custom rules.</p>
        </div>

        {/* Analytics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Active Rules" value={totalPolicies} icon="🛡️" />
          <StatCard title="Files Monitored" value={totalFiles} icon="📂" />
          <StatCard title="Storage Used" value={`${totalStorageMb} MB`} icon="💾" />
          <StatCard title="Engine Actions" value={totalEngineRuns} icon="⚡" />
        </div>

        {/* Storage Capacity Progress Bar */}
        <StorageBar usedMb={totalStorageMb} maxMb={STORAGE_LIMIT_MB} />

        {/* Policy Management and File System */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Create New Rule</h2>
            <form action={createPolicy} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">File Type (e.g., Screenshots)</label>
                <input type="text" name="fileType" required className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Days to Keep</label>
                <input type="number" name="retentionDays" required className="w-full border rounded p-2" />
              </div>
              <button type="submit" className="bg-blue-600 text-white font-medium py-2 rounded hover:bg-blue-700">Save Rule</button>
            </form>
          </div>
          
          {/* Active Policies List */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Active Policies</h2>
            <ul className="space-y-3">
              {policies.map((policy) => (
                <li key={policy.id} className="p-3 bg-gray-50 border rounded-md flex justify-between items-center transition hover:bg-gray-100">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-900">{policy.fileType}</span>
                      <PolicyBadge isActive={policy.isActive} />
                    </div>
                    <span className="text-gray-600 text-sm">Delete after {policy.retentionDays} days</span>
                  </div>
                  
                  {/* Action Buttons Container */}
                  <div className="flex gap-2">
                    <form action={togglePolicy}>
                      <input type="hidden" name="id" value={policy.id} />
                      <input type="hidden" name="isActive" value={policy.isActive.toString()} />
                      <button type="submit" className="text-gray-600 hover:text-gray-900 text-sm px-3 py-1 bg-white border border-gray-200 shadow-sm rounded transition">
                        {policy.isActive ? 'Pause' : 'Resume'}
                      </button>
                    </form>
                    
                    <form action={deletePolicy}>
                      <input type="hidden" name="id" value={policy.id} />
                      <button type="submit" className="text-red-600 hover:text-red-800 text-sm px-3 py-1 bg-red-50 hover:bg-red-100 rounded transition">
                        Delete
                      </button>
                    </form>
                  </div>
                </li>
              ))}
              </ul>
          </div>
        </div>

        {/* Simulated File System */} 
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Simulated File System</h2>
            <div className="flex gap-2">
              <form action={generateMockFile}>
                <input type="hidden" name="fileType" value="Screenshots" />
                <button type="submit" className="bg-gray-800 text-white text-sm px-4 py-2 rounded">+ Old Screenshot</button>
              </form>
              <form action={manualRunEngine}>
                <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-bold text-sm px-4 py-2 rounded shadow flex items-center gap-2 transition">
                  ⚡ Run Engine Now
                </button>
              </form>
            
              {/* Danger Zone Button */}
              <form action={resetWorkspace}>
                <button type="submit" className="bg-red-50 hover:bg-red-100 text-red-600 font-bold text-sm px-4 py-2 rounded border border-red-200 transition">
                  Clear All Data
                </button>
              </form>
            </div>
          </div>

          <SearchBar />
         
          {/* Professional Empty State */}
          {files.length === 0 ? (
            <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-lg mb-1">No files in workspace</p>
              <p className="text-sm">Click "+ Mock File" to generate test data.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {files.map((file) => (
                <div key={file.id} className="p-4 border rounded bg-gray-50 text-center transition hover:border-gray-300 shadow-sm hover:shadow">
                  <div className="text-3xl mb-2">📄</div>
                  <div className="font-medium text-sm truncate">{file.fileName}</div>
                  <div className="text-xs text-gray-500 mt-1">{file.uploadedAt.toLocaleDateString()}</div>
                  <div className="text-xs font-bold text-blue-600 mt-1">{file.fileSize} MB</div>
                </div>
              ))}
            </div>
          )}
        
        
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {files.map((file) => (
              <div key={file.id} className="p-4 border rounded bg-gray-50 text-center">
                <div className="text-3xl mb-2">📄</div>
                <div className="font-medium text-sm truncate">{file.fileName}</div>
                <div className="text-xs text-gray-500 mt-1">{file.uploadedAt.toLocaleDateString()}</div>
                <div className="text-xs font-bold text-blue-600 mt-1">{file.fileSize} MB</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Engine Activity Terminal */}
        <div className="bg-gray-900 text-green-400 p-6 rounded-lg shadow-sm font-mono text-sm">
          <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
            <h2 className="text-lg font-semibold text-white">Engine Activity Terminal</h2>
              {/* Export CSV Button */}
              <a href="/api/export" className="text-blue-400 hover:text-blue-300 text-xs px-2 py-1 bg-gray-800 rounded border border-gray-700">
                Download CSV
              </a>
            <form action={clearLogs}>
              <button type="submit" className="text-gray-400 hover:text-white text-xs px-2 py-1 bg-gray-800 rounded">Clear Logs</button>
            </form>
          </div>
          
          <div className="space-y-2 h-40 overflow-y-auto">
            {displayLogs.length === 0 ? (
              <p className="text-gray-500">Waiting for engine cycles...</p>
            ) : (
              displayLogs.map((log) => (
                <div key={log.id} className="flex gap-4">
                  <span className="text-gray-500">[{log.createdAt.toLocaleTimeString()}]</span>
                  <span>{log.message}</span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </main>
  );
}
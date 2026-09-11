import { auth } from '@clerk/nextjs/server';
import { db } from '../db';
import { retentionPolicies, mockFiles, auditLogs } from '../db/schema';
import { createPolicy, deletePolicy, generateMockFile, manualRunEngine, clearLogs, togglePolicy, resetWorkspace } from './actions';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import EmptyState from '../components/EmptyState';
import StorageBar from '../components/StorageBar';
import PolicyBadge from '../components/PolicyBadge';
import { ilike, or, eq, and } from 'drizzle-orm';
import SearchBar from '../components/SearchBar';

export const dynamic = 'force-dynamic';

export default async function Dashboard(props: { searchParams: Promise<{ search?: string }> }) {
  const searchParams = await props.searchParams;
  const { userId } = await auth();

  const policies = await db.select().from(retentionPolicies).where(eq(retentionPolicies.userId, userId!));
  const logs = await db.select().from(auditLogs).where(eq(auditLogs.userId, userId!)); 
  const displayLogs = logs.reverse();
  const searchTerm = searchParams?.search;
  
  const files = await db.select()
    .from(mockFiles)
    .where(
      and(
        eq(mockFiles.userId, userId!),
        searchTerm 
          ? or(
              ilike(mockFiles.fileName, `%${searchTerm}%`),
              ilike(mockFiles.fileType, `%${searchTerm}%`)
            )
          : undefined
      )
    );

  const totalPolicies = policies.length;
  const totalFiles = files.length;
  const totalStorageMb = files.reduce((sum, file) => sum + file.fileSize, 0);
  const totalEngineRuns = logs.length;
  const STORAGE_LIMIT_MB = 200;

return (
    <main className="relative min-h-screen text-gray-900 dark:text-gray-100 pb-12 transition-colors duration-300 z-0">
      
      {/* Ambient Background Color */}
      <div className="fixed inset-0 -z-20 bg-gray-50 dark:bg-[#050505] transition-colors duration-300" />
      <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-blue-400/20 dark:bg-blue-900/20 blur-[120px] -z-10 pointer-events-none transition-colors duration-300" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-purple-400/20 dark:bg-indigo-900/20 blur-[120px] -z-10 pointer-events-none transition-colors duration-300" />
      
      <Navbar /> 
      
      <div className="p-8 max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Policy Control Center</h1>
          <p className="text-gray-600 dark:text-gray-400">Automate your digital cleanup based on custom rules.</p>
        </div>

        {/* Analytics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Active Rules" value={totalPolicies} icon="🛡️" href="#policies-section" />
          <StatCard title="Files Monitored" value={totalFiles} icon="📂" href="#file-system-section" />
          <StatCard title="Storage Used" value={`${totalStorageMb} MB`} icon="💾" />
          <StatCard title="Engine Actions" value={totalEngineRuns} icon="⚡" href="#engine-activity-section" />
        </div>

        {/* Storage Capacity Progress Bar */}
        <StorageBar usedMb={totalStorageMb} maxMb={STORAGE_LIMIT_MB} />

        {/* Policy Management and File System */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Create Rule Panel */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 transition-colors duration-300">
            <h2 className="text-xl font-semibold mb-4">Create New Rule</h2>
            <form action={createPolicy} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">File Type (e.g., Screenshots)</label>
                <input type="text" name="fileType" required className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Days to Keep</label>
                <input type="number" name="retentionDays" required className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none transition-colors" />
              </div>
              <button type="submit" className="bg-blue-600 text-white font-medium py-2 rounded hover:bg-blue-700 transition-colors">Save Rule</button>
            </form>
          </div>
          
          {/* Active Policies List */}
          <section id="policies-section">
            {policies.length === 0 ? (
              <EmptyState 
                icon="🛡️" 
                title="No active rules" 
                description="Create a retention policy above to start automating your workspace cleanup." 
              />
            ) : (
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 transition-colors duration-300 h-full">
                <h2 className="text-xl font-semibold mb-4">Active Policies</h2>
                <ul className="space-y-3">
                  {policies.map((policy) => (
                    <li key={policy.id} className="p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-md flex justify-between items-center transition hover:bg-gray-100 dark:hover:bg-gray-800">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-gray-900 dark:text-gray-100">{policy.fileType}</span>
                          <PolicyBadge isActive={policy.isActive} />
                        </div>
                        <span className="text-gray-600 dark:text-gray-400 text-sm">Delete after {policy.retentionDays} days</span>
                      </div>
                      
                      {/* Action Buttons Container */}
                      <div className="flex gap-2">
                        <form action={togglePolicy}>
                          <input type="hidden" name="id" value={policy.id} />
                          <input type="hidden" name="isActive" value={policy.isActive.toString()} />
                          <button type="submit" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm px-3 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-sm rounded transition-colors">
                            {policy.isActive ? 'Pause' : 'Resume'}
                          </button>
                        </form>
                        
                        <form action={deletePolicy}>
                          <input type="hidden" name="id" value={policy.id} />
                          <button type="submit" className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm px-3 py-1 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded transition-colors">
                            Delete
                          </button>
                        </form>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </div>
        
        {/* Simulated File System */} 
        <section id="file-system-section" className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 transition-colors duration-300">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Simulated File System</h2>
            <div className="flex gap-2">
              <form action={generateMockFile}>
                <input type="hidden" name="fileType" value="Screenshots" />
                <button type="submit" className="bg-gray-800 dark:bg-gray-700 text-white text-sm px-4 py-2 rounded transition-colors">+ Old Screenshot</button>
              </form>
              <form action={manualRunEngine}>
                <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-bold text-sm px-4 py-2 rounded shadow flex items-center gap-2 transition-colors">
                  ⚡ Run Engine Now
                </button>
              </form>
            
              {/* Danger Zone Button */}
              <form action={resetWorkspace}>
                <button type="submit" className="bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 font-bold text-sm px-4 py-2 rounded border border-red-200 dark:border-red-800 transition-colors">
                  Clear All Data
                </button>
              </form>
            </div>
          </div>

          <SearchBar />
          
          {/* Professional Empty State */}
          {files.length === 0 ? (
            <EmptyState 
              icon="📂" 
              title="File system is empty" 
              description="Click '+ Old Screenshot' above to generate test files for the engine to scan." 
            />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {files.map((file) => (
                <div key={file.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-800/50 text-center transition hover:border-gray-300 dark:hover:border-gray-500 shadow-sm hover:shadow">
                  <div className="text-3xl mb-2">📄</div>
                  <div className="font-medium text-sm truncate dark:text-gray-200">{file.fileName}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{file.uploadedAt.toLocaleDateString()}</div>
                  <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-1">{file.fileSize} MB</div>
                </div>
              ))}
            </div>
          )}
        </section>
        
        {/* Engine Activity Terminal */}
        <section id="engine-activity-section" className="bg-gray-900 text-green-400 p-6 rounded-lg shadow-sm font-mono text-sm mt-8 border border-gray-800">
          <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
            <h2 className="text-lg font-semibold text-white">Engine Activity Terminal</h2>
              <a href="/api/export" className="text-blue-400 hover:text-blue-300 text-xs px-2 py-1 bg-gray-800 rounded border border-gray-700 transition-colors">
                Download CSV
              </a>
            <form action={clearLogs}>
              <button type="submit" className="text-gray-400 hover:text-white text-xs px-2 py-1 bg-gray-800 rounded transition-colors">Clear Logs</button>
            </form>
          </div>
          
          <div className="space-y-2 h-40 overflow-y-auto">
            {displayLogs.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-full border-2 border-dashed border-gray-700 rounded-xl p-8 transition-all hover:bg-gray-800/50">
                <span className="text-3xl grayscale opacity-50 mb-3">⚡</span>
                <p className="text-gray-400 font-semibold mb-1">No engine activity yet</p>
                <p className="text-gray-500 text-center max-w-sm">
                  Run the engine manually or wait for the nightly cron job to see logs appear here.
                </p>
              </div>
            ) : (
              displayLogs.map((log) => (
                <div key={log.id} className="flex gap-4">
                  <span className="text-gray-500">[{log.createdAt.toLocaleTimeString()}]</span>
                  <span>{log.message}</span>
                </div>
              ))
            )}
          </div>
        </section>

      </div>
    </main>
  );
}
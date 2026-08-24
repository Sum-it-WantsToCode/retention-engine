import { db } from '../db';
import { retentionPolicies, mockFiles } from '../db/schema';
import { createPolicy, deletePolicy, generateMockFile } from './actions';
import Navbar from '../components/Navbar';

export default async function Dashboard() {
  const policies = await db.select().from(retentionPolicies);
  const files = await db.select().from(mockFiles);

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar /> 
      
      <div className="p-8 max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Policy Control Center</h1>
          <p className="text-gray-600">Automate your digital cleanup based on custom rules.</p>
        </div>

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

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Active Policies</h2>
            <ul className="space-y-3">
              {policies.map((policy) => (
                <li key={policy.id} className="p-3 bg-gray-50 border rounded-md flex justify-between items-center">
                  <div>
                    <span className="font-medium block">{policy.fileType}</span>
                    <span className="text-gray-600 text-sm">Delete after {policy.retentionDays} days</span>
                  </div>
                  <form action={deletePolicy}>
                    <input type="hidden" name="id" value={policy.id} />
                    <button type="submit" className="text-red-600 text-sm px-3 py-1 bg-red-50 rounded">Delete</button>
                  </form>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Simulated File System</h2>
            <form action={generateMockFile} className="flex gap-2">
              <input type="hidden" name="fileType" value="Screenshots" />
              <button type="submit" className="bg-gray-800 text-white text-sm px-4 py-2 rounded">+ Generate Old Screenshot</button>
            </form>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {files.map((file) => (
              <div key={file.id} className="p-4 border rounded bg-gray-50 text-center">
                <div className="text-3xl mb-2">📄</div>
                <div className="font-medium text-sm truncate">{file.fileName}</div>
                <div className="text-xs text-gray-500 mt-1">{file.uploadedAt.toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
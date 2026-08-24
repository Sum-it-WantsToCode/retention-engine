import { db } from '../db';
import { retentionPolicies } from '../db/schema';
import { createPolicy, deletePolicy } from './actions';

export default async function Dashboard() {
  const policies = await db.select().from(retentionPolicies);

  return (
    <main className="min-h-screen bg-gray-50 p-8 text-gray-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Retention Policy Engine</h1>
        <p className="text-gray-600 mb-8">Automate your digital cleanup based on custom rules.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Create New Rule</h2>
            <form action={createPolicy} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">File Type</label>
                <input type="text" name="fileType" placeholder="e.g., Screenshots" required className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Days to Keep</label>
                <input type="number" name="retentionDays" placeholder="30" required className="w-full border rounded p-2" />
              </div>
              <button type="submit" className="bg-blue-600 text-white font-medium py-2 rounded hover:bg-blue-700 transition">
                Save Rule
              </button>
            </form>
          </div>
          {/* Active Policies Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Active Policies</h2>
            {policies.length === 0 ? (
              <p className="text-sm text-gray-500">No active rules yet.</p>
            ) : (
              <ul className="space-y-3">
                {policies.map((policy) => (
                  <li key={policy.id} className="p-3 bg-gray-50 border rounded-md flex justify-between items-center">
                    <div>
                      <span className="font-medium block">{policy.fileType}</span>
                      <span className="text-gray-600 text-sm">Delete after {policy.retentionDays} days</span>
                    </div>
                    
                    {/* New Delete Button Form */}
                    <form action={deletePolicy}>
                      <input type="hidden" name="id" value={policy.id} />
                      <button type="submit" className="text-red-600 hover:text-red-800 font-medium text-sm px-3 py-1 bg-red-50 hover:bg-red-100 rounded transition">
                        Delete
                      </button>
                    </form>
                    
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
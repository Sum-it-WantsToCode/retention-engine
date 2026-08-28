export default function StatCard({ title, value, icon }: { title: string, value: string | number, icon: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center gap-4 transition hover:shadow-md">
      <div className="text-3xl bg-gray-50 p-3 rounded-full border border-gray-100">{icon}</div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
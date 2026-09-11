interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
}

export default function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-800/20 text-center transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-800/40">
      <div className="text-4xl mb-3 grayscale opacity-80 dark:opacity-60">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-sm mx-auto">
        {description}
      </p>
    </div>
  );
}
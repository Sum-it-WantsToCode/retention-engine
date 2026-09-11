import Link from 'next/link';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  href?: string;
}

export default function StatCard({ title, value, icon, href }: StatCardProps) {
  const isClickable = !!href;
  
  const cardContent = (
    <div className={`relative bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 flex items-center gap-4 transition-all duration-300 overflow-hidden ${
      isClickable 
        ? 'group cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:border-blue-500 dark:hover:border-blue-500' 
        : 'hover:shadow-md'
    }`}>
      
      {/* Subtle hover background gradient */}
      {isClickable && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 dark:from-blue-900/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 -z-10" />
      )}

      {/* Icon Container */}
      <div className={`text-3xl bg-gray-50 dark:bg-gray-800 p-3 rounded-full border border-gray-100 dark:border-gray-700 transition-colors duration-300 ${
        isClickable ? 'group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 group-hover:border-blue-200 dark:group-hover:border-blue-800' : ''
      }`}>
        {icon}
      </div>
      
      {/* Text Container */}
      <div>
        <p className={`text-sm font-medium transition-colors duration-300 ${
          isClickable ? 'text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400' : 'text-gray-500 dark:text-gray-400'
        }`}>
          {title}
        </p>
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
      </div>
    </div>
  );

  if (href) {
    return href.startsWith('#') ? (
      <a href={href} className="block outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg">
        {cardContent}
      </a>
    ) : (
      <Link href={href} className="block outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
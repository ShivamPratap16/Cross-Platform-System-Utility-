import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FiActivity, 
  FiSearch, 
  FiFileText, 
  FiSettings, 
  FiPieChart,
  FiMonitor,
  FiCommand
} from 'react-icons/fi';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { icon: <FiActivity />, label: 'Dashboard', path: '/' },
    { icon: <FiPieChart />, label: 'Visualizations', path: '/visualizations' },
    { icon: <FiMonitor />, label: 'System Checks', path: '/checks' },
    { icon: <FiFileText />, label: 'Logs', path: '/logs' }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to the appropriate page with search query
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <FiCommand className="text-2xl text-blue-600 dark:text-blue-400" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            System Monitor
          </h1>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 
              dark:border-gray-700 bg-gray-50 dark:bg-gray-900 
              text-gray-900 dark:text-gray-100 
              focus:ring-2 focus:ring-blue-500 focus:border-transparent
              placeholder-gray-500 dark:placeholder-gray-400"
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </form>
      </div>
      
      {/* Navigation Items */}
      <nav className="p-4">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 p-3 rounded-lg mb-1 
              transition-colors duration-200
              ${location.pathname === item.path
                ? 'bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
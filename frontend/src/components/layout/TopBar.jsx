import { FiMoon, FiSun, FiUser } from 'react-icons/fi';

export default function TopBar({ toggleTheme, isDark }) {
  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="flex items-center justify-end h-full px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors duration-200"
            aria-label="Toggle theme"
          >
            {isDark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700 dark:text-gray-300">Admin</span>
            {/* Default user icon if no avatar image */}
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <FiUser className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
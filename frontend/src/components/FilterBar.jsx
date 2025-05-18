function FilterBar({ filterOS, setFilterOS, filterStatus, setFilterStatus }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex flex-wrap gap-4 transition-colors duration-200">
      <div className="flex items-center gap-2">
        <label className="font-medium text-gray-700 dark:text-gray-300">OS Type:</label>
        <select
          className="p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
            border-gray-200 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-blue-500 
            dark:focus:ring-blue-400 transition-colors duration-200"
          value={filterOS}
          onChange={(e) => setFilterOS(e.target.value)}
        >
          <option value="All">All Systems</option>
          <option value="win32">Windows</option>
          <option value="darwin">macOS</option>
          <option value="linux">Linux</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="font-medium text-gray-700 dark:text-gray-300">Status:</label>
        <select
          className="p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
            border-gray-200 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-blue-500 
            dark:focus:ring-blue-400 transition-colors duration-200"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="OK">Compliant</option>
          <option value="Issues">Has Issues</option>
        </select>
      </div>
    </div>
  );
}

export default FilterBar;

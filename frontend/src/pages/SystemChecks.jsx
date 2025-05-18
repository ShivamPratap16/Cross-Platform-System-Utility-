import { useState, useEffect } from 'react';
import { BiLoaderAlt } from 'react-icons/bi';
import { FiShield, FiClock, FiHardDrive, FiRefreshCw, FiMonitor } from 'react-icons/fi';
import { fetchMachineData } from '../api/systemAPI';

export default function SystemChecks() {
  const [systems, setSystems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSystem, setSelectedSystem] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await fetchMachineData();
      setSystems(data);
      setError(null);
    } catch (err) {
      setError('⚠️ Failed to fetch system data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const SystemCard = ({ system, isSelected, onClick }) => (
    <div
      onClick={onClick}
      className={`
        bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 cursor-pointer
        transform transition-all duration-200 hover:shadow-md
        ${isSelected ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}
        hover:scale-[1.02]
      `}
    >
      <div className="flex items-center gap-3">
        <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
          <FiMonitor className="text-xl text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {system.platform === 'win32' ? 'Windows' : 
             system.platform === 'darwin' ? 'macOS' : 'Linux'} System
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Last checked: {system.timestamp}
          </p>
        </div>
      </div>
      
      <div className="mt-4 flex gap-2">
        {[
          { status: system.diskEncrypted, label: 'Disk' },
          { status: system.osUpdated, label: 'OS' },
          { status: system.antivirusActive, label: 'AV' },
          { status: system.sleepSettingOK, label: 'Sleep' }
        ].map((check, i) => (
          <span
            key={i}
            className={`px-2 py-1 rounded text-xs font-medium
              ${check.status 
                ? 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300' 
                : 'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-300'
              }`}
          >
            {check.label}
          </span>
        ))}
      </div>
    </div>
  );

  const CheckCard = ({ title, icon: Icon, status, details }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transform transition-all duration-200 hover:shadow-md">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-full ${
            status 
              ? 'bg-green-100 dark:bg-green-900' 
              : 'bg-red-100 dark:bg-red-900'
          }`}>
            <Icon className={`text-xl ${
              status 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 ${
              status 
                ? 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300' 
                : 'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-300'
            }`}>
              {status ? 'Pass' : 'Fail'}
            </span>
          </div>
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">{details}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <BiLoaderAlt className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">System Security Checks</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitoring {systems.length} system{systems.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg 
            hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow"
        >
          <FiRefreshCw className="animate-spin" />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
        {systems.map((system) => (
          <SystemCard
            key={system.id}
            system={system}
            isSelected={selectedSystem?.id === system.id}
            onClick={() => setSelectedSystem(system)}
          />
        ))}
      </div>

      {selectedSystem && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Detailed Security Checks
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CheckCard
              title="Disk Encryption"
              icon={FiHardDrive}
              status={selectedSystem.diskEncrypted}
              details={selectedSystem.details.disk}
            />
            <CheckCard
              title="OS Updates"
              icon={FiRefreshCw}
              status={selectedSystem.osUpdated}
              details={selectedSystem.details.os}
            />
            <CheckCard
              title="Antivirus Status"
              icon={FiShield}
              status={selectedSystem.antivirusActive}
              details={selectedSystem.details.antivirus}
            />
            <CheckCard
              title="Sleep Settings"
              icon={FiClock}
              status={selectedSystem.sleepSettingOK}
              details={`Sleep timeout: ${selectedSystem.details.sleep}`}
            />
          </div>
        </div>
      )}
    </div>
  );
}

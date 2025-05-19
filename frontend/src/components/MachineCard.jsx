import { useState } from 'react';
import { 
  FiMonitor, 
  FiCpu, 
  FiHardDrive, 
  FiWifi, 
  FiEye,
  FiTerminal,
  FiCommand,
  FiGrid
} from 'react-icons/fi';
import DetailModal from './DetailModal';

function MachineCard({ machine }) {
  const [showModal, setShowModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const StatusBadge = ({ status, label }) => (
    <div className={`
      flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium
      ${status 
        ? 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300' 
        : 'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-300'
      }
    `}>
      <span className={`w-2 h-2 rounded-full ${status ? 'bg-green-500' : 'bg-red-500'}`} />
      {label}
    </div>
  );

  const getSystemIcon = () => {
    const iconClass = "text-xl"; // Uniform size for all icons
    
    switch (machine.platform.toLowerCase()) {
      case 'windows_nt':
      case 'win32':
        return (
          <div className="flex items-center justify-center w-6 h-6">
            <FiGrid className={`${iconClass} text-blue-500 dark:text-blue-400`} />
          </div>
        );
      case 'darwin':
        return (
          <div className="flex items-center justify-center w-6 h-6">
            <FiCommand className={`${iconClass} text-gray-700 dark:text-gray-300`} />
          </div>
        );
      case 'linux':
        return (
          <div className="flex items-center justify-center w-6 h-6">
            <FiTerminal className={`${iconClass} text-yellow-600 dark:text-yellow-500`} />
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center w-6 h-6">
            <FiMonitor className={`${iconClass} text-gray-500 dark:text-gray-400`} />
          </div>
        );
    }
  };

  const getPlatformName = (platform) => {
    switch (platform?.toLowerCase()) {
      case 'windows_nt':
      case 'win32':
        return 'Windows';
      case 'darwin':
        return 'macOS';
      case 'linux':
        return 'Linux';
      default:
        return platform || 'Unknown';
    }
  };

  return (
    <>
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm relative overflow-hidden hover:shadow-md transition-all duration-200"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="p-6 relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                {getSystemIcon()}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {getPlatformName(machine.platform)} System
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  ID: {machine.machineId.slice(0,8)}...
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Last Check-in: {machine.timestamp}
                </p>
              </div>
            </div>
          </div>

          {/* Status Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <StatusBadge 
              status={machine.diskEncrypted} 
              label="Disk Encryption" 
            />
            <StatusBadge 
              status={machine.osUpdated} 
              label="OS Updates" 
            />
            <StatusBadge 
              status={machine.antivirusActive} 
              label="Antivirus" 
            />
            <StatusBadge 
              status={machine.sleepSettingOK} 
              label="Sleep Settings" 
            />
          </div>

          {/* View Details Button */}
          <button
            onClick={() => setShowModal(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 mt-2 
              bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 
              dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 
              transition-colors duration-200"
          >
            <FiEye className="text-lg" />
            View Details
          </button>
        </div>
      </div>

      {/* Detail Modal */}
      {showModal && (
        <DetailModal
          machine={machine}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

export default MachineCard;

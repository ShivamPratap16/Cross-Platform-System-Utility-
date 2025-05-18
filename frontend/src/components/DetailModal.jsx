import { FiX, FiMonitor, FiHardDrive, FiShield, FiClock } from 'react-icons/fi';

export default function DetailModal({ machine, onClose }) {
  if (!machine) return null;

  const DetailSection = ({ icon: Icon, title, status, details }) => (
    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
      <div className="flex items-center gap-3 mb-3">
        <Icon className="text-xl text-gray-600 dark:text-gray-400" />
        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
      </div>
      <div className="space-y-2">
        <div className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium
          ${status 
            ? 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300' 
            : 'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-300'
          }`}
        >
          {status ? 'Pass' : 'Fail'}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{details}</p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                System Details
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Last Updated: {machine.timestamp}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <FiX className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailSection
                icon={FiHardDrive}
                title="Disk Encryption"
                status={machine.diskEncrypted}
                details={machine.details.disk}
              />
              <DetailSection
                icon={FiMonitor}
                title="OS Updates"
                status={machine.osUpdated}
                details={machine.details.os}
              />
              <DetailSection
                icon={FiShield}
                title="Antivirus Status"
                status={machine.antivirusActive}
                details={machine.details.antivirus}
              />
              <DetailSection
                icon={FiClock}
                title="Sleep Settings"
                status={machine.sleepSettingOK}
                details={`Sleep timeout: ${machine.details.sleep} minutes`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
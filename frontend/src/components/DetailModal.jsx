import { FiX, FiHardDrive, FiShield, FiRefreshCw, FiClock } from 'react-icons/fi';

function DetailModal({ machine, onClose }) {
  const DetailSection = ({ icon: Icon, title, value, status }) => (
    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-white dark:bg-gray-700 rounded-md">
          <Icon className="text-xl text-blue-500 dark:text-blue-400" />
        </div>
        <div>
          <h4 className="font-medium text-gray-700 dark:text-gray-300">{title}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{value}</p>
          {status !== undefined && (
            <div className={`mt-2 inline-flex items-center px-2 py-1 rounded text-sm
              ${status ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
              {status ? 'Compliant' : 'Non-Compliant'}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-2xl mx-4 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              System Details
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Machine ID: {machine.machineId}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <FiX className="text-xl text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* System Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailSection
              icon={FiHardDrive}
              title="Disk Encryption"
              value={machine.details.disk}
              status={machine.diskEncrypted}
            />
            <DetailSection
              icon={FiRefreshCw}
              title="OS Updates"
              value={machine.details.os}
              status={machine.osUpdated}
            />
            <DetailSection
              icon={FiShield}
              title="Antivirus"
              value={machine.details.antivirus}
              status={machine.antivirusActive}
            />
            <DetailSection
              icon={FiClock}
              title="Sleep Settings"
              value={`${machine.details.sleep} minutes`}
              status={machine.sleepSettingOK}
            />
          </div>

          {/* Additional Info */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
              System Information
            </h4>
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Platform: {machine.platform}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Last Updated: {machine.timestamp}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailModal;
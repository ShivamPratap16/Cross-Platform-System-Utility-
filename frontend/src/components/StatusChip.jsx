import { FiCheck, FiAlertTriangle, FiLock, FiUnlock } from 'react-icons/fi';

function StatusChip({ label, status, type }) {
  const isDiskEncryption = type === 'encryption';

  const getIcon = () => {
    if (isDiskEncryption) {
      return status ? <FiLock /> : <FiUnlock />;
    }
    return status ? <FiCheck /> : <FiAlertTriangle />;
  };

  const getText = () => {
    if (isDiskEncryption) {
      return status ? "Encrypted" : "Not Encrypted";
    }
    return status ? "OK" : "Issue";
  };

  return (
    <div className="flex justify-between items-center text-gray-900 dark:text-gray-100">
      <span className="text-sm">{label}</span>
      <span
        className={`px-2 py-1 text-xs font-semibold rounded-full flex items-center gap-1 
          ${status 
            ? "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300" 
            : "bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-300"
          }`}
      >
        {getIcon()}
        {getText()}
      </span>
    </div>
  );
}

export default StatusChip;

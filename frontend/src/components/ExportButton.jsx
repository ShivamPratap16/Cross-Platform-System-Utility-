import { useState } from 'react';
import { FiDownload, FiCheck, FiAlertCircle } from 'react-icons/fi';
import axios from 'axios';

export default function ExportButton() {
  const [exportStatus, setExportStatus] = useState('idle'); // idle, loading, success, error

  const handleExport = async () => {
    try {
      setExportStatus('loading');
      const response = await axios.get(`${import.meta.env.VITE_API_BASE}/reports/export`, {
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Get current date for filename
      const date = new Date().toISOString().split('T')[0];
      link.setAttribute('download', `system-report-${date}.csv`);
      
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      setExportStatus('success');
      setTimeout(() => setExportStatus('idle'), 2000);
    } catch (error) {
      console.error('Export failed:', error);
      setExportStatus('error');
      setTimeout(() => setExportStatus('idle'), 3000);
    }
  };

  const getButtonStyles = () => {
    const baseStyles = `
      flex items-center gap-2 px-4 py-2 rounded-lg
      transition-all duration-200 font-medium
      focus:outline-none focus:ring-2 focus:ring-offset-2
    `;

    switch (exportStatus) {
      case 'loading':
        return `${baseStyles} bg-blue-100 text-blue-700 cursor-wait`;
      case 'success':
        return `${baseStyles} bg-green-100 text-green-700`;
      case 'error':
        return `${baseStyles} bg-red-100 text-red-700`;
      default:
        return `${baseStyles} bg-blue-600 text-white hover:bg-blue-700`;
    }
  };

  const getButtonContent = () => {
    switch (exportStatus) {
      case 'loading':
        return (
          <>
            <FiDownload className="animate-bounce" />
            Exporting...
          </>
        );
      case 'success':
        return (
          <>
            <FiCheck />
            Exported!
          </>
        );
      case 'error':
        return (
          <>
            <FiAlertCircle />
            Export Failed
          </>
        );
      default:
        return (
          <>
            <FiDownload />
            Export Report
          </>
        );
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={exportStatus === 'loading'}
      className={getButtonStyles()}
    >
      {getButtonContent()}
    </button>
  );
}
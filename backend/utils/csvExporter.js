import { Parser } from 'json2csv';

export const generateCSV = (reports) => {
  const fields = [
    {
      label: 'Timestamp',
      value: 'timestamp',
      default: 'N/A'
    },
    {
      label: 'System Platform',
      value: 'platform',
      default: 'Unknown'
    },
    {
      label: 'Disk Encryption Status',
      value: 'diskEncryption',
      default: 'Not Available'
    },
    {
      label: 'OS Update Status',
      value: 'osUpdateStatus',
      default: 'Not Available'
    },
    {
      label: 'Last OS Check',
      value: 'osLastChecked',
      default: 'Never'
    },
    {
      label: 'Antivirus Status',
      value: 'antivirus',
      default: 'Not Available'
    },
    {
      label: 'Sleep Timeout (Minutes)',
      value: 'sleepTimeoutMinutes',
      default: 'Not Set'
    },
    {
      label: 'Compliance Status',
      value: row => {
        const isCompliant = 
          row.diskEncryption?.includes('BitLocker') &&
          row.antivirus === 'Enabled' &&
          row.osUpdateStatus?.includes('Up to Date') &&
          parseInt(row.sleepTimeoutMinutes || '999') <= 30;
        return isCompliant ? 'Compliant' : 'Non-Compliant';
      },
      default: 'Unknown'
    }
  ];

  const flatReports = reports.map(report => ({
    timestamp: new Date(report.timestamp).toLocaleString(),
    platform: getPlatformName(report.diskEncryption?.platform),
    diskEncryption: report.diskEncryption?.encryption,
    osUpdateStatus: report.osUpdate?.updateStatus,
    osLastChecked: report.osUpdate?.lastChecked 
      ? new Date(report.osUpdate.lastChecked).toLocaleString()
      : 'Never',
    antivirus: report.antivirus?.antivirus,
    sleepTimeoutMinutes: report.sleepSettings?.sleepTimeoutMinutes
  }));

  const json2csvParser = new Parser({ 
    fields,
    delimiter: ',',
    quote: '"',
    header: true,
    includeEmptyRows: false
  });

  return json2csvParser.parse(flatReports);
};

function getPlatformName(platform) {
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
}

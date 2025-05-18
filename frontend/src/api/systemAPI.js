import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/system';

function getPlatformName(platform) {
  switch (platform?.toLowerCase()) {
    case 'win32':
    case 'windows_nt':
      return 'win32';
    case 'darwin':
      return 'darwin';
    case 'linux':
      return 'linux';
    default:
      return platform?.toLowerCase() || 'unknown';
  }
}

export async function fetchMachineData() {
  try {
    const response = await axios.get(`${API_BASE}/reports`);
    console.log('API Response:', response.data);

    const reports = response.data.data || [];
    
    if (!Array.isArray(reports)) {
      console.error('Expected array but got:', typeof reports);
      return [];
    }

    return reports.map(report => {
      // Check for specific phrases that indicate encryption
      const encryptionStatus = report.diskEncryption?.encryption || '';
      const isEncrypted = 
        encryptionStatus.includes('BitLocker') || 
        encryptionStatus.includes('FileVault') || 
        encryptionStatus.includes('LUKS');

      // Get normalized platform
      const rawPlatform = report.diskEncryption?.platform || 
                         report.osUpdate?.platform || 
                         report.antivirus?.platform || 
                         'unknown';
      const platform = getPlatformName(rawPlatform);

      return {
        id: report._id,
        timestamp: new Date(report.timestamp).toLocaleString(),
        diskEncrypted: isEncrypted,
        osUpdated: report.osUpdate?.updateStatus?.includes('Up to Date') || false,
        antivirusActive: report.antivirus?.antivirus === 'Enabled',
        sleepSettingOK: report.sleepSettings?.sleepTimeoutMinutes !== 'Unknown',
        platform,
        details: {
          disk: report.diskEncryption?.encryption || 'Unknown',
          os: report.osUpdate?.updateStatus || 'Unknown',
          antivirus: report.antivirus?.antivirus || 'Unknown',
          sleep: report.sleepSettings?.sleepTimeoutMinutes || 'Unknown'
        }
      };
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

export async function fetchComplianceStats() {
  try {
    const response = await axios.get(`${API_BASE}/reports/stats`);
    
    // Check if we received the expected data structure
    if (!response.data?.data) {
      console.error('Unexpected API response:', response.data);
      throw new Error('Invalid API response format');
    }

    // Use the data directly from the API response
    return {
      pieData: response.data.data.pieData || [],
      lineData: response.data.data.lineData || []
    };

  } catch (error) {
    console.error("Error fetching compliance stats:", error);
    // Return default empty data structure
    return {
      pieData: [
        { name: 'Compliant', value: 0 },
        { name: 'Non-Compliant', value: 0 }
      ],
      lineData: []
    };
  }
}

export async function fetchSystemLogs(filters = {}) {
  try {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.platform !== 'all') params.append('platform', filters.platform);
    if (filters.status !== 'all') params.append('status', filters.status);
    if (filters.limit) params.append('limit', filters.limit);

    console.log('Fetching logs with params:', Object.fromEntries(params));
    const response = await axios.get(`${API_BASE}/reports?${params}`);
    
    if (!response.data?.data) {
      console.error('Unexpected API response:', response.data);
      return [];
    }

    return response.data.data.map(report => ({
      id: report._id,
      timestamp: new Date(report.timestamp).toLocaleString(),
      platform: getPlatformName(report.diskEncryption?.platform),
      diskEncrypted: report.diskEncryption?.encryption?.includes('BitLocker'),
      osUpdated: report.osUpdate?.updateStatus?.includes('Up to Date'),
      antivirusActive: report.antivirus?.antivirus === 'Enabled',
      sleepSettingOK: parseInt(report.sleepSettings?.sleepTimeoutMinutes || '999') <= 30,
      details: {
        disk: report.diskEncryption?.encryption || 'Unknown',
        os: report.osUpdate?.updateStatus || 'Unknown',
        antivirus: report.antivirus?.antivirus || 'Unknown',
        sleep: report.sleepSettings?.sleepTimeoutMinutes || 'Unknown'
      }
    }));
  } catch (error) {
    console.error("Error fetching logs:", error);
    throw error; // Let the component handle the error
  }
}

export async function exportSystemData() {
  try {
    const response = await axios.get(`${API_BASE}/reports/export`, {
      responseType: 'blob',
      headers: {
        'Accept': 'text/csv'
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error exporting data:", error);
    throw error;
  }
}

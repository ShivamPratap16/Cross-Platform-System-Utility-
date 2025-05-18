import SystemReport from '../models/systemModel.js';
import { generateCSV } from '../utils/csvExporter.js';
import { Parser } from 'json2csv';

export const getAllReports = async (req, res, next) => {
  try {
    const { platform, status, limit = 50 } = req.query;
    
    // Build query
    let query = {};
    
    if (platform) {
      query['diskEncryption.platform'] = platform;
    }
    
    if (status === 'compliant') {
      query['$and'] = [
        { 'diskEncryption.encryption': /Encrypted/ },
        { 'osUpdate.updateStatus': /Up to Date/ },
        { 'antivirus.antivirus': 'Enabled' }
      ];
    } else if (status === 'non-compliant') {
      query['$or'] = [
        { 'diskEncryption.encryption': /Not Encrypted/ },
        { 'osUpdate.updateStatus': /Outdated/ },
        { 'antivirus.antivirus': { $ne: 'Enabled' } }
      ];
    }

    const reports = await SystemReport.find(query)
      .sort({ timestamp: -1 })
      .limit(Number(limit));

    // Make sure we're sending an array in the response
    res.json({
      success: true,
      count: reports.length,
      data: reports // This should be an array
    });

  } catch (error) {
    next(error);
  }
};

export const receiveSystemReport = async (req, res, next) => {
  try {
    console.log('Received system report:', JSON.stringify(req.body, null, 2));
    
    // Validate required fields
    if (!req.body.timestamp || !req.body.diskEncryption || !req.body.osUpdate) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const report = new SystemReport(req.body);
    await report.save();
    
    res.status(201).json({
      success: true,
      message: 'System report saved successfully',
      data: report
    });
  } catch (error) {
    console.error('Error saving report:', error);
    next(error);
  }
};

export const exportReportsToCSV = async (req, res) => {
  try {
    const reports = await SystemReport.find().sort({ timestamp: -1 });
    
    const csvData = reports.map(report => ({
      timestamp: new Date(report.timestamp).toLocaleString(),
      platform: report.diskEncryption?.platform || 'Unknown',
      diskEncryption: report.diskEncryption?.encryption || 'Unknown',
      osUpdateStatus: report.osUpdate?.updateStatus || 'Unknown',
      antivirusStatus: report.antivirus?.antivirus || 'Unknown',
      sleepTimeout: report.sleepSettings?.sleepTimeoutMinutes || 'Unknown',
      compliance: getComplianceStatus(report)
    }));

    const fields = [
      'timestamp',
      'platform',
      'diskEncryption',
      'osUpdateStatus',
      'antivirusStatus',
      'sleepTimeout',
      'compliance'
    ];

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(csvData);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=system-reports.csv');
    return res.status(200).send(csv);
  } catch (error) {
    console.error('Export error:', error);
    return res.status(500).json({ message: 'Failed to export reports' });
  }
};

function getComplianceStatus(report) {
  return (
    report.diskEncryption?.encryption?.includes('BitLocker') &&
    report.osUpdate?.updateStatus?.includes('Up to Date') &&
    report.antivirus?.antivirus === 'Enabled' &&
    parseInt(report.sleepSettings?.sleepTimeoutMinutes || '999') <= 30
  ) ? 'Compliant' : 'Non-Compliant';
}

export const getComplianceStats = async (req, res, next) => {
  try {
    const reports = await SystemReport.find()
      .sort({ timestamp: -1 })
      .limit(100); // Get last 100 reports for statistics

    // Group reports by date for the last 7 days
    const last7Days = {};
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      last7Days[date.toLocaleDateString()] = {
        encryption: 0,
        antivirus: 0,
        updates: 0,
        sleep: 0,
        total: 0
      };
    }

    reports.forEach(report => {
      const date = new Date(report.timestamp).toLocaleDateString();
      if (last7Days[date]) {
        last7Days[date].total++;
        if (report.diskEncryption?.encryption?.includes('BitLocker')) last7Days[date].encryption++;
        if (report.antivirus?.antivirus === 'Enabled') last7Days[date].antivirus++;
        if (report.osUpdate?.updateStatus?.includes('Up to Date')) last7Days[date].updates++;
        if (parseInt(report.sleepSettings?.sleepTimeoutMinutes || '999') <= 30) last7Days[date].sleep++;
      }
    });

    const totalReports = reports.length;
    const compliantReports = reports.filter(report =>
      report.diskEncryption?.encryption?.includes('BitLocker') &&
      report.antivirus?.antivirus === 'Enabled' &&
      report.osUpdate?.updateStatus?.includes('Up to Date') &&
      parseInt(report.sleepSettings?.sleepTimeoutMinutes || '999') <= 30
    ).length;

    res.json({
      success: true,
      data: {
        pieData: [
          { name: 'Compliant', value: (compliantReports / totalReports) * 100 },
          { name: 'Non-Compliant', value: ((totalReports - compliantReports) / totalReports) * 100 }
        ],
        lineData: Object.entries(last7Days).map(([date, stats]) => ({
          date,
          encryption: stats.total ? (stats.encryption / stats.total) * 100 : 0,
          antivirus: stats.total ? (stats.antivirus / stats.total) * 100 : 0,
          updates: stats.total ? (stats.updates / stats.total) * 100 : 0,
          sleep: stats.total ? (stats.sleep / stats.total) * 100 : 0
        })).reverse()
      }
    });
  } catch (error) {
    next(error);
  }
};

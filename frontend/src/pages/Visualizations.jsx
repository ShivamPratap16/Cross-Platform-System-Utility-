import { useState, useEffect } from 'react';
import { Line, PieChart, Pie, ResponsiveContainer, Cell, LineChart, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { fetchComplianceStats } from '../api/systemAPI';
import { BiLoaderAlt } from 'react-icons/bi';

const COLORS = ['#4caf50', '#f44336'];

export default function Visualizations() {
  const [complianceData, setComplianceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchComplianceStats();
        setComplianceData(data);
      } catch (err) {
        setError('Failed to load compliance data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <BiLoaderAlt className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  if (error || !complianceData) {
    return (
      <div className="p-6 text-red-500 dark:text-red-400">
        {error || 'No data available'}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        System Compliance Overview
      </h2>

      {/* Pie Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Overall Compliance
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={complianceData.pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name} ${value.toFixed(1)}%`}
              >
                {complianceData.pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => value.toFixed(1) + '%'} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Line Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          7-Day Compliance Trend
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={complianceData.lineData}>
              <XAxis dataKey="date" stroke="#888" />
              <YAxis stroke="#888" domain={[0, 100]} />
              <Tooltip formatter={(value) => value.toFixed(1) + '%'} />
              <Legend />
              <Line type="monotone" dataKey="encryption" stroke="#2196f3" name="Disk Encryption" />
              <Line type="monotone" dataKey="antivirus" stroke="#4caf50" name="Antivirus" />
              <Line type="monotone" dataKey="updates" stroke="#ff9800" name="OS Updates" />
              <Line type="monotone" dataKey="sleep" stroke="#9c27b0" name="Sleep Timeout" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
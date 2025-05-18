import { useEffect, useState } from "react";
import { fetchMachineData, exportSystemData } from "../api/systemAPI";
import FilterBar from "../components/FilterBar";
import MachineCard from "../components/MachineCard";
import { FiDownload, FiServer, FiShield, FiAlertTriangle } from "react-icons/fi";
import { BiLoaderAlt } from "react-icons/bi";

function Dashboard() {
  const [machines, setMachines] = useState([]);
  const [filteredMachines, setFilteredMachines] = useState([]);
  const [filterOS, setFilterOS] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchMachineData();
        setMachines(data);
        setFilteredMachines(data);
      } catch (err) {
        setError("Failed to fetch machine data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let filtered = machines;

    if (filterOS !== "All") {
      filtered = filtered.filter(
        (m) => m.platform.toLowerCase() === filterOS.toLowerCase()
      );
    }

    if (filterStatus !== "All") {
      filtered = filtered.filter((m) => {
        const hasIssues =
          !m.diskEncrypted ||
          !m.osUpdated ||
          !m.antivirusActive ||
          !m.sleepSettingOK;
        return filterStatus === "Issues" ? hasIssues : !hasIssues;
      });
    }

    setFilteredMachines(filtered);
  }, [filterOS, filterStatus, machines]);

  const handleExportCSV = async () => {
    try {
      const data = await exportSystemData();
      const blob = new Blob([data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      const date = new Date().toISOString().split('T')[0];
      a.href = url;
      a.download = `system-report-${date}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
      setError('Failed to export data');
    }
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="text-2xl" />
        </div>
      </div>
    </div>
  );

  // Calculate statistics
  const getTotalStats = () => {
    const total = machines.length;
    const compliant = machines.filter(m => 
      m.diskEncrypted && m.osUpdated && m.antivirusActive && m.sleepSettingOK
    ).length;
    const withIssues = total - compliant;
    
    return { total, compliant, withIssues };
  };

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

  const stats = getTotalStats();

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              System Health Dashboard
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Monitor and manage your system compliance
            </p>
          </div>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg 
              hover:bg-blue-700 transition-colors duration-200"
          >
            <FiDownload />
            Export CSV
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Systems"
            value={stats.total}
            icon={FiServer}
            color="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
          />
          <StatCard
            title="Compliant Systems"
            value={stats.compliant}
            icon={FiShield}
            color="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
          />
          <StatCard
            title="Systems with Issues"
            value={stats.withIssues}
            icon={FiAlertTriangle}
            color="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
          />
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <FilterBar
            filterOS={filterOS}
            setFilterOS={setFilterOS}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
          />
        </div>

        {/* Machine Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMachines.map((machine) => (
            <MachineCard key={machine.id} machine={machine} />
          ))}
        </div>

        {filteredMachines.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
            <FiServer className="mx-auto text-4xl text-gray-400 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              No machines match the current filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchMachineData } from '../api/systemAPI';
import { BiLoaderAlt } from 'react-icons/bi';
import MachineCard from '../components/MachineCard';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q')?.toLowerCase() || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const searchData = async () => {
      setLoading(true);
      try {
        const data = await fetchMachineData();
        const filtered = data.filter(machine => 
          machine.platform.toLowerCase().includes(query) ||
          machine.details.disk.toLowerCase().includes(query) ||
          machine.details.os.toLowerCase().includes(query) ||
          machine.details.antivirus.toLowerCase().includes(query)
        );
        setResults(filtered);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      searchData();
    }
  }, [query]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <BiLoaderAlt className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Search Results for "{query}"
      </h2>
      {results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map(machine => (
            <MachineCard key={machine.id} machine={machine} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">
            No results found for your search
          </p>
        </div>
      )}
    </div>
  );
}
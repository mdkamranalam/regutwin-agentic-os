import { useState, useEffect } from 'react';
import api from '../../services/api';

interface MAP {
  _id: string;
  description: string;
  assignedTo: string;
  status: string;
  actionRequired: string;
  regulationId: {
    _id: string;
    title: string;
    source: string;
  };
}

export default function MapDashboard() {
  const [maps, setMaps] = useState<MAP[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaps = async () => {
      try {
        const response = await api.get('/maps');
        setMaps(response.data);
      } catch (error) {
        console.error('Failed to fetch MAPs', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMaps();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/maps/${id}/status`, { status: newStatus });
      setMaps((prev) =>
        prev.map((map) => (map._id === id ? { ...map, status: newStatus } : map))
      );
    } catch (error) {
      console.error('Failed to update MAP status', error);
    }
  };

  if (loading) {
    return <div className="page-center-wrapper"><p className="text-white">Loading MAPs...</p></div>;
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-6 fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">MAP Dashboard</h1>
          <p className="text-[var(--color-surface-300)]">Manage and track Measurable Action Points.</p>
        </div>
      </div>

      {maps.length === 0 ? (
        <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl">
          <p className="text-[var(--color-surface-300)]">No MAPs found. Extract MAPs from a regulation to see them here.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {maps.map((map) => (
            <div key={map._id} className="bg-white/5 border border-white/10 rounded-2xl p-6 transition-all hover:bg-white/10">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">{map.actionRequired}</h2>
                  <p className="text-sm text-[var(--color-surface-400)] mt-1">Regulation: {map.regulationId?.title || 'Unknown'}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[var(--color-surface-100)] text-[var(--color-surface-400)] border border-white/10">
                    {map.assignedTo}
                  </span>
                  <select
                    value={map.status}
                    onChange={(e) => handleStatusChange(map._id, e.target.value)}
                    className="bg-black/50 border border-white/20 text-white text-sm rounded-lg focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] block p-2"
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option value="IN_REVIEW">IN REVIEW</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </div>
              </div>

              <p className="text-[var(--color-surface-300)] mb-6 text-sm">{map.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

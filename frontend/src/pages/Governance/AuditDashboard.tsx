import { useState, useEffect } from 'react';
import api from '../../services/api';

interface Audit {
  _id: string;
  action: string;
  previousStatus?: string;
  newStatus?: string;
  evidenceText?: string;
  createdAt: string;
  regulationId: {
    title: string;
    source: string;
  };
  mapId: {
    actionRequired: string;
    assignedTo: string;
    description: string;
  };
  validationResult?: {
    is_valid: boolean;
    confidence: number;
    feedback: string;
  };
}

export default function AuditDashboard() {
  const [audits, setAudits] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAudits = async () => {
      try {
        const response = await api.get('/audits');
        setAudits(response.data);
      } catch (error) {
        console.error('Failed to fetch audits', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAudits();
  }, []);

  if (loading) {
    return <div className="page-center-wrapper"><p className="text-white">Loading governance trails...</p></div>;
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-6 fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Governance & Audit Trail</h1>
          <p className="text-[var(--color-surface-300)]">Monitor all compliance actions and automated AI validations.</p>
        </div>
      </div>

      {audits.length === 0 ? (
        <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl">
          <p className="text-[var(--color-surface-300)]">No audit trails found yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {audits.map((audit) => (
            <div key={audit._id} className="bg-white/5 border border-white/10 rounded-xl p-5">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-mono text-[var(--color-surface-400)]">
                  {new Date(audit.createdAt).toLocaleString()}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider bg-white/10 text-white uppercase">
                  {audit.action}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[var(--color-surface-400)]">Regulation</p>
                  <p className="text-white font-medium">{audit.regulationId?.title || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--color-surface-400)]">MAP Task</p>
                  <p className="text-white font-medium">{audit.mapId?.actionRequired || 'Unknown'}</p>
                </div>
              </div>

              {(audit.previousStatus || audit.newStatus) && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-sm">
                    <span className="text-[var(--color-surface-400)]">Status changed: </span>
                    <span className="text-red-400 line-through mr-2">{audit.previousStatus}</span>
                    <span className="text-green-400 font-bold">{audit.newStatus}</span>
                  </p>
                </div>
              )}

              {audit.validationResult && (
                <div className={`mt-4 p-4 rounded-lg border ${audit.validationResult.is_valid ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                  <h4 className={`text-sm font-bold mb-1 ${audit.validationResult.is_valid ? 'text-green-400' : 'text-red-400'}`}>
                    AI Validation {audit.validationResult.is_valid ? 'PASSED' : 'FAILED'} (Confidence: {audit.validationResult.confidence}%)
                  </h4>
                  <p className="text-sm text-white/80">{audit.validationResult.feedback}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

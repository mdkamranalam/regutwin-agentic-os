import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import api from '../services/api';

interface HITLRequest {
  id: string;
  regulationId: string;
  threadId: string;
  legalRisk: 'Critical' | 'High' | string;
  recommendedAction: string;
  rationale: string;
  timestamp: string;
  resolved: boolean;
  resolvedAs?: 'approved' | 'rejected';
}

const RISK_COLORS: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  Critical: {
    bg: 'rgba(239,68,68,0.08)',
    text: '#ef4444',
    border: 'rgba(239,68,68,0.25)',
    glow: '0 0 20px rgba(239,68,68,0.15)',
  },
  High: {
    bg: 'rgba(245,158,11,0.08)',
    text: '#f59e0b',
    border: 'rgba(245,158,11,0.25)',
    glow: '0 0 20px rgba(245,158,11,0.12)',
  },
};

const ACTION_LABELS: Record<string, string> = {
  APPROVE_AND_PROCEED: 'Approve & Proceed',
  ESCALATE_TO_LEGAL_TEAM: 'Escalate to Legal',
  REJECT_AND_INVESTIGATE: 'Reject & Investigate',
};

let _socket: Socket | null = null;

function getSocket(): Socket {
  if (!_socket) {
    _socket = io(import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:8000', {
      transports: ['websocket', 'polling'],
    });
  }
  return _socket;
}

export default function HumanApprovalQueue() {
  const [queue, setQueue] = useState<HITLRequest[]>([]);
  const [loading, setLoading] = useState<Record<string, 'approving' | 'rejecting' | null>>({});

  useEffect(() => {
    const socket = getSocket();

    socket.on('hitl_request', (payload: HITLRequest) => {
      setQueue((prev) => {
        // Avoid duplicates
        if (prev.find((r) => r.id === payload.id)) return prev;
        return [payload, ...prev];
      });
    });

    return () => {
      socket.off('hitl_request');
    };
  }, []);

  const handleDecision = async (request: HITLRequest, approved: boolean) => {
    const action = approved ? 'approving' : 'rejecting';
    setLoading((prev) => ({ ...prev, [request.id]: action }));

    try {
      await api.post('/internal/approve-workflow', {
        regulationId: request.regulationId,
        approved,
      });

      setQueue((prev) =>
        prev.map((r) =>
          r.id === request.id
            ? { ...r, resolved: true, resolvedAs: approved ? 'approved' : 'rejected' }
            : r
        )
      );
    } catch (err) {
      console.error('[HumanApprovalQueue] Decision failed:', err);
    } finally {
      setLoading((prev) => ({ ...prev, [request.id]: null }));
    }
  };

  const pending = queue.filter((r) => !r.resolved);
  const resolved = queue.filter((r) => r.resolved);

  if (queue.length === 0) return null;

  return (
    <div
      className="rounded-2xl p-5 space-y-4"
      style={{
        background: 'rgba(239,68,68,0.04)',
        border: '1px solid rgba(239,68,68,0.2)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🚨</span>
          <div>
            <h3 className="text-sm font-bold text-white">Human Approval Required</h3>
            <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Critical-risk regulations paused — awaiting compliance manager sign-off
            </p>
          </div>
        </div>
        {pending.length > 0 && (
          <span
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold animate-pulse"
            style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
            {pending.length} Pending
          </span>
        )}
      </div>

      {/* Pending requests */}
      {pending.map((req) => {
        const riskStyle = RISK_COLORS[req.legalRisk] || RISK_COLORS['High'];
        const isActing = loading[req.id];

        return (
          <div
            key={req.id}
            className="rounded-xl p-4 space-y-3"
            style={{
              background: riskStyle.bg,
              border: `1px solid ${riskStyle.border}`,
              boxShadow: riskStyle.glow,
            }}
          >
            {/* Risk badge + regulation ID */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider"
                  style={{ background: riskStyle.border, color: riskStyle.text }}
                >
                  {req.legalRisk} Risk
                </span>
                <span
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase"
                  style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}
                >
                  {ACTION_LABELS[req.recommendedAction] || req.recommendedAction}
                </span>
              </div>
              <span className="text-[10px] shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }}>
                {new Date(req.timestamp).toLocaleTimeString()}
              </span>
            </div>

            {/* Rationale */}
            <div
              className="rounded-lg p-3 text-xs leading-relaxed"
              style={{ background: 'rgba(0,0,0,0.2)', color: 'rgba(255,255,255,0.65)' }}
            >
              <span className="font-semibold text-white/80">Legal Counsel: </span>
              {req.rationale || 'No rationale provided by the Legal Reviewer agent.'}
            </div>

            {/* Regulation reference */}
            <p className="text-[10px] font-mono" style={{ color: 'rgba(255,255,255,0.25)' }}>
              Regulation ID: {req.regulationId}
            </p>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <button
                onClick={() => handleDecision(req, true)}
                disabled={!!isActing}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all"
                style={{
                  background: isActing === 'approving' ? 'rgba(16,185,129,0.2)' : 'rgba(16,185,129,0.15)',
                  border: '1px solid rgba(16,185,129,0.3)',
                  color: '#10b981',
                  opacity: isActing && isActing !== 'approving' ? 0.4 : 1,
                  cursor: isActing ? 'not-allowed' : 'pointer',
                }}
              >
                {isActing === 'approving' ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                    Approving...
                  </>
                ) : (
                  <>✅ Approve & Generate MAPs</>
                )}
              </button>
              <button
                onClick={() => handleDecision(req, false)}
                disabled={!!isActing}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all"
                style={{
                  background: isActing === 'rejecting' ? 'rgba(239,68,68,0.2)' : 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.25)',
                  color: '#ef4444',
                  opacity: isActing && isActing !== 'rejecting' ? 0.4 : 1,
                  cursor: isActing ? 'not-allowed' : 'pointer',
                }}
              >
                {isActing === 'rejecting' ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                    Rejecting...
                  </>
                ) : (
                  <>❌ Reject & Investigate</>
                )}
              </button>
            </div>
          </div>
        );
      })}

      {/* Resolved items (collapsed) */}
      {resolved.length > 0 && (
        <div className="space-y-2 pt-1">
          <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: 'rgba(255,255,255,0.25)' }}>
            Recently Resolved
          </p>
          {resolved.map((req) => (
            <div
              key={req.id}
              className="flex items-center justify-between px-3 py-2 rounded-lg"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Regulation {req.regulationId.slice(0, 8)}…
              </span>
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase"
                style={{
                  background:
                    req.resolvedAs === 'approved'
                      ? 'rgba(16,185,129,0.15)'
                      : 'rgba(239,68,68,0.12)',
                  color: req.resolvedAs === 'approved' ? '#10b981' : '#ef4444',
                }}
              >
                {req.resolvedAs === 'approved' ? '✅ Approved' : '❌ Rejected'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

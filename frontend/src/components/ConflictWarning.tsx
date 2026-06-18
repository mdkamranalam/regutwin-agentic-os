interface Conflict {
  regulationId: string;
  title: string;
  explanation: string;
}

interface ConflictWarningProps {
  conflicts: Conflict[];
}

export default function ConflictWarning({ conflicts }: ConflictWarningProps) {
  if (!conflicts || conflicts.length === 0) return null;

  return (
    <div className="mt-6 bg-red-500/10 border border-red-500/30 rounded-xl p-5">
      <div className="flex items-center space-x-3 mb-3">
        <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 className="text-lg font-bold text-red-500">Conflict Detected</h3>
      </div>
      <p className="text-sm text-red-200 mb-4">This regulation contradicts existing regulations in your memory bank.</p>
      <div className="grid gap-3">
        {conflicts.map((c, idx) => (
          <div key={idx} className="bg-black/40 rounded-lg p-3 border border-red-500/20">
            <h4 className="text-white font-medium text-sm mb-1">Conflicts with: {c.title}</h4>
            <p className="text-xs text-red-200/80">{c.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

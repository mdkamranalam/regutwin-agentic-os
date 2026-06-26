import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, ShieldCheck, CheckCircle2, Calendar, Sparkles } from 'lucide-react';

export default function ReportsPage() {
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingCsv, setDownloadingCsv] = useState(false);
  const [scope, setScope] = useState('Enterprise Wide');

  const handleDownloadPdf = async () => {
    setDownloadingPdf(true);
    try {
      const response = await fetch('http://localhost:8000/api/v1/reports/compliance-pdf', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        }
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ReguTwin_Compliance_Report_${Date.now()}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        alert('Failed to download PDF report. Ensure backend is running.');
      }
    } catch (e) {
      alert('Network error downloading report.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleDownloadCsv = async () => {
    setDownloadingCsv(true);
    try {
      const response = await fetch('http://localhost:8000/api/v1/reports/compliance-csv', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        }
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ReguTwin_MAP_Export_${Date.now()}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        alert('Failed to download CSV export.');
      }
    } catch (e) {
      alert('Network error downloading CSV.');
    } finally {
      setDownloadingCsv(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-widest mb-1">
          <Sparkles size={14} />
          <span>Governance & Evidence Vault</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">Regulatory Compliance Reports</h1>
        <p className="text-sm text-gray-400 mt-1">
          Generate cryptographically sealed WORM audit reports and raw MAP action exports for regulators (RBI/SEBI).
        </p>
      </div>

      {/* Scope Selector */}
      <div className="glass-card rounded-2xl p-6 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Calendar size={20} />
          </div>
          <div>
            <p className="text-white font-bold text-sm">Audit Reporting Scope</p>
            <p className="text-xs text-gray-500">Includes all monitored sources and evidence chains</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {['Enterprise Wide', 'IT Security Only', 'RBI Circulars'].map((s) => (
            <button
              key={s}
              onClick={() => setScope(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                scope === s
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                  : 'bg-white/5 text-gray-400 hover:text-white border border-white/5'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Export Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PDF Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-8 border border-emerald-500/30 relative overflow-hidden flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
          
          <div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-6 shadow-lg shadow-emerald-500/10">
              <FileText size={28} />
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-3 inline-block">
              Official Regulator Export
            </span>
            <h3 className="text-xl font-black text-white mb-2">Executive Audit Report (PDF)</h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Full executive briefing containing compliance scorecards, active regulatory inventory, MAP status breakdown, and cryptographic WORM proof seals.
            </p>
            
            <ul className="space-y-2 mb-8 text-xs text-gray-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span>Watermarked & cryptographically sealed</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span>SHA-256 evidence chain ledger included</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span>RBI Section 35A / SEBI compliance formatted</span>
              </li>
            </ul>
          </div>

          <button
            onClick={handleDownloadPdf}
            disabled={downloadingPdf}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-zinc-950 font-black text-sm shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <Download size={18} className={downloadingPdf ? 'animate-bounce' : ''} />
            <span>{downloadingPdf ? 'Compiling Ledger PDF...' : 'Download Sealed PDF Report'}</span>
          </button>
        </motion.div>

        {/* CSV Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-3xl p-8 border border-white/10 relative overflow-hidden flex flex-col justify-between"
        >
          <div>
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6">
              <Download size={28} />
            </div>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 text-xs font-bold mb-3 inline-block">
              Raw Data Dump
            </span>
            <h3 className="text-xl font-black text-white mb-2">MAP Action Matrix (CSV)</h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Raw tabular data export of all Measurable Action Points (MAPs) across all banking departments. Ideal for Excel pivot analysis or feeding into SIEM/GRC tools.
            </p>

            <ul className="space-y-2 mb-8 text-xs text-gray-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-indigo-400" />
                <span>Includes measurable acceptance criteria</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-indigo-400" />
                <span>Department & owner priority mappings</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-indigo-400" />
                <span>UTF-8 encoded for universal import</span>
              </li>
            </ul>
          </div>

          <button
            onClick={handleDownloadCsv}
            disabled={downloadingCsv}
            className="w-full py-3.5 px-6 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/10 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <Download size={18} />
            <span>{downloadingCsv ? 'Exporting CSV...' : 'Export Raw CSV Data'}</span>
          </button>
        </motion.div>
      </div>

      {/* Trust Footer */}
      <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 flex items-center justify-center gap-3 text-center">
        <ShieldCheck size={18} className="text-emerald-400" />
        <p className="text-xs text-gray-500">
          All generated reports are immutable records backed by ReguTwin Write-Once-Read-Many (WORM) storage architecture.
        </p>
      </div>
    </div>
  );
}

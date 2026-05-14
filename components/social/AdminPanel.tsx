"use client";

import React, { useEffect, useState } from "react";
import { useApp } from "@/lib/AppContext";
import { Shield, AlertTriangle, CheckCircle, Trash2, User, Clock } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { UserReport } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";

export const AdminPanel: React.FC = () => {
  const { isAdmin, setStatus } = useApp();
  const [reports, setReports] = useState<UserReport[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("user_reports")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching reports:", error);
    } else {
      setReports(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) {
      fetchReports();
    }
  }, [isAdmin]);

  const updateReportStatus = async (reportId: string, status: UserReport["status"]) => {
    if (!supabase) return;
    const { error } = await supabase
      .from("user_reports")
      .update({ status })
      .eq("id", reportId);
    
    if (error) {
      setStatus("Error updating report: " + error.message);
    } else {
      setStatus(`Report marked as ${status}`);
      fetchReports();
    }
  };

  const deleteReport = async (reportId: string) => {
    if (!supabase) return;
    const { error } = await supabase
      .from("user_reports")
      .delete()
      .eq("id", reportId);
    
    if (error) {
      setStatus("Error deleting report: " + error.message);
    } else {
      setStatus("Report deleted.");
      fetchReports();
    }
  };

  if (!isAdmin) {
    return (
      <div className="adminDenied">
        <Shield size={64} className="icon" />
        <h2>Access Restricted</h2>
        <p>This area is for OnChat moderators only.</p>
      </div>
    );
  }

  return (
    <div className="adminPanel">
      <header className="pageHeader">
        <Shield className="headerIcon" />
        <div>
          <h2>Moderation Hub</h2>
          <p>Review user reports and maintain platform safety.</p>
        </div>
      </header>

      <div className="statsRow">
        <div className="statCard">
          <AlertTriangle size={20} className="text-warning" />
          <div className="statInfo">
            <strong>{reports.filter(r => r.status === 'pending').length}</strong>
            <span>Pending Reports</span>
          </div>
        </div>
        <div className="statCard">
          <CheckCircle size={20} className="text-success" />
          <div className="statInfo">
            <strong>{reports.filter(r => r.status === 'resolved').length}</strong>
            <span>Resolved</span>
          </div>
        </div>
      </div>

      <section className="reportsTable">
        <div className="tableHeader">
          <div className="col">Reported User</div>
          <div className="col">Reason</div>
          <div className="col">Date</div>
          <div className="col">Status</div>
          <div className="col">Actions</div>
        </div>

        <div className="tableBody">
          <AnimatePresence mode="popLayout">
            {reports.length > 0 ? (
              reports.map((report) => (
                <motion.div 
                  key={report.id} 
                  className={`tableRow ${report.status}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="col userCol">
                    <User size={16} />
                    <span>{report.reported_user_id.slice(0, 8)}...</span>
                  </div>
                  <div className="col reasonCol">
                    <strong>{report.reason}</strong>
                    {report.details && <p>{report.details}</p>}
                  </div>
                  <div className="col dateCol">
                    <Clock size={14} />
                    <span>{new Date(report.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="col statusCol">
                    <span className={`statusPill ${report.status}`}>{report.status}</span>
                  </div>
                  <div className="col actionsCol">
                    <button 
                      className="btn-resolve" 
                      onClick={() => updateReportStatus(report.id, 'resolved')}
                      title="Mark as Resolved"
                    >
                      <CheckCircle size={18} />
                    </button>
                    <button 
                      className="btn-delete" 
                      onClick={() => deleteReport(report.id)}
                      title="Delete Report"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="emptyState">
                {loading ? "Loading reports..." : "No reports found. The community is behaving!"}
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <style jsx>{`
        .adminPanel {
          padding: 2rem;
          height: 100%;
          overflow-y: auto;
        }
        .pageHeader {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }
        .headerIcon {
          width: 3.5rem;
          height: 3.5rem;
          padding: 0.75rem;
          background: var(--accent-faint);
          color: var(--accent);
          border-radius: 1rem;
        }
        .statsRow {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .statCard {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem;
          background: var(--panel-bg);
          border: 1px solid var(--border);
          border-radius: 1rem;
        }
        .statInfo {
          display: flex;
          flex-direction: column;
        }
        .statInfo strong {
          font-size: 1.5rem;
          line-height: 1;
        }
        .statInfo span {
          font-size: 0.8rem;
          color: var(--muted);
        }
        .reportsTable {
          background: var(--panel-bg);
          border: 1px solid var(--border);
          border-radius: 1rem;
          overflow: hidden;
        }
        .tableHeader {
          display: grid;
          grid-template-columns: 150px 1fr 120px 100px 100px;
          padding: 1rem;
          background: var(--faint);
          font-weight: 600;
          font-size: 0.85rem;
          color: var(--muted);
          border-bottom: 1px solid var(--border);
        }
        .tableRow {
          display: grid;
          grid-template-columns: 150px 1fr 120px 100px 100px;
          padding: 1rem;
          align-items: center;
          border-bottom: 1px solid var(--border);
          transition: background 0.2s;
        }
        .tableRow:hover {
          background: rgba(255, 255, 255, 0.02);
        }
        .tableRow.resolved {
          opacity: 0.6;
        }
        .userCol {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--accent);
          font-family: monospace;
        }
        .reasonCol strong {
          display: block;
          margin-bottom: 0.25rem;
        }
        .reasonCol p {
          font-size: 0.8rem;
          color: var(--muted);
          margin: 0;
        }
        .dateCol {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.8rem;
          color: var(--muted);
        }
        .statusPill {
          padding: 0.25rem 0.5rem;
          border-radius: 2rem;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
        }
        .statusPill.pending { background: var(--warning-faint); color: var(--warning); }
        .statusPill.resolved { background: var(--success-faint); color: var(--success); }
        .actionsCol {
          display: flex;
          gap: 0.5rem;
        }
        .btn-resolve, .btn-delete {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 0.5rem;
          transition: all 0.2s;
        }
        .btn-resolve { color: var(--success); }
        .btn-resolve:hover { background: var(--success-faint); }
        .btn-delete { color: var(--danger); }
        .btn-delete:hover { background: var(--danger-faint); }
        .emptyState {
          padding: 4rem;
          text-align: center;
          color: var(--muted);
        }
        .adminDenied {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 1rem;
          color: var(--muted);
        }
        .adminDenied .icon {
          color: var(--danger);
          opacity: 0.2;
        }
        .text-warning { color: var(--warning); }
        .text-success { color: var(--success); }
      `}</style>
    </div>
  );
};

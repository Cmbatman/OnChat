"use client";

import React, { useEffect, useState } from "react";
import { 
  ShieldAlert, 
  CheckCircle, 
  XCircle, 
  Filter,
  Eye,
  Trash2,
  Lock,
  UserX
} from "lucide-react";
import { useApp } from "@/lib/AppContext";
import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";
import { BrandLogo } from "@/components/chat/UI";
import Link from "next/link";

interface UserReport {
  id: string;
  reporter_id: string;
  reported_user_id: string;
  reason: string;
  details: string;
  status: string;
  created_at: string;
  reporter_name?: string;
  reported_name?: string;
}

export default function AdminReportsPage() {
  const { isAdmin, authUser } = useApp();
  const [reports, setReports] = useState<UserReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");

  useEffect(() => {
    if (isAdmin) {
      fetchReports();
    }
  }, [isAdmin, filter]);

  const fetchReports = async () => {
    setLoading(true);
    if (!supabase) return;
    const { data, error } = await supabase
      .from("user_reports")
      .select(`
        *,
        reporter:reporter_id ( username ),
        reported:reported_user_id ( username )
      `)
      .eq("status", filter)
      .order("created_at", { ascending: false });

    if (data) {
      const formatted = data.map(r => ({
        ...r,
        reporter_name: (r.reporter as any)?.username || "Unknown",
        reported_name: (r.reported as any)?.username || "Unknown"
      }));
      setReports(formatted);
    }
    setLoading(false);
  };

  const handleAction = async (reportId: string, status: string) => {
    if (!supabase) return;
    const { error } = await supabase
      .from("user_reports")
      .update({ status })
      .eq("id", reportId);
    
    if (!error) {
      setReports(prev => prev.filter(r => r.id !== reportId));
    }
  };

  if (!isAdmin) {
    return (
      <div className="adminPanel restricted">
        <div className="container" style={{ textAlign: 'center', paddingTop: '100px' }}>
          <Lock size={64} style={{ color: 'var(--danger)', marginBottom: '24px', opacity: 0.5 }} />
          <h1>Access Restricted</h1>
          <p>This area is only for site administrators.</p>
          <Link href="/" className="btn btnPrimary" style={{ marginTop: '24px' }}>Return Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="adminPanel">
      <nav className="landingNav" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <BrandLogo />
            <div style={{ height: '24px', width: '1px', background: 'rgba(255,255,255,0.1)' }} />
            <span style={{ fontWeight: 700, fontSize: '18px', color: 'var(--danger)' }}>Admin Dashboard</span>
          </div>
          <div className="navLinks">
            <Link href="/app">Enter App</Link>
            <button onClick={() => supabase?.auth.signOut()} style={{ color: 'var(--danger)' }}>Logout</button>
          </div>
        </div>
      </nav>

      <main className="container" style={{ padding: '40px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 800 }}>User Reports</h1>
            <p style={{ color: 'var(--muted)' }}>Manage flags and community safety.</p>
          </div>
          
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '4px' }}>
            <button 
              onClick={() => setFilter("pending")}
              style={{ 
                padding: '8px 16px', 
                borderRadius: '8px', 
                fontSize: '14px',
                fontWeight: 600,
                background: filter === "pending" ? 'var(--primary)' : 'transparent',
                color: filter === "pending" ? 'white' : 'var(--muted)'
              }}
            >
              Pending
            </button>
            <button 
              onClick={() => setFilter("resolved")}
              style={{ 
                padding: '8px 16px', 
                borderRadius: '8px', 
                fontSize: '14px',
                fontWeight: 600,
                background: filter === "resolved" ? 'var(--primary)' : 'transparent',
                color: filter === "resolved" ? 'white' : 'var(--muted)'
              }}
            >
              Resolved
            </button>
            <button 
              onClick={() => setFilter("dismissed")}
              style={{ 
                padding: '8px 16px', 
                borderRadius: '8px', 
                fontSize: '14px',
                fontWeight: 600,
                background: filter === "dismissed" ? 'var(--primary)' : 'transparent',
                color: filter === "dismissed" ? 'white' : 'var(--muted)'
              }}
            >
              Dismissed
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>Loading reports...</div>
        ) : reports.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 0', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.1)' }}>
            <CheckCircle size={48} style={{ color: 'var(--success)', marginBottom: '16px', opacity: 0.5 }} />
            <h3>All clear!</h3>
            <p style={{ color: 'var(--muted)' }}>No {filter} reports to display.</p>
          </div>
        ) : (
          <div className="reportTable" style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <th style={{ textAlign: 'left', padding: '20px' }}>Reporter</th>
                  <th style={{ textAlign: 'left', padding: '20px' }}>Reported User</th>
                  <th style={{ textAlign: 'left', padding: '20px' }}>Reason</th>
                  <th style={{ textAlign: 'left', padding: '20px' }}>Date</th>
                  <th style={{ textAlign: 'right', padding: '20px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '20px' }}>
                      <div style={{ fontWeight: 600 }}>{report.reporter_name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{report.reporter_id.slice(0, 8)}</div>
                    </td>
                    <td style={{ padding: '20px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--danger)' }}>{report.reported_name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{report.reported_user_id.slice(0, 8)}</div>
                    </td>
                    <td style={{ padding: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ShieldAlert size={14} style={{ color: 'var(--warning)' }} />
                        <span style={{ fontWeight: 600 }}>{report.reason}</span>
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px' }}>{report.details}</div>
                    </td>
                    <td style={{ padding: '20px', color: 'var(--muted)', fontSize: '14px' }}>
                      {new Date(report.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '20px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button 
                          onClick={() => handleAction(report.id, "resolved")}
                          className="actionBtn" 
                          title="Resolve"
                          style={{ background: 'var(--success-glow)', color: 'var(--success)', padding: '8px', borderRadius: '8px' }}
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button 
                          onClick={() => handleAction(report.id, "dismissed")}
                          className="actionBtn" 
                          title="Dismiss"
                          style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--muted)', padding: '8px', borderRadius: '8px' }}
                        >
                          <XCircle size={18} />
                        </button>
                        <button 
                          className="actionBtn" 
                          title="Ban User"
                          style={{ background: 'var(--danger-glow)', color: 'var(--danger)', padding: '8px', borderRadius: '8px' }}
                        >
                          <UserX size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <style jsx>{`
        th { font-size: 14px; text-transform: uppercase; color: var(--muted); font-weight: 700; letter-spacing: 0.05em; }
        .actionBtn { transition: all 0.2s; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .actionBtn:hover { transform: translateY(-2px); filter: brightness(1.2); }
      `}</style>
    </div>
  );
}

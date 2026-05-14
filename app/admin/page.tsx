"use client";

import React, { useEffect, useState } from "react";
import { useApp } from "@/lib/AppContext";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { 
  Users, 
  MessageSquare, 
  ShieldAlert, 
  BarChart3, 
  Settings,
  ChevronRight,
  Search,
  Flag
} from "lucide-react";
import { BrandLogo } from "@/components/chat/UI";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminPage() {
  const { isAdmin, authUser, status } = useApp();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeRooms: 0,
    pendingReports: 0,
    dailyMessages: 0
  });
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAdminData() {
      if (!isAdmin || !supabase) return;
      
      setLoading(true);
      try {
        // Fetch stats (same as before)
        const { count: guestCount } = await supabase.from("guest_sessions").select("*", { count: "exact", head: true });
        const { count: registeredCount } = await supabase.from("registered_profiles").select("*", { count: "exact", head: true });
        const { count: roomCount } = await supabase.from("rooms").select("*", { count: "exact", head: true });

        // Fetch reports
        const { data: reportsData, count: pendingCount } = await supabase
          .from("user_reports")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(10);

        setReports(reportsData || []);

        setStats({
          totalUsers: (guestCount || 0) + (registeredCount || 0),
          activeRooms: roomCount || 0,
          pendingReports: pendingCount || 0,
          dailyMessages: 14500
        });
      } catch (err) {
        console.error("Error fetching admin data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAdminData();
    const interval = setInterval(fetchAdminData, 60000);

    let reportsChannel: any = null;

    if (supabase) {
      // Set up Realtime subscription for new reports
      reportsChannel = supabase
        .channel('admin-reports')
        .on(
          'postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'user_reports' }, 
          (payload: any) => {
            setReports(prev => [payload.new, ...prev].slice(0, 10));
            setStats(prev => ({ ...prev, pendingReports: prev.pendingReports + 1 }));
          }
        )
        .subscribe();
    }

    return () => {
      clearInterval(interval);
      if (supabase && reportsChannel) {
        supabase.removeChannel(reportsChannel);
      }
    };
  }, [isAdmin]);

  const handleReportAction = async (reportId: string, action: 'ignore' | 'investigate') => {
    try {
      if (!supabase) throw new Error("Database not connected");
      const newStatus = action === 'ignore' ? 'resolved' : 'investigating';
      const { error } = await supabase
        .from("user_reports")
        .update({ status: newStatus })
        .eq('id', reportId);

      if (error) throw error;
      
      // Update local state for immediate feedback
      setReports(prev => prev.filter(r => r.id !== reportId));
      setStats(prev => ({ 
        ...prev, 
        pendingReports: Math.max(0, prev.pendingReports - 1) 
      }));
    } catch (err) {
      console.error(`Error performing ${action} on report ${reportId}:`, err);
    }
  };

  if (!isAdmin && process.env.NODE_ENV === "production") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <ShieldAlert size={64} className="text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Access Restricted</h1>
        <p className="text-muted-foreground mb-6">You do not have permission to access the admin dashboard.</p>
        <Link href="/app" className="primaryButton px-6 py-2">Return to App</Link>
      </div>
    );
  }

  const renderTabContent = () => {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {(() => {
            switch (activeTab) {
              case "overview":
                return (
                  <div className="adminOverview">
                    <div className="statsGrid">
                      <div className="statCard">
                        <Users className="statIcon" />
                        <div className="statInfo">
                          <h3>Total Users</h3>
                          <p className="statValue">{stats.totalUsers.toLocaleString()}</p>
                          <span className="statTrend positive">+12% this week</span>
                        </div>
                      </div>
                      <div className="statCard">
                        <MessageSquare className="statIcon" />
                        <div className="statInfo">
                          <h3>Active Rooms</h3>
                          <p className="statValue">{stats.activeRooms}</p>
                          <span className="statTrend">Stable</span>
                        </div>
                      </div>
                      <div className="statCard">
                        <Flag className="statIcon text-orange-500" />
                        <div className="statInfo">
                          <h3>Pending Reports</h3>
                          <p className="statValue text-orange-500">{stats.pendingReports}</p>
                          <span className="statTrend negative">Requires action</span>
                        </div>
                      </div>
                      <div className="statCard">
                        <BarChart3 className="statIcon" />
                        <div className="statInfo">
                          <h3>Daily Messages</h3>
                          <p className="statValue">{stats.dailyMessages.toLocaleString()}</p>
                          <span className="statTrend positive">+5% vs yesterday</span>
                        </div>
                      </div>
                    </div>

                    <div className="adminGrid">
                      <div className="adminSection">
                        <div className="sectionHeader">
                          <h2>Recent Reports</h2>
                          <button className="textButton">View All</button>
                        </div>
                        <div className="reportList">
                          {reports.length > 0 ? (
                            reports.map(report => (
                              <div key={report.id} className="reportItem">
                                <div className="reportMeta">
                                  <span className="reportType">{report.reason}</span>
                                  <span className="reportTime">
                                    {new Date(report.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                                <p className="reportSnippet">{report.details || "No details provided"}</p>
                                <div className="reportActions">
                                  <button 
                                    className="softButton small" 
                                    onClick={() => handleReportAction(report.id, 'ignore')}
                                  >
                                    Ignore
                                  </button>
                                  <button 
                                    className="primaryButton small"
                                    onClick={() => handleReportAction(report.id, 'investigate')}
                                  >
                                    Investigate
                                  </button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="emptyState">No pending reports</div>
                          )}
                        </div>
                      </div>

                      <div className="adminSection">
                        <div className="sectionHeader">
                          <h2>Live Activity</h2>
                        </div>
                        <div className="activityLog">
                          <div className="logItem">
                            <span className="logTime">10:45</span>
                            <p>New room <strong>"Summer Vibes"</strong> created by <em>Axel</em></p>
                          </div>
                          <div className="logItem">
                            <span className="logTime">10:42</span>
                            <p>User <strong>"Guest_482"</strong> promoted to Premium</p>
                          </div>
                          <div className="logItem">
                            <span className="logTime">10:38</span>
                            <p>System auto-ban: <strong>"SpamBot99"</strong> (Repeated links)</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              case "users":
                return (
                  <div className="adminSection">
                    <div className="sectionHeader">
                      <h2>Registered Users</h2>
                      <div className="headerActions">
                        <button className="softButton small">Export CSV</button>
                      </div>
                    </div>
                    <div className="adminTableWrapper">
                      <table className="adminTable">
                        <thead>
                          <tr>
                            <th>User</th>
                            <th>Status</th>
                            <th>Joined</th>
                            <th>Role</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <div className="flex items-center gap-2">
                                <div className="avatar small">A</div>
                                <span>axel@onchat.app</span>
                              </div>
                            </td>
                            <td><span className="badge success">Active</span></td>
                            <td>May 10, 2026</td>
                            <td>Admin</td>
                            <td><button className="textButton">Edit</button></td>
                          </tr>
                          {/* Additional rows would be fetched here */}
                        </tbody>
                      </table>
                      <div className="p-8 text-center text-muted-foreground italic">
                        Connect database to see all {stats.totalUsers} users
                      </div>
                    </div>
                  </div>
                );
              case "reports":
                return (
                  <div className="adminSection">
                    <div className="sectionHeader">
                      <h2>Moderation Log</h2>
                      <div className="headerActions">
                        <select className="softButton small px-4 py-1">
                          <option>All Statuses</option>
                          <option>Pending</option>
                          <option>Resolved</option>
                        </select>
                      </div>
                    </div>
                    <div className="adminTableWrapper">
                      <table className="adminTable">
                        <thead>
                          <tr>
                            <th>Time</th>
                            <th>Reason</th>
                            <th>Details</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reports.map(report => (
                            <tr key={report.id}>
                              <td className="text-muted text-xs">
                                {new Date(report.created_at).toLocaleDateString()}<br/>
                                {new Date(report.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </td>
                              <td><span className="font-bold text-red-500 text-xs uppercase">{report.reason}</span></td>
                              <td className="max-w-[300px] truncate">{report.details || "-"}</td>
                              <td>
                                <span className={`badge ${report.status === 'resolved' ? 'success' : 'warning'}`}>
                                  {report.status}
                                </span>
                              </td>
                              <td>
                                {report.status === 'pending' ? (
                                  <div className="flex gap-2">
                                    <button onClick={() => handleReportAction(report.id, 'ignore')} className="textButton text-xs">Ignore</button>
                                    <button onClick={() => handleReportAction(report.id, 'investigate')} className="textButton text-xs text-blue-500">Investigate</button>
                                  </div>
                                ) : (
                                  <button className="textButton text-xs">View Details</button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {reports.length === 0 && (
                        <div className="p-12 text-center text-muted">No reports found</div>
                      )}
                    </div>
                  </div>
                );
              default:
                return <div className="p-8 text-center text-muted">Tab "{activeTab}" under development</div>;
            }
          })()}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="adminShell theme-dark">
      <aside className="adminSidebar">
        <BrandLogo />
        <div className="adminNav">
          <button 
            className={activeTab === "overview" ? "active" : ""} 
            onClick={() => setActiveTab("overview")}
          >
            <BarChart3 size={20} />
            Overview
          </button>
          <button 
            className={activeTab === "users" ? "active" : ""} 
            onClick={() => setActiveTab("users")}
          >
            <Users size={20} />
            User Management
          </button>
          <button 
            className={activeTab === "rooms" ? "active" : ""} 
            onClick={() => setActiveTab("rooms")}
          >
            <MessageSquare size={20} />
            Room Controls
          </button>
          <button 
            className={activeTab === "reports" ? "active" : ""} 
            onClick={() => setActiveTab("reports")}
          >
            <Flag size={20} />
            Moderation Log
          </button>
          <div className="navDivider" />
          <button 
            className={activeTab === "settings" ? "active" : ""} 
            onClick={() => setActiveTab("settings")}
          >
            <Settings size={20} />
            System Settings
          </button>
        </div>
        <div className="adminProfile">
          <div className="avatar">{authUser?.email?.[0].toUpperCase() || "A"}</div>
          <div className="info">
            <p className="name">{authUser?.email?.split('@')[0] || "Admin"}</p>
            <p className="role">System Administrator</p>
          </div>
        </div>
      </aside>

      <main className="adminMain">
        <header className="adminHeader">
          <div className="headerLeft">
            <h1>Dashboard Overview</h1>
          </div>
          <div className="headerRight">
            <div className="adminSearch">
              <Search size={18} />
              <input type="text" placeholder="Search users, rooms, logs..." />
            </div>
            <Link href="/app" className="softButton">Open App</Link>
          </div>
        </header>

        <div className="adminContent">
          {renderTabContent()}
        </div>
      </main>

      <style jsx>{`
        .adminShell {
          display: flex;
          min-height: 100vh;
          background: #0f1211;
          color: #f4f6f8;
        }

        .adminSidebar {
          width: 280px;
          border-right: 1px solid #333b3a;
          display: flex;
          flex-direction: column;
          padding: 24px 0;
          background: #171b1a;
        }

        .adminNav {
          flex: 1;
          padding: 32px 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .adminNav button {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border: 0;
          background: transparent;
          color: #b6bfca;
          border-radius: 8px;
          font-weight: 500;
          transition: all 0.2s ease;
          text-align: left;
        }

        .adminNav button:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
        }

        .adminNav button.active {
          background: #10b981;
          color: #fff;
        }

        .navDivider {
          height: 1px;
          background: #333b3a;
          margin: 16px 0;
        }

        .adminProfile {
          padding: 16px;
          margin: 0 16px;
          border-top: 1px solid #333b3a;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .adminProfile .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #10b981;
          display: grid;
          place-items: center;
          font-weight: 700;
        }

        .adminProfile .name {
          font-weight: 600;
          font-size: 14px;
          margin: 0;
        }

        .adminProfile .role {
          font-size: 12px;
          color: #b6bfca;
          margin: 0;
        }

        .adminMain {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .adminHeader {
          padding: 24px 32px;
          border-bottom: 1px solid #333b3a;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #171b1a;
        }

        .adminHeader h1 {
          font-size: 20px;
          font-weight: 700;
          margin: 0;
        }

        .headerRight {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .adminSearch {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #202524;
          padding: 8px 16px;
          border-radius: 100px;
          width: 300px;
        }

        .adminSearch input {
          background: transparent;
          border: 0;
          color: #fff;
          font-size: 14px;
          outline: none;
          width: 100%;
        }

        .adminContent {
          flex: 1;
          padding: 32px;
          overflow-y: auto;
        }

        .statsGrid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .statCard {
          background: #1b201f;
          padding: 24px;
          border-radius: 16px;
          border: 1px solid #333b3a;
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .statIcon {
          width: 48px;
          height: 48px;
          padding: 12px;
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
          border-radius: 12px;
        }

        .statInfo h3 {
          font-size: 14px;
          color: #b6bfca;
          margin: 0 0 4px;
        }

        .statValue {
          font-size: 24px;
          font-weight: 800;
          margin: 0 0 4px;
        }

        .statTrend {
          font-size: 12px;
          font-weight: 600;
          color: #b6bfca;
        }

        .statTrend.positive { color: #10b981; }
        .statTrend.negative { color: #ff6b6b; }

        .adminGrid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 24px;
        }

        .adminSection {
          background: #171b1a;
          border-radius: 16px;
          border: 1px solid #333b3a;
          padding: 24px;
        }

        .sectionHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .sectionHeader h2 {
          font-size: 16px;
          font-weight: 700;
          margin: 0;
        }

        .reportList {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .reportItem {
          background: #1b201f;
          padding: 16px;
          border-radius: 12px;
          border: 1px solid #333b3a;
        }

        .reportMeta {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .reportType {
          font-size: 12px;
          font-weight: 700;
          color: #ef4444;
          text-transform: uppercase;
        }

        .reportTime {
          font-size: 12px;
          color: #7f8995;
        }

        .reportSnippet {
          font-size: 14px;
          margin: 0 0 16px;
          color: #f4f6f8;
        }

        .reportActions {
          display: flex;
          gap: 8px;
        }

        .activityLog {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .logItem {
          display: flex;
          gap: 12px;
          font-size: 13px;
        }

        .logTime {
          color: #7f8995;
          font-weight: 600;
        }

        .logItem p {
          margin: 0;
          color: #b6bfca;
        }
        
        .adminTableWrapper {
          overflow-x: auto;
          margin-top: 16px;
        }

        .adminTable {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 14px;
        }

        .adminTable th {
          padding: 12px 16px;
          border-bottom: 1px solid #333b3a;
          color: #7f8995;
          font-weight: 600;
        }

        .adminTable td {
          padding: 16px;
          border-bottom: 1px solid #202524;
          vertical-align: middle;
        }

        .badge {
          padding: 4px 10px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .badge.success {
          background: rgba(22, 163, 74, 0.1);
          color: #22c55e;
        }

        .badge.warning {
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
        }

        .avatar.small {
          width: 24px;
          height: 24px;
          font-size: 10px;
        }

        .roomsGrid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .logItem strong { color: #fff; }

        @media (max-width: 1024px) {
          .adminGrid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

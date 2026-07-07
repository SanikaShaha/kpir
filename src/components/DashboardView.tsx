import { Award, Cpu, CheckCircle, TrendingUp, Calendar, ArrowRight, Activity, Terminal, Sparkles, Clock } from "lucide-react";
import { PracticalExperiment, AttendanceRecord, SystemNotification, ActivityLog } from "../types";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { motion } from "motion/react";

interface DashboardViewProps {
  experiments: PracticalExperiment[];
  attendance: AttendanceRecord[];
  notifications: SystemNotification[];
  activities: ActivityLog[];
  onNavigate: (tab: string) => void;
  onMarkNotificationRead: (id: string) => void;
}

export default function DashboardView({
  experiments,
  attendance,
  notifications,
  activities,
  onNavigate,
  onMarkNotificationRead,
}: DashboardViewProps) {
  // Statistics Computations
  const totalExperiments = experiments.length;
  const completedExperiments = experiments.filter(e => e.status === "graded" || e.status === "submitted").length;
  const gradedExperiments = experiments.filter(e => e.status === "graded");
  const averageScore = gradedExperiments.length > 0 
    ? Math.round(gradedExperiments.reduce((sum, e) => sum + (e.score || 0), 0) / gradedExperiments.length) 
    : 0;
  
  const presentCount = attendance.filter(a => a.status === "present" || a.status === "late").length;
  const attendanceRate = attendance.length > 0 ? Math.round((presentCount / attendance.length) * 100) : 100;

  // Chart Data formatters
  const progressChartData = experiments.map(e => ({
    name: e.code,
    Score: e.status === "graded" ? e.score : e.status === "submitted" ? 80 : 0,
    Status: e.status === "graded" ? "Graded" : e.status === "submitted" ? "Pending" : "Not Started"
  }));

  const attendanceChartData = attendance.slice(-5).map(a => ({
    date: a.date.substring(5), // Just MM-DD
    Status: a.status === "present" ? 100 : a.status === "late" ? 75 : 0
  }));

  const unreadNotifications = notifications.filter(n => !n.read);

  return (
    <div id="student-dashboard" className="space-y-6">
      {/* Welcome Hero Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-r from-red-800 to-red-700 rounded-2xl p-6 overflow-hidden shadow-lg border border-red-600/20"
      >
        <div className="absolute right-0 top-0 h-full w-1/3 bg-[radial-gradient(circle_at_right,rgba(251,185,34,0.15),transparent)] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-amber-300 font-semibold text-xs uppercase tracking-widest mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>Academic Workspace Online</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Somaiya Robotics Virtual Lab
            </h1>
            <p className="text-red-100 text-sm mt-1 max-w-xl">
              K J Somaiya College of Engineering's premium digital playground. Run hardware-level control scripts, simulate inverse-kinematic trajectories, and collaborate with our AI research engine.
            </p>
          </div>
          <button 
            onClick={() => onNavigate("simulator")}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-red-800 rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer whitespace-nowrap self-start md:self-auto"
          >
            <Terminal className="w-4 h-4 text-red-700" />
            <span>LAUNCH SIMULATOR</span>
          </button>
        </div>
      </motion.div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Lab Attendance Rate",
            value: `${attendanceRate}%`,
            subText: `${presentCount} of ${attendance.length} Sessions Logged`,
            icon: Calendar,
            color: "text-blue-600",
            bg: "bg-blue-50 border-blue-100/80"
          },
          {
            title: "Completed Practicals",
            value: `${completedExperiments} / ${totalExperiments}`,
            subText: `${totalExperiments - completedExperiments} Experiments Pending`,
            icon: CheckCircle,
            color: "text-red-700",
            bg: "bg-red-50 border-red-100/80"
          },
          {
            title: "Live Simulator Connections",
            value: "2 Active",
            subText: "Virtual Arm & Rover Rigs Online",
            icon: Cpu,
            color: "text-emerald-600",
            bg: "bg-emerald-50 border-emerald-100/80"
          },
          {
            title: "Cumulative Grade Score",
            value: `${averageScore} Pts`,
            subText: `Class Rank: Top 10% (Grade A+)`,
            icon: Award,
            color: "text-amber-600",
            bg: "bg-amber-50 border-amber-100/80"
          }
        ].map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-5 rounded-xl border bg-white ${stat.bg} shadow-sm flex flex-col justify-between`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.title}</p>
                <h3 className="text-2xl font-extrabold text-slate-800 mt-2">{stat.value}</h3>
              </div>
              <div className={`p-2 rounded-lg bg-slate-50 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-4 font-medium">{stat.subText}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts & Interactive Reports Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lab Performance Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-md font-bold text-slate-800 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-red-700" />
                <span>Laboratory Course Progress</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">Scores achieved across robotics modules</p>
            </div>
            <span className="text-xs font-semibold bg-red-50 text-red-700 border border-red-100 px-2.5 py-1 rounded">
              Academic Year 2026
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progressChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A92026" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#A92026" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0", borderRadius: "8px" }}
                  labelStyle={{ color: "#475569", fontWeight: "bold" }}
                  itemStyle={{ color: "#A92026" }}
                />
                <Area type="monotone" dataKey="Score" stroke="#A92026" strokeWidth={2.5} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Attendance Monitor */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-md font-bold text-slate-800 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" />
                <span>Recent Attendance Level</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">Present scores (present = 100, late = 75)</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceChartData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0", borderRadius: "8px" }}
                  itemStyle={{ color: "#2563eb" }}
                />
                <Bar dataKey="Status" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={25} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Activities, Schedule & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notifications & System Updates */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-md font-bold text-slate-800 flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-700" />
                <span>System Notifications</span>
              </h2>
              {unreadNotifications.length > 0 && (
                <span className="text-xs bg-red-700 text-white font-semibold px-2 py-0.5 rounded-full animate-pulse">
                  {unreadNotifications.length} New
                </span>
              )}
            </div>
            
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {notifications.length === 0 ? (
                <p className="text-slate-400 text-xs text-center py-8">No notifications available.</p>
              ) : (
                notifications.slice(0, 4).map((notif) => (
                  <div 
                    key={notif.id}
                    className={`p-3 rounded-lg border text-xs transition-colors relative flex gap-3 ${
                      notif.read ? "bg-slate-50 border-slate-100 text-slate-500" : "bg-red-50/50 border-red-100 text-slate-800"
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`font-bold ${notif.read ? "text-slate-600" : "text-red-800"}`}>{notif.title}</span>
                        <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">{notif.timestamp}</span>
                      </div>
                      <p className="mt-1 text-slate-500 leading-relaxed text-[11px]">{notif.message}</p>
                    </div>
                    {!notif.read && (
                      <button
                        onClick={() => onMarkNotificationRead(notif.id)}
                        className="text-[10px] text-red-700 hover:text-red-800 font-bold underline self-start cursor-pointer"
                      >
                        Dismiss
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
          <button 
            onClick={() => onNavigate("profile")}
            className="w-full mt-4 text-center text-xs font-bold text-red-700 hover:text-red-800 flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>Manage Activity Profile</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Upcoming Practical Schedules */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-md font-bold text-slate-800 flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-amber-600" />
              <span>Upcoming Lab Sessions</span>
            </h2>

            <div className="space-y-3">
              {[
                {
                  code: "R-LAB-04",
                  title: "Autonomous Pathfinding Rover",
                  date: "Tuesday, May 12",
                  time: "10:30 AM - 12:30 PM",
                  venue: "Robotics Center, 4th Floor",
                  status: "Assigned"
                },
                {
                  code: "R-LAB-05",
                  title: "Computer Vision & Object Tracking",
                  date: "Thursday, May 21",
                  time: "02:00 PM - 04:00 PM",
                  venue: "KJSCE Computer Lab 3",
                  status: "Scheduled"
                }
              ].map((sch) => (
                <div key={sch.code} className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded">
                      {sch.code}
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">{sch.status}</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-700">{sch.title}</h4>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-400 font-medium mt-1">
                      <span>{sch.date}</span>
                      <span>•</span>
                      <span>{sch.time}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">Venue: {sch.venue}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button 
            onClick={() => onNavigate("experiments")}
            className="w-full mt-4 text-center text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>View Practical Experiments</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Recent Activities Log */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-md font-bold text-slate-800 flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>Personal Activity Log</span>
            </h2>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {activities.map((act) => (
                <div key={act.id} className="flex items-start gap-3 border-b border-slate-100 pb-2.5 last:border-0 last:pb-0">
                  <div className={`p-1.5 rounded bg-slate-50 text-slate-500 mt-0.5`}>
                    <Terminal className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-600">
                      <span className="font-bold text-slate-700">{act.action}</span> - {act.target}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">{act.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button 
            onClick={() => onNavigate("simulator")}
            className="w-full mt-4 text-center text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>Run Another Simulation</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

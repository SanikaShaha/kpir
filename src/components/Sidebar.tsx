import { useState } from "react";
import {
  Cpu,
  UserCheck,
  FileText,
  Bot,
  Award,
  Users,
  Settings,
  User,
  LogOut,
  Bell,
  Sparkles,
  Menu,
  X
} from "lucide-react";
import { UserRole, UserProfile } from "../types";
import { motion } from "motion/react";
import SomaiyaLogo from "./SomaiyaLogo";

interface SidebarProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  studentProfile: UserProfile;
  onLogout: () => void;
}

export default function Sidebar({
  activeTab,
  onNavigate,
  currentRole,
  onChangeRole,
  studentProfile,
  onLogout
}: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Group of Navigation Tabs
  const baseTabs = [
    { id: "dashboard", label: "Student Dashboard", icon: Cpu },
    { id: "attendance", label: "Attendance Registry", icon: UserCheck },
    { id: "experiments", label: "Practical Experiments", icon: FileText },
    { id: "simulator", label: "Robot Simulator", icon: Cpu },
    { id: "ai", label: "AI Research Assistant", icon: Bot },
    { id: "reports", label: "Academic Reports", icon: Award },
    { id: "profile", label: "Student Profile", icon: User }
  ];

  const facultyTabs = [
    { id: "faculty", label: "Faculty Dashboard", icon: Users }
  ];

  const adminTabs = [
    { id: "admin", label: "Admin Infrastructure", icon: Settings }
  ];

  // Helper to check what role owns a tab
  const getTabCategory = (id: string): string => {
    if (id === "faculty") return "Faculty Only";
    if (id === "admin") return "Admin Only";
    return "Student Workspace";
  };

  const handleTabClick = (id: string) => {
    onNavigate(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Header bar */}
      <div id="mobile-navigation-bar" className="lg:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-2.5">
          <SomaiyaLogo sizeClassName="w-8 h-8" />
          <div>
            <h1 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-sans leading-none">Somaiya Robotics</h1>
            <span className="text-[9px] text-red-700 font-bold tracking-widest leading-none block mt-1">VIRTUAL LAB</span>
          </div>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 border border-slate-200 rounded bg-slate-50 text-slate-500 hover:text-slate-800 cursor-pointer"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Main Sidebar Wrapper */}
      <div
        id="portal-sidebar"
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200/80 p-5 flex flex-col justify-between transform transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-6">
          {/* Brand Identity logo block */}
          <div className="hidden lg:flex items-center gap-3 border-b border-slate-100 pb-5">
            <SomaiyaLogo sizeClassName="w-10 h-10" />
            <div>
              <h1 className="text-xs font-bold text-slate-800 uppercase tracking-widest leading-none">KJSCE Robotics</h1>
              <span className="text-[9px] text-red-700 font-bold tracking-widest mt-1.5 block">VIRTUAL LAB PORTAL</span>
            </div>
          </div>

          {/* Navigation Links sections */}
          <nav className="space-y-5">
            {/* Student Workspace links */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-3">Student Workspace</span>
              <div className="space-y-0.5">
                {baseTabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabClick(tab.id)}
                      className={`w-full text-left py-2 px-3.5 rounded-lg text-xs font-medium tracking-wide transition-all flex items-center gap-3 cursor-pointer ${
                        isActive
                          ? "bg-red-50/80 border-l-4 border-red-700 text-red-700 font-bold"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      <tab.icon className={`w-4 h-4 ${isActive ? "text-red-700 animate-[pulse_3s_infinite]" : "text-slate-400"}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Faculty Control Workspace */}
            <div className="space-y-1 border-t border-slate-100 pt-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-3 flex items-center gap-1.5">
                <span>Faculty Controls</span>
                {currentRole !== "faculty" && (
                  <span className="text-[8px] bg-slate-100 text-slate-500 px-1 rounded font-normal">Locked</span>
                )}
              </span>
              <div className="space-y-0.5">
                {facultyTabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  const isAccessible = currentRole === "faculty" || currentRole === "admin";
                  return (
                    <button
                      key={tab.id}
                      disabled={!isAccessible}
                      onClick={() => handleTabClick(tab.id)}
                      className={`w-full text-left py-2 px-3.5 rounded-lg text-xs font-medium tracking-wide transition-all flex items-center gap-3 cursor-pointer ${
                        isActive
                          ? "bg-red-50/80 border-l-4 border-red-700 text-red-700 font-bold"
                          : isAccessible
                          ? "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                          : "text-slate-300 cursor-not-allowed opacity-50"
                      }`}
                    >
                      <tab.icon className={`w-4 h-4 ${isActive ? "text-red-700" : isAccessible ? "text-slate-400" : "text-slate-300"}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Admin Controls */}
            <div className="space-y-1 border-t border-slate-100 pt-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-3 flex items-center gap-1.5">
                <span>Admin controls</span>
                {currentRole !== "admin" && (
                  <span className="text-[8px] bg-slate-100 text-slate-500 px-1 rounded font-normal">Locked</span>
                )}
              </span>
              <div className="space-y-0.5">
                {adminTabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  const isAccessible = currentRole === "admin";
                  return (
                    <button
                      key={tab.id}
                      disabled={!isAccessible}
                      onClick={() => handleTabClick(tab.id)}
                      className={`w-full text-left py-2 px-3.5 rounded-lg text-xs font-medium tracking-wide transition-all flex items-center gap-3 cursor-pointer ${
                        isActive
                          ? "bg-red-50/80 border-l-4 border-red-700 text-red-700 font-bold"
                          : isAccessible
                          ? "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                          : "text-slate-300 cursor-not-allowed opacity-50"
                      }`}
                    >
                      <tab.icon className={`w-4 h-4 ${isActive ? "text-red-700" : isAccessible ? "text-slate-400" : "text-slate-300"}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>
        </div>

        {/* Bottom Profile Board with Live Switcher */}
        <div className="border-t border-slate-100 pt-4 mt-6 space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-3">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block text-center">
              ACADEMIC ROLE SIMULATOR
            </span>

            {/* Select Input for roles */}
            <div className="relative">
              <select
                value={currentRole}
                onChange={(e) => {
                  const nextRole = e.target.value as UserRole;
                  onChangeRole(nextRole);
                  // Auto redirect to role tab to make it convenient
                  if (nextRole === "faculty") onNavigate("faculty");
                  else if (nextRole === "admin") onNavigate("admin");
                  else onNavigate("dashboard");
                }}
                className="w-full bg-white border border-slate-250 text-slate-700 font-medium text-xs uppercase tracking-wider rounded-lg py-1.5 px-2.5 outline-none cursor-pointer focus:border-red-700"
              >
                <option value="student">Student: Aarav Mehta</option>
                <option value="faculty">Faculty: Dr. Patil</option>
                <option value="admin">Admin: Infrastructure</option>
              </select>
            </div>
          </div>

          {/* Quick Logout Button */}
          <button
            onClick={onLogout}
            className="w-full text-left py-2 px-3.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-all flex items-center gap-3 cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-red-500" />
            <span>Lock Portal Session</span>
          </button>
        </div>
      </div>
    </>
  );
}

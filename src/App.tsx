import { useState, useEffect } from "react";
import { UserRole, UserProfile, PracticalExperiment, AttendanceRecord, SystemNotification, ActivityLog, StudentSubmission, FacultyStudentStats, ChatMessage } from "./types";
import {
  DEFAULT_STUDENT,
  INITIAL_EXPERIMENTS,
  INITIAL_ATTENDANCE,
  INITIAL_NOTIFICATIONS,
  INITIAL_ACTIVITIES,
  MOCK_STUDENTS_LIST,
  MOCK_STUDENT_SUBMISSIONS
} from "./data/mockData";

// Views
import LoginView from "./components/LoginView";
import Sidebar from "./components/Sidebar";
import DashboardView from "./components/DashboardView";
import AttendanceView from "./components/AttendanceView";
import ExperimentsView from "./components/ExperimentsView";
import SimulatorView from "./components/SimulatorView";
import AIAssistantView from "./components/AIAssistantView";
import ReportsView from "./components/ReportsView";
import FacultyView from "./components/FacultyView";
import AdminView from "./components/AdminView";
import ProfileView from "./components/ProfileView";

export default function App() {
  // Session Login state
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("kjsce_logged_in") === "true";
  });
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return (localStorage.getItem("kjsce_user_role") as UserRole) || "student";
  });
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("kjsce_active_tab") || "dashboard";
  });

  // Database / Laboratory State
  const [studentProfile, setStudentProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("kjsce_student_profile");
    return saved ? JSON.parse(saved) : DEFAULT_STUDENT;
  });

  const [experiments, setExperiments] = useState<PracticalExperiment[]>(() => {
    const saved = localStorage.getItem("kjsce_experiments");
    return saved ? JSON.parse(saved) : INITIAL_EXPERIMENTS;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem("kjsce_attendance");
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    const saved = localStorage.getItem("kjsce_notifications");
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [activities, setActivities] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem("kjsce_activities");
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  const [submissions, setSubmissions] = useState<StudentSubmission[]>(() => {
    const saved = localStorage.getItem("kjsce_submissions");
    return saved ? JSON.parse(saved) : MOCK_STUDENT_SUBMISSIONS;
  });

  const [studentsList, setStudentsList] = useState<FacultyStudentStats[]>(() => {
    const saved = localStorage.getItem("kjsce_students_list");
    return saved ? JSON.parse(saved) : MOCK_STUDENTS_LIST;
  });

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem("kjsce_chat_history");
    return saved ? JSON.parse(saved) : [];
  });

  // Selected Experiment preset for sandbox launch
  const [selectedExperimentForSandbox, setSelectedExperimentForSandbox] = useState<PracticalExperiment | null>(null);

  // Sync state to local storage to guarantee durability
  useEffect(() => {
    localStorage.setItem("kjsce_logged_in", String(isLoggedIn));
    localStorage.setItem("kjsce_user_role", currentRole);
    localStorage.setItem("kjsce_active_tab", activeTab);
    localStorage.setItem("kjsce_student_profile", JSON.stringify(studentProfile));
    localStorage.setItem("kjsce_experiments", JSON.stringify(experiments));
    localStorage.setItem("kjsce_attendance", JSON.stringify(attendance));
    localStorage.setItem("kjsce_notifications", JSON.stringify(notifications));
    localStorage.setItem("kjsce_activities", JSON.stringify(activities));
    localStorage.setItem("kjsce_submissions", JSON.stringify(submissions));
    localStorage.setItem("kjsce_students_list", JSON.stringify(studentsList));
    localStorage.setItem("kjsce_chat_history", JSON.stringify(chatHistory));
  }, [isLoggedIn, currentRole, activeTab, studentProfile, experiments, attendance, notifications, activities, submissions, studentsList, chatHistory]);

  // Auth Callbacks
  const handleLogin = (role: "student" | "faculty" | "admin") => {
    setIsLoggedIn(true);
    setCurrentRole(role);
    if (role === "faculty") {
      setActiveTab("faculty");
    } else if (role === "admin") {
      setActiveTab("admin");
    } else {
      setActiveTab("dashboard");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("kjsce_logged_in");
  };

  // Student Actions
  const handleAddAttendance = (record: AttendanceRecord) => {
    const updated = [record, ...attendance];
    setAttendance(updated);

    // Update Student profile level directly
    const presentCount = updated.filter(a => a.status === "present" || a.status === "late").length;
    const rate = Math.round((presentCount / updated.length) * 100);
    setStudentProfile((prev) => ({ ...prev, attendanceRate: rate }));

    // Append Activity Log
    const newAct: ActivityLog = {
      id: "act_" + Date.now(),
      user: studentProfile.name,
      action: "Self Logged Attendance",
      target: record.experimentTitle,
      timestamp: "Just now",
      type: "attendance"
    };
    setActivities((prev) => [newAct, ...prev]);

    // Send Notification
    const newNotif: SystemNotification = {
      id: "not_" + Date.now(),
      title: "Smart Attendance Registered",
      message: `Your presence for ${record.experimentTitle} has been logged cryptographically.`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "success",
      read: false
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleSubmitExperimentCode = (expId: string, code: string) => {
    const exp = experiments.find((e) => e.id === expId);
    if (!exp) return;

    // 1. Update status of the experiment to 'submitted'
    setExperiments((prev) =>
      prev.map((e) =>
        e.id === expId
          ? { ...e, status: "submitted", submissionCode: code, submissionDate: new Date().toISOString().split("T")[0] }
          : e
      )
    );

    // 2. Add to student submissions for Faculty grading
    const newSubmission: StudentSubmission = {
      id: "sub_" + Date.now(),
      studentName: studentProfile.name,
      rollNo: studentProfile.rollNo,
      experimentId: expId,
      experimentTitle: exp.title,
      submittedCode: code,
      submissionDate: new Date().toISOString().replace("T", " ").substring(0, 16),
      status: "pending"
    };
    setSubmissions((prev) => [newSubmission, ...prev]);

    // 3. Append Activity
    const newAct: ActivityLog = {
      id: "act_" + Date.now(),
      user: studentProfile.name,
      action: "Submitted Practical",
      target: exp.title,
      timestamp: "Just now",
      type: "experiment"
    };
    setActivities((prev) => [newAct, ...prev]);

    // 4. Trigger Notification
    const newNotif: SystemNotification = {
      id: "not_" + Date.now(),
      title: "Practical Submitted Successfully",
      message: `Your control script for ${exp.code} was processed and logged in the evaluation queue.`,
      timestamp: "Just now",
      type: "info",
      read: false
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleUpdateProfile = (profile: UserProfile) => {
    setStudentProfile(profile);
  };

  const handleAddChatMessage = (msg: ChatMessage) => {
    setChatHistory((prev) => [...prev, msg]);
  };

  const handleClearChat = () => {
    setChatHistory([]);
  };

  // Faculty Actions
  const handleGradeSubmission = (subId: string, score: number, feedback: string) => {
    const sub = submissions.find((s) => s.id === subId);
    if (!sub) return;

    // 1. Update the submissions queue
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === subId
          ? { ...s, status: "graded", grade: `${score}/100`, feedback: feedback }
          : s
      )
    );

    // 2. Update corresponding student experiment
    setExperiments((prev) =>
      prev.map((e) =>
        e.id === sub.experimentId
          ? { ...e, status: "graded", score: score, feedback: feedback }
          : e
      )
    );

    // 3. Update students roster averages
    // Recalculate average score for student profile
    const studentSubs = submissions.map((s) =>
      s.id === subId ? { ...s, status: "graded", grade: `${score}/100` } : s
    );
    const completedGraded = studentSubs.filter(s => s.status === "graded");
    const newAvg = completedGraded.length > 0
      ? Math.round(completedGraded.reduce((sum, s) => sum + parseInt(s.grade || "0"), 0) / completedGraded.length)
      : score;

    setStudentsList((prev) =>
      prev.map((s) =>
        s.name === sub.studentName
          ? {
              ...s,
              completedCount: s.completedCount + 1,
              pendingCount: Math.max(0, s.pendingCount - 1),
              averageScore: newAvg
            }
          : s
      )
    );

    // 4. Send system alert notification to student
    const newNotif: SystemNotification = {
      id: "not_" + Date.now(),
      title: "New Practical Grade Issued",
      message: `Prof. S. R. Desai graded ${sub.experimentTitle} with score: ${score}/100. Feedback: "${feedback}"`,
      timestamp: "Just now",
      type: "success",
      read: false
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // 5. Unlock next practical if score > 50
    if (sub.experimentId === "exp_01" && score >= 50) {
      setExperiments((prev) =>
        prev.map((e) => (e.id === "exp_02" && e.status === "locked" ? { ...e, status: "available" } : e))
      );
    } else if (sub.experimentId === "exp_02" && score >= 50) {
      setExperiments((prev) =>
        prev.map((e) => (e.id === "exp_03" && e.status === "locked" ? { ...e, status: "available" } : e))
      );
    } else if (sub.experimentId === "exp_03" && score >= 50) {
      setExperiments((prev) =>
        prev.map((e) => (e.id === "exp_04" && e.status === "locked" ? { ...e, status: "available" } : e))
      );
    }
  };

  // Main UI Render routing
  if (!isLoggedIn) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div id="application-container" className="min-h-screen bg-slate-50 text-slate-800 flex flex-col lg:flex-row overflow-hidden font-sans">
      {/* Sidebar navigation column */}
      <Sidebar
        activeTab={activeTab}
        onNavigate={setActiveTab}
        currentRole={currentRole}
        onChangeRole={setCurrentRole}
        studentProfile={studentProfile}
        onLogout={handleLogout}
      />

      {/* Main Contents Board */}
      <main id="portal-main-board" className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 h-screen relative bg-slate-50">
        {/* Absolute ambient lights */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* View Routing Cards */}
        <div className="relative z-10 max-w-7xl mx-auto">
          {activeTab === "dashboard" && (
            <DashboardView
              experiments={experiments}
              attendance={attendance}
              notifications={notifications}
              activities={activities}
              onNavigate={setActiveTab}
              onMarkNotificationRead={handleMarkNotificationRead}
            />
          )}

          {activeTab === "attendance" && (
            <AttendanceView
              attendance={attendance}
              onAddAttendance={handleAddAttendance}
            />
          )}

          {activeTab === "experiments" && (
            <ExperimentsView
              experiments={experiments}
              onSelectExperiment={setSelectedExperimentForSandbox}
              onNavigate={setActiveTab}
              onSubmitExperimentCode={handleSubmitExperimentCode}
            />
          )}

          {activeTab === "simulator" && (
            <SimulatorView
              selectedExperiment={selectedExperimentForSandbox}
            />
          )}

          {activeTab === "ai" && (
            <AIAssistantView
              chatHistory={chatHistory}
              onAddChatMessage={handleAddChatMessage}
              onClearChat={handleClearChat}
            />
          )}

          {activeTab === "reports" && (
            <ReportsView
              experiments={experiments}
              studentProfile={studentProfile}
            />
          )}

          {activeTab === "faculty" && (
            <FacultyView
              students={studentsList}
              submissions={submissions}
              onGradeSubmission={handleGradeSubmission}
            />
          )}

          {activeTab === "admin" && (
            <AdminView />
          )}

          {activeTab === "profile" && (
            <ProfileView
              studentProfile={studentProfile}
              onUpdateProfile={handleUpdateProfile}
            />
          )}
        </div>
      </main>
    </div>
  );
}

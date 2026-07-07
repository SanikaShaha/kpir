export type UserRole = "student" | "faculty" | "admin";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  rollNo: string;
  role: UserRole;
  department: string;
  semester: string;
  avatar: string;
  joinedDate: string;
  badges: Badge[];
  skills: SkillRating[];
  attendanceRate: number;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  color: string;
}

export interface SkillRating {
  name: string;
  level: number; // 0-100
}

export interface RobotState {
  id: string;
  name: string;
  angles: number[]; // joint angles in degrees
  jointLengths: number[]; // length of joints in pixels
  speed: number;
  status: "connected" | "offline" | "calibrating";
  error: string;
  mode: "manual" | "auto" | "inverse";
  targetX: number;
  targetY: number;
}

export interface PracticalExperiment {
  id: string;
  title: string;
  code: string; // Course/Experiment code e.g. "R-LAB-01"
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedTime: string;
  shortDescription: string;
  description: string;
  theory: string;
  objectives: string[];
  steps: string[];
  codeTemplate: string;
  solution: string;
  status: "locked" | "available" | "submitted" | "graded";
  score?: number;
  feedback?: string;
  submissionCode?: string;
  submissionDate?: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  status: "present" | "absent" | "late";
  experimentTitle: string;
  duration: string;
  facilitator: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: "info" | "success" | "warning";
  read: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface ActivityLog {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  type: "experiment" | "system" | "attendance" | "simulation";
}

// Student summaries for Faculty view
export interface StudentSubmission {
  id: string;
  studentName: string;
  rollNo: string;
  experimentId: string;
  experimentTitle: string;
  submittedCode: string;
  submissionDate: string;
  status: "pending" | "graded";
  grade?: string;
  feedback?: string;
}

export interface FacultyStudentStats {
  id: string;
  name: string;
  rollNo: string;
  attendanceRate: number;
  completedCount: number;
  pendingCount: number;
  averageScore: number;
  status: "active" | "inactive";
}

import React, { useState } from "react";
import { 
  Shield, Lock, Mail, Cpu, Terminal, Sparkles, BookOpen, MapPin, 
  Layers, Info, Award, Calendar, ChevronRight, CheckCircle, Eye, Activity, ExternalLink
} from "lucide-react";
import { motion } from "motion/react";
import SomaiyaLogo from "./SomaiyaLogo";

interface LoginViewProps {
  onLogin: (role: "student" | "faculty" | "admin") => void;
}

export default function LoginView({ onLogin }: LoginViewProps) {
  // Public website navigation state
  const [activeTab, setActiveTab] = useState<"home" | "tour" | "manuals" | "portal">("home");

  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<"student" | "faculty" | "admin">("student");
  const [isLoading, setIsLoading] = useState(false);

  // Autofill login helper
  const handleAutofill = (role: "student" | "faculty" | "admin") => {
    setSelectedRole(role);
    if (role === "student") {
      setEmail("aarav.mehta@somaiya.edu");
      setPassword("********");
    } else if (role === "faculty") {
      setEmail("nilesh.patil@somaiya.edu");
      setPassword("********");
    } else {
      setEmail("admin.robotics@somaiya.edu");
      setPassword("********");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(selectedRole);
    }, 1000);
  };

  return (
    <div id="website-container" className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      
      {/* 1. TOP ACADEMIC HEADER & BRANDING NAVIGATION BAR */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Somaiya Brand Identity */}
          <div className="flex items-center gap-3">
            <SomaiyaLogo sizeClassName="w-12 h-12" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded">KJSCE</span>
                <span className="text-[9px] font-bold text-slate-400 tracking-wider">SOMAIYA VIDYAVIHAR UNIVERSITY</span>
              </div>
              <h1 className="text-sm font-extrabold text-slate-800 uppercase tracking-tight">
                Department of Robotics &amp; Automation
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">
                Robotics Virtual Lab Academic Web Portal
              </p>
            </div>
          </div>

          {/* Interactive Website Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-1 bg-slate-100/80 p-1 rounded-xl">
            {[
              { id: "home", label: "Home Portal", icon: Info },
              { id: "tour", label: "Virtual Lab Tour", icon: Eye },
              { id: "manuals", label: "Lab Manuals", icon: BookOpen },
              { id: "portal", label: "Portal Log In", icon: Lock },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isActive 
                      ? "bg-white text-red-700 shadow-sm" 
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <tab.icon className={`w-3.5 h-3.5 ${isActive ? "text-red-700" : "text-slate-400"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

        </div>
      </header>

      {/* 2. MAIN WEBSITE BODY */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        
        {/* Decorative background vectors */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-red-100/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-amber-100/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          
          {/* ================= TAB 1: HOME PORTAL ================= */}
          {activeTab === "home" && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Hero Banner Section */}
              <div className="bg-gradient-to-br from-red-700 to-red-850 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
                <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute right-8 top-8 opacity-10">
                  <SomaiyaLogo sizeClassName="w-60 h-60" />
                </div>

                <div className="max-w-2xl space-y-4">
                  <div className="inline-flex items-center gap-1.5 bg-white/15 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border border-white/10">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                    <span>Next-Generation Virtual Engineering Rig v3.0</span>
                  </div>
                  <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight leading-tight">
                    Bridging Robotic Science with Digital Twin Mathematics
                  </h2>
                  <p className="text-white/80 text-xs md:text-sm leading-relaxed font-medium">
                    Welcome to the official virtual laboratory workspace at K J Somaiya College of Engineering. 
                    Perform exact mechanical joint kinematics modeling, tune rotary servo controller feedback, 
                    and deploy real-time path planning solvers on synced virtual micro-containers.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <button 
                      onClick={() => setActiveTab("portal")}
                      className="bg-white hover:bg-slate-100 text-red-700 font-bold text-xs px-5 py-2.5 rounded-xl shadow-md cursor-pointer transition-all uppercase tracking-wider"
                    >
                      Authenticate Student Portal
                    </button>
                    <button 
                      onClick={() => setActiveTab("tour")}
                      className="bg-red-600/50 hover:bg-red-600/70 border border-white/20 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer transition-all uppercase tracking-wider"
                    >
                      Virtual Lab Walkthrough
                    </button>
                  </div>
                </div>
              </div>

              {/* Lab Statistics & State Indicators Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Active Containers", value: "16 Online", desc: "Docker virtualizers online", color: "border-emerald-200 text-emerald-700 bg-emerald-50/50" },
                  { label: "Registered Students", value: "240+ Active", desc: "RA-302 laboratory batch", color: "border-slate-200 text-slate-700 bg-white" },
                  { label: "Academic Syllabus", value: "4 Core Units", desc: "Full kinematics curriculum", color: "border-slate-200 text-slate-700 bg-white" },
                  { label: "Core Hardware Sync", value: "3 of 4 Ready", desc: "Physical rigs synchronized", color: "border-red-200 text-red-700 bg-red-50/30" },
                ].map((stat) => (
                  <div key={stat.label} className={`p-4 border rounded-2xl shadow-sm ${stat.color}`}>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                    <h3 className="text-md font-black mt-1">{stat.value}</h3>
                    <p className="text-[10px] text-slate-500 font-semibold mt-0.5">{stat.desc}</p>
                  </div>
                ))}
              </div>

              {/* Notice Board and KIPR/Botball Corner Column */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Academic Notice Board */}
                <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-3">
                    <Calendar className="w-4 h-4 text-red-700" />
                    <span>Academic Notice Board</span>
                  </h3>
                  
                  <div className="space-y-4">
                    {[
                      { date: "05 Jul 2026", title: "Term Work Practical Submission Open", desc: "All RA-302 students are requested to complete up to EXP-03 code submissions and calculation ledgers for grading.", badge: "Crucial", badgeColor: "bg-red-100 text-red-800" },
                      { date: "28 Jun 2026", title: "DC Motor Twin Emulator v3.0 Rolled", desc: "Closed-loop DC servo emulation has been upgraded to model real frictional characteristics. Accuracy tolerance updated to 2px.", badge: "Update", badgeColor: "bg-blue-100 text-blue-800" },
                      { date: "15 Jun 2026", title: "KJSCE Robotics Hackathon Announced", desc: "Register your teams for the upcoming inter-collegiate controller optimization hackathon in mid-August.", badge: "Event", badgeColor: "bg-amber-100 text-amber-800" }
                    ].map((notice, i) => (
                      <div key={i} className="text-xs space-y-1 p-3 bg-slate-50 border border-slate-150 rounded-xl hover:bg-slate-100/55 transition-all">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-bold text-slate-400">{notice.date}</span>
                          <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded ${notice.badgeColor}`}>{notice.badge}</span>
                        </div>
                        <h4 className="font-extrabold text-slate-800 leading-snug">{notice.title}</h4>
                        <p className="text-[10px] text-slate-500 font-medium">{notice.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* KIPR College Robotics & Botball Corner */}
                <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <Cpu className="w-4.5 h-4.5 text-amber-500 animate-pulse" />
                      <span>KIPR Robotics &amp; Botball Lab Standard</span>
                    </h3>
                    <span className="text-[9px] bg-amber-50 text-amber-700 border border-amber-200 font-bold px-2 py-0.5 rounded">
                      Intercollegiate Benchmarking
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Following the elite pedagogical standards of the <strong>KIPR (Kipr.org - Kissing Institute of Practical Robotics)</strong> college curriculum, our digital environment simulates complete sensor loop registers, digital microcontrollers, and servo speed feedback models:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-2">
                      <div className="flex items-center gap-2 text-red-700 font-extrabold text-xs">
                        <Activity className="w-4 h-4" />
                        <span>Interactive Twin Engines</span>
                      </div>
                      <p className="text-[10.5px] text-slate-500 leading-relaxed font-semibold">
                        Real-time visualization mimicking absolute joint transformations, physical workspace envelopes, and collision matrices.
                      </p>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-2">
                      <div className="flex items-center gap-2 text-slate-700 font-extrabold text-xs">
                        <Terminal className="w-4 h-4" />
                        <span>Structured Code Sandbox</span>
                      </div>
                      <p className="text-[10.5px] text-slate-500 leading-relaxed font-semibold">
                        Write control scripts in standard syntax templates with on-the-fly virtual container compile cycles.
                      </p>
                    </div>
                  </div>

                  <div className="bg-amber-50/40 border border-amber-200/50 p-4 rounded-xl flex items-start gap-3">
                    <Info className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-[10.5px] text-amber-900 leading-relaxed font-semibold">
                      <strong>Department Core Values:</strong> Cultivating professional competence in kinematics modeling, embedded firmware scripting, and closed-loop controller stabilization to match global industry standards.
                    </p>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* ================= TAB 2: VIRTUAL LAB TOUR ================= */}
          {activeTab === "tour" && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="border-b border-slate-200 pb-3">
                <h2 className="text-lg font-bold text-slate-800">Laboratory Telemetry &amp; Physical Rig Twin Catalog</h2>
                <p className="text-xs text-slate-500 font-medium">Explore the hardware boards and virtual controller nodes installed in the KJSCE Robotics suite.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    name: "2-DOF Planar Link Kinematics Rig",
                    type: "Linkage Assembly & Encoders",
                    status: "ONLINE & HEALTHY",
                    statusColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
                    desc: "Interactive 2-Degrees-of-Freedom arm with rigid aluminum link segments and high-resolution optical motor encoders. Models forward and inverse trigonometric mapping matrices.",
                    spec: "L1: 150px, L2: 100px • 100% CAD Matched"
                  },
                  {
                    name: "Closed-Loop DC Servo Motor Board",
                    type: "Feedback Loop Tuner",
                    status: "ONLINE & HEALTHY",
                    statusColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
                    desc: "Rotary actuator rig with magnetic speed encoders, integrated PWM amplifiers, and adjustable proportional, integral, and derivative gain parameters.",
                    spec: "Frictional drag: Simulated • Range: 0-100V"
                  },
                  {
                    name: "Autonomous AGV Navigation Arena",
                    type: "Planar Path Solver",
                    status: "ONLINE",
                    statusColor: "text-blue-700 bg-blue-50 border-blue-200",
                    desc: "Simulated square obstacle grid utilizing virtual potential field attractive goal weights and exponential barrier obstacle forces for navigation testing.",
                    spec: "Resolution: 10x10 Grid • Laser Scan emulation"
                  },
                  {
                    name: "Industrial SCARA Assembly Rig",
                    type: "Pick & Place Robotic Arm",
                    status: "MAINTENANCE CYCLE",
                    statusColor: "text-amber-700 bg-amber-50 border-amber-200",
                    desc: "Multi-axis assembly arm rig with pneumatic suction nozzles and a USB camera module for color-based object classification.",
                    spec: "PLC Control Interfaced • Virtual Twin Calibrating"
                  }
                ].map((rig, i) => (
                  <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 hover:shadow-md transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{rig.type}</span>
                          <h3 className="text-sm font-extrabold text-slate-800 leading-snug mt-0.5">{rig.name}</h3>
                        </div>
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded border uppercase tracking-wider ${rig.statusColor}`}>
                          {rig.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed font-medium mt-3">
                        {rig.desc}
                      </p>
                    </div>

                    <div className="border-t border-slate-100 pt-3 mt-3 flex items-center justify-between text-[10px] font-bold text-slate-400">
                      <span>{rig.spec}</span>
                      <button 
                        onClick={() => setActiveTab("portal")}
                        className="text-red-700 hover:text-red-800 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>Access Lab</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ================= TAB 3: LAB MANUALS & SYLLABUS ================= */}
          {activeTab === "manuals" && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="border-b border-slate-200 pb-3">
                <h2 className="text-lg font-bold text-slate-800">Laboratory Manuals &amp; Experiment Syllabus</h2>
                <p className="text-xs text-slate-500 font-medium">Official course outline for RA-302: Robotics and Manipulator Kinematics.</p>
              </div>

              {/* Syllabus Practical Units */}
              <div className="space-y-3">
                {[
                  {
                    code: "EXP_01",
                    title: "2-DOF Forward Kinematics (FK) Analysis",
                    duration: "2 Academic Hours",
                    difficulty: "Beginner",
                    objective: "Derive planar linkage joint matrix equations and calculate coordinate points (X, Y) of the tool-tip relative to the base frame. Verify with manual trigonometry.",
                    evalWeight: "25% of Term Work"
                  },
                  {
                    code: "EXP_02",
                    title: "2-DOF Inverse Kinematics (IK) Resolvers",
                    duration: "2 Academic Hours",
                    difficulty: "Intermediate",
                    objective: "Implement geometric algebraic algorithms using Math.atan2. Evaluate multi-solution elbow configurations (elbow-up and elbow-down configurations).",
                    evalWeight: "25% of Term Work"
                  },
                  {
                    code: "EXP_03",
                    title: "DC Servo Feedback Control Loop (PID Tuning)",
                    duration: "4 Academic Hours",
                    difficulty: "Advanced",
                    objective: "Optimize Proportional, Integral, and Derivative gain parameters to reduce steady-state error offsets and eliminate oscillatory step responses.",
                    evalWeight: "25% of Term Work"
                  },
                  {
                    code: "EXP_04",
                    title: "Grid Potential Field Navigation Pathfinding",
                    duration: "4 Academic Hours",
                    difficulty: "Advanced",
                    objective: "Construct attractive vector goal forces and boundary repulsive barrier arrays to navigate a virtual rover through obstacle occupancy maps.",
                    evalWeight: "25% of Term Work"
                  }
                ].map((item, i) => (
                  <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1.5 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold bg-red-50 text-red-700 border border-red-100 px-2 py-0.5 rounded">
                          {item.code}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">Duration: {item.duration}</span>
                        <span className="text-[9px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-1.5 rounded uppercase">{item.difficulty}</span>
                      </div>
                      <h3 className="text-xs font-bold text-slate-800">{item.title}</h3>
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{item.objective}</p>
                    </div>

                    <div className="text-right shrink-0 border-t md:border-t-0 pt-2 md:pt-0 border-slate-100 w-full md:w-auto">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Weightage</p>
                      <p className="text-xs text-red-700 font-extrabold mt-0.5">{item.evalWeight}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* KJSCE Lab Assessment Rubrics */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-red-700" />
                  <span>KJSCE Term Evaluation Rubrics</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium text-slate-600">
                  <div className="p-3.5 bg-white border border-slate-150 rounded-xl space-y-1">
                    <span className="text-slate-400 text-[10px] font-bold uppercase block">1. Mathematical Lab Sheet</span>
                    <span className="text-red-700 font-black text-sm">30 Marks</span>
                    <p className="text-[10px] text-slate-500 leading-tight">Evaluation of manual trigonometry coordinate margins against simulation twin readouts.</p>
                  </div>
                  <div className="p-3.5 bg-white border border-slate-150 rounded-xl space-y-1">
                    <span className="text-slate-400 text-[10px] font-bold uppercase block">2. Script Code Compliance</span>
                    <span className="text-red-700 font-black text-sm">50 Marks</span>
                    <p className="text-[10px] text-slate-500 leading-tight">Verification of container compiler outputs, syntax compliance, and controller loop stability.</p>
                  </div>
                  <div className="p-3.5 bg-white border border-slate-150 rounded-xl space-y-1">
                    <span className="text-slate-400 text-[10px] font-bold uppercase block">3. Pre &amp; Post Viva Quizzes</span>
                    <span className="text-red-700 font-black text-sm">20 Marks</span>
                    <p className="text-[10px] text-slate-500 leading-tight">Assessment of theoretical concept comprehension via instant embedded questionnaire cycles.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ================= TAB 4: PORTAL ACCESS (LOGIN) ================= */}
          {activeTab === "portal" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto py-4">
              
              {/* Left Side: Instructions Column */}
              <div className="lg:col-span-6 space-y-5 text-slate-600">
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold text-red-700 uppercase tracking-widest bg-red-50 border border-red-100 px-2.5 py-1 rounded">
                    Somaiya Single Sign-On
                  </span>
                  <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight leading-snug">
                    Enter the Interactive Virtual Environment
                  </h2>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Use your registered Somaiya Maildrop ID (@somaiya.edu) and provided security access key to authenticate. The server will launch a dedicated compiler container cluster for your workspace.
                </p>

                <div className="space-y-3.5 font-medium text-xs">
                  <div className="flex items-start gap-3 bg-white p-3.5 border border-slate-200 rounded-xl">
                    <CheckCircle className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-slate-800">Crypotographic Session Sync</h4>
                      <p className="text-[10px] text-slate-400 leading-tight">Local storage automatically keeps session records secure and durable across reloads.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-white p-3.5 border border-slate-200 rounded-xl">
                    <CheckCircle className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-slate-800">Academic Grading Link</h4>
                      <p className="text-[10px] text-slate-400 leading-tight">Submissions automatically queue into Prof. Desai's evaluation ledger for quick feedback.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50/50 border border-amber-200/50 p-4 rounded-xl text-[10.5px] text-amber-900 leading-relaxed font-semibold">
                  <strong>Technical Simulation Note:</strong> For local verification, you can click on the role profile tabs below the login form to auto-authenticate in mock student, faculty, or system administrator views instantly.
                </div>
              </div>

              {/* Right Side: Elegant Login Form Card */}
              <div className="lg:col-span-6">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-xl space-y-6"
                >
                  {/* Small Logo Badge */}
                  <div className="text-center space-y-2">
                    <div className="flex justify-center">
                      <SomaiyaLogo sizeClassName="w-16 h-16" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                      Academic Credentials Authentication
                    </h3>
                  </div>

                  {/* Role Selection Tabs */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider text-center">
                      Select Virtual Profile
                    </label>
                    <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-xl">
                      {(["student", "faculty", "admin"] as const).map((role) => (
                        <button
                          key={role}
                          type="button"
                          onClick={() => handleAutofill(role)}
                          className={`py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            selectedRole === role
                              ? "bg-red-700 text-white shadow"
                              : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase tracking-wider">
                        Somaiya Mail ID
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-slate-400">
                          <Mail className="w-4 h-4" />
                        </span>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="student@somaiya.edu"
                          className="w-full bg-slate-50 border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-lg py-2 pl-9 pr-4 text-xs font-semibold placeholder-slate-400 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase tracking-wider">
                        Security Passkey
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-slate-400">
                          <Lock className="w-4 h-4" />
                        </span>
                        <input
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full bg-slate-50 border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-lg py-2 pl-9 pr-4 text-xs font-semibold placeholder-slate-400 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold pt-1">
                      <span className="flex items-center gap-1">
                        <Shield className="w-3.5 h-3.5 text-emerald-600" />
                        Secure Sandbox Session
                      </span>
                      <button type="button" className="hover:text-red-700 transition-colors cursor-pointer">
                        Reset Key
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full mt-4 bg-red-700 hover:bg-red-800 text-white font-extrabold py-2.5 px-4 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider text-xs"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Initializing Containers...</span>
                        </>
                      ) : (
                        <>
                          <Terminal className="w-3.5 h-3.5" />
                          <span>Acknowledge Identity</span>
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              </div>

            </div>
          )}

        </div>
      </main>

      {/* 3. ACADEMIC WEB FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-400 font-medium">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <div className="flex flex-wrap items-center justify-center gap-2.5 text-slate-500 font-bold">
            <span className="flex items-center gap-1.5 text-red-700 uppercase tracking-wider text-[10px] bg-red-50 px-2 py-0.5 rounded border border-red-100">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span>Somaiya Virtual Lab Portal</span>
            </span>
            <span>•</span>
            <span>Academic Term 2026</span>
            <span>•</span>
            <span>Vidyavihar Campus, Mumbai</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
            Copyright &copy; 2026 K J Somaiya College of Engineering. All rights reserved. Built according to highest inter-collegiate robotics guidelines.
          </p>
        </div>
      </footer>

    </div>
  );
}

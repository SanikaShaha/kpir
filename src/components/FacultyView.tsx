import React, { useState } from "react";
import { Users, FileText, CheckCircle, Sliders, Edit3, Award, MessageSquare, ShieldAlert } from "lucide-react";
import { FacultyStudentStats, StudentSubmission } from "../types";
import { motion } from "motion/react";

interface FacultyViewProps {
  students: FacultyStudentStats[];
  submissions: StudentSubmission[];
  onGradeSubmission: (id: string, score: number, feedback: string) => void;
}

export default function FacultyView({ students, submissions, onGradeSubmission }: FacultyViewProps) {
  const [selectedSubId, setSelectedSubId] = useState<string | null>(null);
  const [gradeInput, setGradeInput] = useState(90);
  const [feedbackInput, setFeedbackInput] = useState("");
  const [activeTab, setActiveTab] = useState<"submissions" | "roster">("submissions");

  const pendingSubmissions = submissions.filter((s) => s.status === "pending");
  const gradedSubmissions = submissions.filter((s) => s.status === "graded");

  const selectedSub = submissions.find((s) => s.id === selectedSubId);

  const handleOpenGrading = (sub: StudentSubmission) => {
    setSelectedSubId(sub.id);
    setGradeInput(90);
    setFeedbackInput("");
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubId) return;

    onGradeSubmission(selectedSubId, gradeInput, feedbackInput);
    setSelectedSubId(null);
  };

  return (
    <div id="faculty-portal" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-850 flex items-center gap-2">
            <Users className="w-5 h-5 text-red-700" />
            <span>Faculty Laboratory Management</span>
          </h1>
          <p className="text-slate-500 text-xs font-medium mt-0.5">Academic grading registry and experimental tracking matrices</p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-200 self-start sm:self-auto font-bold text-xs">
          <button
            onClick={() => setActiveTab("submissions")}
            className={`px-3.5 py-1.5 rounded-lg cursor-pointer ${
              activeTab === "submissions" ? "bg-red-700 text-white font-bold" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            SUBMISSIONS QUEUE ({pendingSubmissions.length})
          </button>
          <button
            onClick={() => setActiveTab("roster")}
            className={`px-3.5 py-1.5 rounded-lg cursor-pointer ${
              activeTab === "roster" ? "bg-red-700 text-white font-bold" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            CLASS ROSTER ({students.length})
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Enrolled Students", value: `${students.length} Active`, sub: "Robotics and Automation Batch B", icon: Users, color: "text-red-700" },
          { label: "Pending Evaluations", value: `${pendingSubmissions.length} Scripts`, sub: "Unresolved student lab submissions", icon: FileText, color: "text-amber-600" },
          { label: "Class Average Score", value: "88.4%", sub: "High performance threshold met", icon: Award, color: "text-emerald-600" },
          { label: "Active Lab Schedulers", value: "4 Rooms", sub: "KJSCE Lab schedules synced", icon: Sliders, color: "text-blue-650" }
        ].map((stat) => (
          <div key={stat.label} className="p-4 bg-white border border-slate-200 rounded-xl flex items-center gap-4 shadow-sm">
            <div className={`p-2.5 rounded-lg bg-slate-50 border border-slate-100 ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-lg font-extrabold text-slate-800 mt-0.5">{stat.value}</h3>
              <p className="text-[10px] text-slate-500 font-medium">{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {activeTab === "submissions" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Submissions Queue List */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-1.5">
              <FileText className="w-4.5 h-4.5 text-red-700" />
              <span>Laboratory Submissions Queue</span>
            </h2>

            <div className="space-y-3">
              {submissions.length === 0 ? (
                <p className="text-slate-400 text-xs font-bold text-center py-8">No student submissions logged.</p>
              ) : (
                submissions.map((sub) => (
                  <div
                    key={sub.id}
                    className={`p-4 bg-white border rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                      sub.id === selectedSubId 
                        ? "border-red-700 shadow-sm" 
                        : sub.status === "graded" 
                        ? "border-slate-100 opacity-60 bg-slate-50/50" 
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-bold bg-red-50 text-red-700 border border-red-100 px-1.5 py-0.5 rounded">
                          {sub.rollNo}
                        </span>
                        <span className="text-xs font-bold text-slate-850">{sub.studentName}</span>
                      </div>
                      <h4 className="text-xs font-semibold text-slate-600">{sub.experimentTitle}</h4>
                      <span className="text-[10px] text-slate-400 font-medium mt-1 block">Submitted: {sub.submissionDate}</span>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto font-bold text-xs">
                      {sub.status === "graded" ? (
                        <span className="text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded">
                          GRADED ({sub.grade})
                        </span>
                      ) : (
                        <button
                          onClick={() => handleOpenGrading(sub)}
                          className="px-3.5 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded cursor-pointer font-bold uppercase text-[11px] tracking-wide shadow-sm"
                        >
                          EVALUATE SCRIPT
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Grading Pane */}
          <div className="lg:col-span-5">
            {selectedSub ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border-2 border-red-700/20 rounded-2xl p-5 shadow-sm space-y-4"
              >
                <div>
                  <h3 className="text-xs font-bold text-red-700 uppercase tracking-widest">SCRIPT EVALUATION WORKBENCH</h3>
                  <h4 className="text-sm font-bold text-slate-800 mt-2">{selectedSub.studentName}</h4>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">{selectedSub.experimentTitle}</p>
                </div>

                {/* Code viewport */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Submitted Student Code</span>
                  <pre className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[9.5px] font-mono text-slate-700 overflow-x-auto max-h-48 overflow-y-auto">
                    {selectedSub.submittedCode}
                  </pre>
                </div>

                {/* Grading Form */}
                <form onSubmit={handleSaveGrade} className="space-y-4 border-t border-slate-100 pt-4">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-600">Assign Score (Points)</span>
                      <span className="text-red-700 font-bold">{gradeInput}/100</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={gradeInput}
                      onChange={(e) => setGradeInput(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-red-600"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">CONSTRUCTIVE FEEDBACK</label>
                    <textarea
                      required
                      rows={3}
                      value={feedbackInput}
                      onChange={(e) => setFeedbackInput(e.target.value)}
                      placeholder="e.g. Code structure is perfect. Kinematics calculations conform exactly to expected values. Well done."
                      className="w-full bg-slate-50 border border-slate-200 focus:border-red-650 rounded-lg p-2.5 text-xs text-slate-800 placeholder-slate-400 outline-none resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setSelectedSubId(null)}
                      className="px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-700 rounded cursor-pointer transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded font-bold cursor-pointer transition-colors"
                    >
                      COMMIT GRADE
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <div className="h-full bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center text-slate-400 flex flex-col justify-center items-center gap-3 shadow-inner min-h-[250px]">
                <Sliders className="w-10 h-10 text-slate-300" />
                <div>
                  <h4 className="text-xs font-bold text-slate-600">Select Script for Grading</h4>
                  <p className="text-[11px] text-slate-500 max-w-xs mt-1 leading-normal font-medium">
                    Click 'Evaluate Script' on any incoming queue item to load the code, check calculations, and write student grades.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Class Roster view */
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-1.5">
            <Users className="w-4.5 h-4.5 text-red-700" />
            <span>Active Student Class Roster (Third Year Batch)</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 font-bold text-[10px] text-slate-400 uppercase">
                  <th className="py-2.5 px-3">Roll Number</th>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Attendance Rate</th>
                  <th className="py-2.5 px-3">Completed Labs</th>
                  <th className="py-2.5 px-3">Average Score</th>
                  <th className="py-2.5 px-3 text-right">Activity Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                {students.map((std) => (
                  <tr key={std.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-3 font-bold text-red-700">{std.rollNo}</td>
                    <td className="py-3 px-3 font-bold text-slate-800">{std.name}</td>
                    <td className="py-3 px-3 font-semibold">{std.attendanceRate}%</td>
                    <td className="py-3 px-3">{std.completedCount} Modules completed</td>
                    <td className="py-3 px-3 font-bold">{std.averageScore} Pts</td>
                    <td className="py-3 px-3 text-right">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        std.status === "active"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : "bg-slate-100 text-slate-400 border border-slate-200"
                      }`}>
                        {std.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

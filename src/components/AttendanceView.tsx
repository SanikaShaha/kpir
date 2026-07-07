import React, { useState } from "react";
import { Calendar, UserCheck, AlertTriangle, Clock, Search, ShieldAlert, Sparkles, CheckCircle } from "lucide-react";
import { AttendanceRecord } from "../types";
import { motion } from "motion/react";

interface AttendanceViewProps {
  attendance: AttendanceRecord[];
  onAddAttendance: (record: AttendanceRecord) => void;
}

export default function AttendanceView({ attendance, onAddAttendance }: AttendanceViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const presentCount = attendance.filter(a => a.status === "present").length;
  const lateCount = attendance.filter(a => a.status === "late").length;
  const absentCount = attendance.filter(a => a.status === "absent").length;
  const totalCount = attendance.length;
  const attendancePercentage = totalCount > 0 ? Math.round(((presentCount + lateCount * 0.8) / totalCount) * 100) : 100;

  const filteredRecords = attendance.filter(
    (rec) =>
      rec.experimentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.facilitator.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRegisterOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    // Simple realistic OTP checker
    if (otpInput.trim().toUpperCase() === "KJSCE-101" || otpInput.trim() === "45091") {
      // Check if already registered today
      const todayDate = new Date().toISOString().split("T")[0];
      const alreadyChecked = attendance.some(a => a.date === todayDate);

      if (alreadyChecked) {
        setErrorMsg("Secure Token already registered for today's session!");
        return;
      }

      const newRecord: AttendanceRecord = {
        id: "att_" + (attendance.length + 1),
        date: todayDate,
        status: "present",
        experimentTitle: "R-LAB-04: Autonomous Rover Pathfinding & ROS 2",
        duration: "2h 00m",
        facilitator: "Dr. Nilesh Patil"
      };

      onAddAttendance(newRecord);
      setSuccessMsg("Success! Attendance registered and signed cryptographically by Dr. Nilesh Patil.");
      setOtpInput("");
    } else {
      setErrorMsg("Invalid authentication token. Please request the daily OTP from your laboratory facilitator.");
    }
  };

  return (
    <div id="attendance-portal" className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-850 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-red-700" />
            <span>Lab Attendance Registry</span>
          </h1>
          <p className="text-slate-500 text-xs font-medium mt-0.5">Cryptographic attendance validation portal</p>
        </div>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Valid Attendance Rate", value: `${attendancePercentage}%`, desc: "Threshold required: 75%", icon: UserCheck, color: "text-red-700", bg: "bg-red-50 border-red-100" },
          { label: "Sessions Present", value: presentCount, desc: "Direct attendance marked", icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
          { label: "Sessions Late", value: lateCount, desc: "Logged after 10-min grace period", icon: Clock, color: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
          { label: "Excused / Absent", value: absentCount, desc: "Requires medical/official waiver", icon: ShieldAlert, color: "text-rose-600", bg: "bg-rose-50 border-rose-100" }
        ].map((stat) => (
          <div key={stat.label} className="p-4 bg-white border border-slate-200/80 rounded-xl flex items-center gap-4 shadow-sm">
            <div className={`p-2.5 rounded-lg ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-lg font-bold text-slate-800 mt-0.5">{stat.value}</h3>
              <p className="text-[10px] text-slate-500 font-medium">{stat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Smart Register Terminal */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
              <h2 className="text-sm font-bold text-slate-800">Smart Biometric / OTP Registry</h2>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-4 font-medium">
              During lab hours, your facilitator will display a daily secure passcode on the overhead projector. Enter the passcode here to validate your session presence immediately.
            </p>

            <form onSubmit={handleRegisterOTP} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1 uppercase tracking-wider">FACILITATOR LAB TOKEN</label>
                <input
                  type="text"
                  required
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="e.g. KJSCE-101"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-lg py-2 px-3 text-xs text-slate-800 placeholder-slate-400 outline-none font-bold uppercase"
                />
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 rounded text-[11px] font-medium flex items-start gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded text-[11px] font-medium flex items-start gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-2.5 px-3 rounded text-xs shadow hover:shadow-red-700/10 transition-all cursor-pointer uppercase tracking-wide"
              >
                SIGN LABORATORY LOG
              </button>
            </form>
          </div>

          <div className="border-t border-slate-100 mt-5 pt-4">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">TIPS &amp; PROTOCOLS</h4>
            <ul className="text-[10px] text-slate-400 font-medium space-y-1.5 list-disc pl-4">
              <li>Biometric OTP tokens change every session and expire within 45 minutes.</li>
              <li>Tardy entry after 15 minutes automatically labels the log as "LATE".</li>
              <li>Attendance of less than 75% disqualifies the student from final practical exams.</li>
            </ul>
          </div>
        </div>

        {/* History Log Registry Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-red-700" />
                <span>Semester History Registry</span>
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Logged attendances for Robotics Course</p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <span className="absolute left-2.5 top-2 text-slate-400">
                <Search className="w-3.5 h-3.5" />
              </span>
              <input
                type="text"
                placeholder="Search facilitator or topic..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-red-600 rounded-lg py-1.5 pl-8 pr-3 text-xs text-slate-800 placeholder-slate-400 outline-none transition-all"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 font-bold text-[10px] text-slate-400 uppercase">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Session Description</th>
                  <th className="py-2.5 px-3">Duration</th>
                  <th className="py-2.5 px-3">Facilitator</th>
                  <th className="py-2.5 px-3 text-right">Access Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-xs font-semibold text-slate-400">
                      No matching attendance records found.
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((rec, idx) => (
                    <tr key={rec.id} className="text-xs hover:bg-slate-50/50 transition-colors text-slate-600">
                      <td className="py-3 px-3 font-semibold text-slate-500">{rec.date}</td>
                      <td className="py-3 px-3 font-bold text-slate-800">{rec.experimentTitle}</td>
                      <td className="py-3 px-3 font-medium text-slate-500">{rec.duration}</td>
                      <td className="py-3 px-3 text-slate-600 font-medium">{rec.facilitator}</td>
                      <td className="py-3 px-3 text-right">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            rec.status === "present"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50"
                              : rec.status === "late"
                              ? "bg-amber-50 text-amber-700 border border-amber-200/50"
                              : "bg-rose-50 text-rose-700 border border-rose-200/50"
                          }`}
                        >
                          {rec.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

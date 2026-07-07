import React, { useState } from "react";
import { User, Award, CheckCircle, Mail, BookOpen, Clock, Cpu, Settings, ShieldCheck, Camera } from "lucide-react";
import { UserProfile } from "../types";
import { motion } from "motion/react";

interface ProfileViewProps {
  studentProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
}

export default function ProfileView({ studentProfile, onUpdateProfile }: ProfileViewProps) {
  const [name, setName] = useState(studentProfile.name);
  const [email, setEmail] = useState(studentProfile.email);
  const [department, setDepartment] = useState(studentProfile.department);
  const [semester, setSemester] = useState(studentProfile.semester);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(false);

    const updated = {
      ...studentProfile,
      name,
      email,
      department,
      semester
    };

    onUpdateProfile(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div id="profile-portal" className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-xl md:text-2xl font-bold text-slate-850 flex items-center gap-2">
          <User className="w-5 h-5 text-red-700" />
          <span>Student Research Profile</span>
        </h1>
        <p className="text-slate-500 text-xs font-medium mt-0.5">Academic milestones, skill graphs, and secure user preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Academic Identity & Badges (Span 5) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Identity card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-center space-y-4 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-800 to-red-600" />
            
            {/* Avatar block */}
            <div className="relative w-20 h-20 mx-auto">
              <img
                src={studentProfile.avatar}
                alt={studentProfile.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-2xl border-2 border-red-700/20 shadow shadow-red-100"
              />
              <span className="absolute -bottom-1 -right-1 p-1.5 bg-white border border-slate-200 text-slate-500 rounded-lg cursor-pointer hover:text-red-700 transition-colors shadow-sm">
                <Camera className="w-3.5 h-3.5" />
              </span>
            </div>

            <div>
              <h3 className="text-md font-bold text-slate-800 tracking-tight">{studentProfile.name}</h3>
              <p className="text-xs text-red-700 font-bold mt-0.5">{studentProfile.rollNo}</p>
            </div>

            <div className="border-t border-slate-100 pt-4 text-xs font-medium text-left space-y-2 text-slate-500">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-slate-400" />
                <span>Dept: {studentProfile.department}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Term: {studentProfile.semester}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>Email: {studentProfile.email}</span>
              </div>
            </div>
          </div>

          {/* Badges card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
              <Award className="w-4.5 h-4.5 text-red-700" />
              <span>Academic Milestones Unlocked</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {studentProfile.badges.map((badge) => (
                <div
                  key={badge.id}
                  className="p-3 bg-slate-50 border border-slate-200 hover:border-red-600/20 rounded-xl text-center flex flex-col items-center justify-between gap-2 group transition-all shadow-sm"
                >
                  <div className="w-9 h-9 bg-red-50 rounded-full flex items-center justify-center text-red-700 border border-red-200">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-700 leading-snug uppercase">{badge.title}</h4>
                    <p className="text-[8.5px] text-slate-400 leading-tight mt-0.5">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Skill Chart & Profile Settings (Span 7) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Skill Radar Indicators */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
              <Cpu className="w-4.5 h-4.5 text-red-700 animate-pulse" />
              <span>Laboratory Skill Indexes</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {studentProfile.skills.map((skill) => (
                <div key={skill.name} className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                    <span>{skill.name}</span>
                    <span className="text-red-700">{skill.level}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div className="h-full bg-gradient-to-r from-red-700 to-red-800 rounded-full" style={{ width: `${skill.level}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Account Profile Settings */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-1.5">
              <Settings className="w-4.5 h-4.5 text-red-700" />
              <span>Identity Profile Settings</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold text-slate-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase block mb-1">Student Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-red-600 rounded-lg py-2 px-3 text-slate-800 placeholder-slate-400 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase block mb-1">academic Mail Drop</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-red-600 rounded-lg py-2 px-3 text-slate-800 placeholder-slate-400 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase block mb-1">Department Field</label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-red-600 rounded-lg py-2 px-3 text-slate-800 placeholder-slate-400 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase block mb-1">Academic Term (Semester)</label>
                  <input
                    type="text"
                    required
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-red-600 rounded-lg py-2 px-3 text-slate-800 placeholder-slate-400 outline-none"
                  />
                </div>
              </div>

              {saveSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-lg flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Profile variables updated and committed safely to Somaiya Registry!</span>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="bg-red-700 hover:bg-red-800 text-white font-bold py-2.5 px-4 rounded shadow transition-all cursor-pointer uppercase tracking-wider text-xs"
                >
                  SAVE PROFILE VARIABLES
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

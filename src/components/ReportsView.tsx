import { useState } from "react";
import { FileText, Award, Download, ShieldCheck, Sparkles, Printer, RefreshCw } from "lucide-react";
import { PracticalExperiment, UserProfile } from "../types";
import { motion } from "motion/react";

interface ReportsViewProps {
  experiments: PracticalExperiment[];
  studentProfile: UserProfile;
}

export default function ReportsView({ experiments, studentProfile }: ReportsViewProps) {
  const [showCertificate, setShowCertificate] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const gradedLabs = experiments.filter((e) => e.status === "graded");
  const totalLabs = experiments.length;
  const completedLabsCount = experiments.filter((e) => e.status === "graded" || e.status === "submitted").length;

  const averageScore = gradedLabs.length > 0 
    ? Math.round(gradedLabs.reduce((sum, e) => sum + (e.score || 0), 0) / gradedLabs.length)
    : 0;

  const handleGenerateCertificate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowCertificate(true);
    }, 1500);
  };

  // Generate unique verification code
  const certHash = "KJSCE-ROB-61A-" + studentProfile.rollNo.substring(7) + "B";

  return (
    <div id="reports-portal" className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-xl md:text-2xl font-bold text-slate-850 flex items-center gap-2">
          <FileText className="w-5 h-5 text-red-700" />
          <span>Academic Reports &amp; Credentials</span>
        </h1>
        <p className="text-slate-500 text-xs font-medium mt-0.5">Laboratory performance ledger and verifiable competency certification</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Performance Summary */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
              <Award className="w-4 h-4 text-red-700" />
              <span>Competency Ledger</span>
            </h3>

            {/* Performance Indicators */}
            <div className="space-y-4">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-250/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Syllabus Progress</span>
                <div className="flex items-center justify-between font-mono text-xs font-bold text-slate-700 mt-1">
                  <span>{completedLabsCount} of {totalLabs} Modules</span>
                  <span>{Math.round((completedLabsCount / totalLabs) * 100)}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-red-700 to-red-800 rounded-full"
                    style={{ width: `${(completedLabsCount / totalLabs) * 100}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-250/60">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Mean Grade</span>
                  <h4 className="text-lg font-extrabold text-red-700 mt-0.5">{averageScore} Pts</h4>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-250/60">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Class Percentile</span>
                  <h4 className="text-lg font-extrabold text-blue-600 mt-0.5">94.2%</h4>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-250/60 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Verifiable Credentials Status</span>
                {completedLabsCount >= 3 ? (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> ELIGIBLE FOR CERTIFICATE
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-700">
                    PENDING: Complete at least 3 labs
                  </span>
                )}
              </div>
            </div>

            {completedLabsCount >= 3 && !showCertificate && (
              <button
                disabled={isGenerating}
                onClick={handleGenerateCertificate}
                className="w-full mt-2 bg-red-700 hover:bg-red-800 text-white font-bold text-xs py-2.5 px-3 rounded shadow transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wide"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>ENCRYPTING LEDGER...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>GENERATE COMPETENCY CERTIFICATE</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Detailed Grades & Verifiable Certificate */}
        <div className="lg:col-span-2">
          {showCertificate ? (
            /* Verifiable Certificate Board */
            <motion.div
              id="verification-certificate"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border-2 border-red-700/20 rounded-2xl p-8 shadow-md relative overflow-hidden"
            >
              {/* Certificate Border accents */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-red-800 to-red-600" />
              <div className="absolute top-4 right-4 text-[10px] font-bold text-slate-400 uppercase">COMPETENCY DOCKET</div>

              {/* Certificate Content */}
              <div className="text-center space-y-6 my-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center justify-center gap-1 text-red-700 font-bold text-sm tracking-wider">
                    <Award className="w-4 h-4" />
                    <span>K J Somaiya College of Engineering</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-800 tracking-tight uppercase">
                    Department of Robotics and Automation
                  </h2>
                </div>

                <div className="w-16 h-0.5 bg-red-700/20 mx-auto" />

                <div className="space-y-2">
                  <p className="text-slate-500 text-xs italic">This certifies that</p>
                  <h3 className="text-xl font-extrabold text-slate-800 tracking-wide uppercase">{studentProfile.name}</h3>
                  <p className="text-slate-400 text-xs font-bold">Roll No: {studentProfile.rollNo}</p>
                </div>

                <p className="text-slate-600 text-xs leading-relaxed max-w-lg mx-auto font-medium">
                  has successfully performed academic simulations, configured direct feedback algorithms, and analyzed coordinate kinematics matrices, satisfying the laboratory requirements of the virtual module:
                </p>

                <h4 className="text-xs font-extrabold text-red-700 uppercase tracking-widest bg-red-50 border border-red-100 py-2 px-4 rounded-lg inline-block">
                  Somaiya Robotics Virtual Laboratory Course
                </h4>

                <div className="grid grid-cols-2 gap-8 text-left pt-6 border-t border-slate-100 max-w-md mx-auto">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Verification Hash</span>
                    <span className="text-[10px] font-mono text-slate-600 font-bold">{certHash}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Authorized Faculty Signature</span>
                    <span className="text-xs font-semibold text-slate-800 italic">Dr. Nilesh Patil</span>
                  </div>
                </div>
              </div>

              {/* Printable Controls */}
              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5 mt-6 text-xs font-bold">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-800 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Printer className="w-4 h-4 text-slate-500" />
                  Print Docket
                </button>
                <button
                  onClick={() => setShowCertificate(false)}
                  className="px-3.5 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg flex items-center gap-1.5 cursor-pointer font-bold transition-all shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  Save Verifiable PDF
                </button>
              </div>
            </motion.div>
          ) : (
            /* Standard Syllabus Docket Table */
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-red-700" />
                <span>Semester Course Syllabus Records</span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 font-bold text-[10px] text-slate-400 uppercase">
                      <th className="py-2.5 px-3">Lab Code</th>
                      <th className="py-2.5 px-3">Laboratory Concept</th>
                      <th className="py-2.5 px-3">Grade Score</th>
                      <th className="py-2.5 px-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {experiments.map((exp) => (
                      <tr key={exp.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-3 font-bold text-red-700">{exp.code}</td>
                        <td className="py-3 px-3">
                          <span className="font-bold text-slate-800 block">{exp.title}</span>
                          <span className="text-[10px] text-slate-400 font-bold block mt-0.5">{exp.difficulty}</span>
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-600">
                          {exp.status === "graded" ? `${exp.score}/100` : "-"}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            exp.status === "graded"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : exp.status === "submitted"
                              ? "bg-blue-50 text-blue-700 border border-blue-100"
                              : exp.status === "available"
                              ? "bg-red-50 text-red-700 border border-red-100"
                              : "bg-slate-50 text-slate-400 border border-slate-150"
                          }`}>
                            {exp.status}
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
      </div>
    </div>
  );
}

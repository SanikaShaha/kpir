import { useState } from "react";
import { Settings, Cpu, Terminal, Shield, PlayCircle, RefreshCw, AlertTriangle, Layers } from "lucide-react";
import { MOCK_LAB_EQUIPMENT } from "../data/mockData";
import { motion } from "motion/react";

export default function AdminView() {
  const [equipmentList, setEquipmentList] = useState(MOCK_LAB_EQUIPMENT);
  const [rebootingCluster, setRebootingCluster] = useState(false);
  const [adminLogs, setAdminLogs] = useState<string[]>([
    "Security Kernel: Shield Protection Active",
    "API Gateway: Port 3000 listening, proxies online",
    "Simulator Node #01: Container healthy",
    "Hardware Sync: 3 of 4 physical devices matching ledger"
  ]);

  const addAdminLog = (msg: string) => {
    setAdminLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 10)]);
  };

  const handleToggleStatus = (id: string) => {
    setEquipmentList((prev) =>
      prev.map((eq) => {
        if (eq.id === id) {
          const nextStatus = eq.status === "Online" ? "Maintenance" : "Online";
          addAdminLog(`Changed equipment status of ${eq.name} to [${nextStatus.toUpperCase()}]`);
          return {
            ...eq,
            status: nextStatus,
            utilization: nextStatus === "Online" ? "40%" : "0%"
          };
        }
        return eq;
      })
    );
  };

  const handleRebootCluster = () => {
    setRebootingCluster(true);
    addAdminLog("INITIATING SHUTDOWN OF CONTAINER COMPILER CLUSTERS...");
    setTimeout(() => {
      setRebootingCluster(false);
      addAdminLog("REBOOT COMPLETE. 16/16 virtual micro-instances running cleanly.");
    }, 1500);
  };

  return (
    <div id="admin-portal" className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-xl md:text-2xl font-bold text-slate-850 flex items-center gap-2">
          <Settings className="w-5 h-5 text-red-700" />
          <span>System Infrastructure Administration</span>
        </h1>
        <p className="text-slate-500 text-xs font-medium mt-0.5">Control panel for hardware rigs, container clusters, and student networks</p>
      </div>

      {/* Admin metrics row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Core Portal Status", value: "HEALTHY", desc: "API response: 18ms", icon: Shield, color: "text-emerald-700" },
          { label: "Compiler Sandboxes", value: "16 Containers", desc: "Docker virtualizers online", icon: Cpu, color: "text-red-700" },
          { label: "Rig Synchronization", value: "3 of 4 Online", desc: "1 device in maintenance", icon: Layers, color: "text-blue-700" },
          { label: "Terminal Uptime", value: "99.98%", desc: "35d 12h uninterrupted", icon: Terminal, color: "text-slate-700" }
        ].map((stat) => (
          <div key={stat.label} className="p-4 bg-white border border-slate-200 rounded-xl flex items-center gap-4 shadow-sm">
            <div className={`p-2.5 rounded-lg bg-slate-50 border border-slate-100 ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-md font-extrabold text-slate-800 mt-0.5">{stat.value}</h3>
              <p className="text-[10px] text-slate-500 font-medium">{stat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Physical Lab Hardware Rigs Telemetry */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Layers className="w-4.5 h-4.5 text-red-700 animate-pulse" />
            <span>Physical Lab Equipment Telemetry</span>
          </h2>

          <div className="space-y-3">
            {equipmentList.map((eq) => (
              <div key={eq.id} className="p-4 bg-slate-50/50 border border-slate-150 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${eq.status === "Online" ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
                    <h3 className="text-xs font-bold text-slate-800">{eq.name}</h3>
                  </div>
                  <div className="flex flex-wrap gap-x-4 text-[10px] text-slate-400 font-bold mt-1">
                    <span>Model: {eq.model}</span>
                    <span>•</span>
                    <span>Direct Utilization: {eq.utilization}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    eq.status === "Online"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      : "bg-amber-50 text-amber-700 border border-amber-100"
                  }`}>
                    {eq.status}
                  </span>
                  <button
                    onClick={() => handleToggleStatus(eq.id)}
                    className="text-[10px] font-bold border border-slate-200 hover:border-red-600/30 text-slate-500 hover:text-red-700 px-2.5 py-1 rounded cursor-pointer bg-white hover:bg-slate-50 transition-all"
                  >
                    Toggle Maint.
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Compiler Sandbox Containers & Terminal Logs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Cpu className="w-4.5 h-4.5 text-red-700" />
              <span>Container Virtualization Telemetry</span>
            </h3>

            {/* Simulated container status bars */}
            <div className="space-y-3 text-[10px] font-bold">
              <div>
                <div className="flex justify-between text-slate-500 mb-1">
                  <span>Compiler Cluster CPU Load</span>
                  <span>14.5%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div className="h-full bg-red-700 rounded-full" style={{ width: "14.5%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-500 mb-1">
                  <span>RAM Allocations (Total: 32GB)</span>
                  <span>42.1%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div className="h-full bg-slate-600 rounded-full" style={{ width: "42.1%" }} />
                </div>
              </div>
            </div>

            {/* Reboot microservers action */}
            <button
              disabled={rebootingCluster}
              onClick={handleRebootCluster}
              className="w-full bg-slate-50 border border-slate-200 hover:border-red-650/40 text-slate-700 hover:text-red-750 font-bold text-xs py-2 px-3 rounded shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              {rebootingCluster ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-red-600" />
                  <span>CYCLING CLUSTERS...</span>
                </>
              ) : (
                <>
                  <PlayCircle className="w-3.5 h-3.5 text-red-700" />
                  <span>HARD CYCLE COMPILER CLUSTER</span>
                </>
              )}
            </button>
          </div>

          {/* Admin Log Console */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-inner">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase pb-2 border-b border-slate-200 mb-2">Admin Security Log</h4>
            <div className="font-mono text-[9.5px] text-slate-500 space-y-1.5 h-28 overflow-y-auto pr-1">
              {adminLogs.map((log, i) => (
                <div key={i} className="leading-tight">
                  &gt; {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from "react";
import { Cpu, Play, RotateCcw, Target, Sliders, PlayCircle, Settings, CheckCircle } from "lucide-react";
import { RobotState, PracticalExperiment } from "../types";
import { motion } from "motion/react";

interface SimulatorViewProps {
  selectedExperiment: PracticalExperiment | null;
}

export default function SimulatorView({ selectedExperiment }: SimulatorViewProps) {
  const [theta1, setTheta1] = useState(45); // degrees
  const [theta2, setTheta2] = useState(45); // degrees
  const [mode, setMode] = useState<"manual" | "inverse" | "auto">("manual");
  const [runningRoutine, setRunningRoutine] = useState<string | null>(null);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "System Initialized: Somaiya Robotics Virtual Lab v3.0",
    "Hardware Proxy: Joint Servo v2 [CONNECTED]",
    "Manual Kinematics Controller Online"
  ]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const tracePathRef = useRef<{ x: number; y: number }[]>([]);

  const L1 = 120; // Length of Link 1
  const L2 = 95;  // Length of Link 2

  // Terminal log helper
  const addLog = (msg: string) => {
    setTerminalLogs((prev) => [...prev.slice(-15), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  // Run Inverse Kinematics to target (relative to base)
  const computeIK = (tx: number, ty: number) => {
    const d2 = tx * tx + ty * ty;
    const cosTheta2 = (d2 - L1 * L1 - L2 * L2) / (2 * L1 * L2);

    if (Math.abs(cosTheta2) > 1) {
      addLog("WARNING: Coordinate point out of range (Reachable Envelope Exceeded)");
      return null;
    }

    // Elbow up/down solution
    const theta2_rad = -Math.acos(cosTheta2);
    const k1 = L1 + L2 * Math.cos(theta2_rad);
    const k2 = L2 * Math.sin(theta2_rad);
    const theta1_rad = Math.atan2(ty, tx) - Math.atan2(k2, k1);

    const t1 = (theta1_rad * 180) / Math.PI;
    const t2 = (theta2_rad * 180) / Math.PI;

    return { theta1: t1, theta2: t2 };
  };

  // Draw simulation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      // Clear canvas (Clean Light Grey/White)
      ctx.fillStyle = "#fafafa";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw coordinate grids (soft slate-100)
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 0.5;
      const step = 40;
      for (let x = 0; x < canvas.width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Base point (Center of coordinate frame)
      const bx = canvas.width / 2;
      const by = canvas.height * 0.7; // shift down for better envelope display

      // Draw workspace envelope boundary (Soft Crimson Red circle)
      ctx.beginPath();
      ctx.arc(bx, by, L1 + L2, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(185, 28, 28, 0.08)";
      ctx.fillStyle = "rgba(185, 28, 28, 0.01)";
      ctx.fill();
      ctx.stroke();

      // Convert angles to radians
      const r1 = (theta1 * Math.PI) / 180;
      const r2 = ((theta1 + theta2) * Math.PI) / 180;

      // Compute joint coordinates (Relative Y is negative on canvas)
      const j1x = bx + L1 * Math.cos(r1);
      const j1y = by - L1 * Math.sin(r1);

      const j2x = j1x + L2 * Math.cos(r2);
      const j2y = j1y - L2 * Math.sin(r2);

      // Append trail
      tracePathRef.current.push({ x: j2x, y: j2y });
      if (tracePathRef.current.length > 80) {
        tracePathRef.current.shift();
      }

      // Draw trace path
      if (tracePathRef.current.length > 1) {
        ctx.beginPath();
        ctx.moveTo(tracePathRef.current[0].x, tracePathRef.current[0].y);
        for (let i = 1; i < tracePathRef.current.length; i++) {
          ctx.lineTo(tracePathRef.current[i].x, tracePathRef.current[i].y);
        }
        ctx.strokeStyle = "rgba(185, 28, 28, 0.6)"; // Red line trace
        ctx.lineWidth = 2.5;
        ctx.shadowColor = "#ef4444";
        ctx.shadowBlur = 3;
        ctx.stroke();
        ctx.shadowBlur = 0; // reset
      }

      // Draw Link 1 (Primary Arm Link - Somaiya Crimson)
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.lineTo(j1x, j1y);
      ctx.strokeStyle = "#dc2626";
      ctx.lineWidth = 6;
      ctx.lineCap = "round";
      ctx.stroke();

      // Draw Link 2 (Secondary Link - Slate Blue)
      ctx.beginPath();
      ctx.moveTo(j1x, j1y);
      ctx.lineTo(j2x, j2y);
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.stroke();

      // Draw base joint housing
      ctx.beginPath();
      ctx.arc(bx, by, 10, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#b91c1c";
      ctx.lineWidth = 2;
      ctx.fill();
      ctx.stroke();

      // Draw joint 1 housing
      ctx.beginPath();
      ctx.arc(j1x, j1y, 7, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#64748b";
      ctx.lineWidth = 2;
      ctx.fill();
      ctx.stroke();

      // Draw End-Effector tip
      ctx.beginPath();
      ctx.arc(j2x, j2y, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#b91c1c";
      ctx.shadowColor = "#ef4444";
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Print status overlays inside canvas (Slate Grey)
      ctx.fillStyle = "#475569";
      ctx.font = "bold 10px monospace";
      ctx.fillText(`BASE FRAME: (X: ${bx.toFixed(0)}, Y: ${by.toFixed(0)})`, 15, 20);
      ctx.fillText(`TIP COORDINATE: X: ${(j2x - bx).toFixed(1)}px, Y: ${(by - j2y).toFixed(1)}px`, 15, 35);
      ctx.fillText(`JOINT ANGLES: t1: ${theta1.toFixed(1)}°, t2: ${theta2.toFixed(1)}°`, 15, 50);

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [theta1, theta2, L1, L2]);

  // Handle canvas clicks to run inverse kinematics
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mode !== "inverse") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Relative target from Base point
    const bx = canvas.width / 2;
    const by = canvas.height * 0.7;

    const tx = x - bx;
    const ty = by - y; // flip Y coordinate relative to base

    const angles = computeIK(tx, ty);
    if (angles) {
      setTheta1(angles.theta1);
      setTheta2(angles.theta2);
      addLog(`Inverse Kinematics calculated successfully for cursor point X: ${tx.toFixed(0)}, Y: ${ty.toFixed(0)}`);
    }
  };

  // Simulated auto calibration / automated trajectory routines
  const runPresetRoutine = (type: string) => {
    setMode("auto");
    setRunningRoutine(type);
    tracePathRef.current = []; // Reset trace line

    addLog(`Running trajectory program: [${type.toUpperCase()}]`);

    let count = 0;
    const interval = setInterval(() => {
      if (type === "circle") {
        // Parametric equations for a circle in coordinate space
        // radius = 60, centered around X: 50, Y: 120
        const radius = 60;
        const cx = 50;
        const cy = 110;
        const rad = (count * 4 * Math.PI) / 180;
        const tx = cx + radius * Math.cos(rad);
        const ty = cy + radius * Math.sin(rad);

        const angles = computeIK(tx, ty);
        if (angles) {
          setTheta1(angles.theta1);
          setTheta2(angles.theta2);
        }
      } else if (type === "wave") {
        // Plot a sine wave trajectory
        const tx = -100 + count * 2.5;
        const ty = 100 + 40 * Math.sin((count * 10 * Math.PI) / 180);

        const angles = computeIK(tx, ty);
        if (angles) {
          setTheta1(angles.theta1);
          setTheta2(angles.theta2);
        }
      } else if (type === "calibrate") {
        // Move to extremes and home position
        if (count < 20) {
          setTheta1(count * 4.5);
          setTheta2(count * 4.5);
        } else if (count < 40) {
          setTheta1(90 - (count - 20) * 4.5);
          setTheta2(90 - (count - 20) * 2);
        } else {
          setTheta1(45);
          setTheta2(45);
        }
      }

      count++;
      if (count >= 80) {
        clearInterval(interval);
        setRunningRoutine(null);
        setMode("manual");
        addLog(`Trajectory routine completed safely. Stepper drives locked at home position.`);
      }
    }, 40);
  };

  const handleResetTrace = () => {
    tracePathRef.current = [];
    addLog("Trajectory buffer cleared successfully.");
  };

  return (
    <div id="simulator-portal" className="space-y-6">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-850 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-red-700" />
            <span>Articulated Robot Arm Simulator</span>
          </h1>
          <p className="text-slate-500 text-xs font-medium mt-0.5">High-fidelity 2-DOF planar link simulation matrix</p>
        </div>

        {/* Experiment Preload alert */}
        {selectedExperiment && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-100 px-3 py-1.5 rounded-lg text-xs font-bold">
            <CheckCircle className="w-4 h-4 text-red-700" />
            <span className="text-red-800">Syllabus Loaded: </span>
            <span className="text-slate-800 font-extrabold">{selectedExperiment.code}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 2D Interactive Simulator Canvas (Span 7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm overflow-hidden relative">
            <div className="flex items-center justify-between mb-3 text-xs font-bold">
              <span className="text-slate-600 font-bold uppercase flex items-center gap-1">
                <Sliders className="w-4 h-4 text-red-700 animate-pulse" />
                <span>Simulation Sandbox Canvas</span>
              </span>

              {/* Mode Select Buttons */}
              <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-200">
                <button
                  onClick={() => { setMode("manual"); addLog("Manual forward angles controller active."); }}
                  className={`px-3 py-1 rounded text-[10px] font-bold cursor-pointer ${
                    mode === "manual" ? "bg-red-700 text-white" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  FORWARD
                </button>
                <button
                  onClick={() => { setMode("inverse"); addLog("Click targets on canvas to test Inverse Coordinates solver."); }}
                  className={`px-3 py-1 rounded text-[10px] font-bold cursor-pointer ${
                    mode === "inverse" ? "bg-red-700 text-white" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  INVERSE (IK)
                </button>
              </div>
            </div>

            {/* Canvas */}
            <div className="relative border border-slate-200 rounded-xl overflow-hidden cursor-crosshair">
              {mode === "inverse" && (
                <div className="absolute top-3 right-3 bg-red-50 text-red-700 px-3 py-1 rounded border border-red-200 font-bold text-[10px] flex items-center gap-1 z-10">
                  <Target className="w-3 h-3 animate-ping" />
                  <span>CLICK CANVAS TO RETRIEVE ANGLE SOLUTION</span>
                </div>
              )}
              <canvas
                ref={canvasRef}
                width={500}
                height={350}
                onClick={handleCanvasClick}
                className="w-full h-[350px] block"
              />
            </div>

            {/* Quick Actions underneath */}
            <div className="flex items-center justify-between mt-4">
              <span className="text-[10px] font-medium text-slate-400">
                Joint limits: θ1, θ2 [-180° to 180°]
              </span>
              <button
                onClick={handleResetTrace}
                className="text-xs text-slate-600 hover:text-slate-800 font-bold border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer bg-white hover:bg-slate-50 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                Clear Trajectory Trail
              </button>
            </div>
          </div>
        </div>

        {/* Right: Controller Sliders & Code Terminal Logs (Span 5) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Controls Box */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
              <Settings className="w-4 h-4 text-red-700" />
              <span>Drive Controller Actuators</span>
            </h3>

            {/* Sliders (Only active in manual mode) */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-600">Joint 1 Angle (θ1)</span>
                  <span className="text-red-700">{theta1.toFixed(1)}°</span>
                </div>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="1"
                  value={theta1}
                  disabled={mode !== "manual"}
                  onChange={(e) => setTheta1(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-red-600 disabled:opacity-30 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-600">Joint 2 Angle (θ2)</span>
                  <span className="text-slate-600">{theta2.toFixed(1)}°</span>
                </div>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="1"
                  value={theta2}
                  disabled={mode !== "manual"}
                  onChange={(e) => setTheta2(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-600 disabled:opacity-30 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Trajectory Routine Launcher */}
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <label className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">PRE-PROGRAMMED TRAJECTORY ROUTINES</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "circle", label: "Plot Circle", desc: "IK Coordinates circular movement" },
                  { id: "wave", label: "Sine Wave", desc: "Sine function wave movement" },
                  { id: "calibrate", label: "Calibration", desc: "Zero home coordinates search" }
                ].map((routine) => (
                  <button
                    key={routine.id}
                    disabled={runningRoutine !== null}
                    onClick={() => runPresetRoutine(routine.id)}
                    className="p-2 bg-white border border-slate-200 hover:border-red-600/40 rounded-lg text-[10px] font-bold text-slate-600 hover:text-red-700 transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 disabled:opacity-35 disabled:cursor-not-allowed text-center shadow-sm"
                  >
                    <PlayCircle className="w-4 h-4 text-red-700" />
                    <span>{routine.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Terminal Console Logs */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-inner">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase">
              <span>Feedback Actuator Log</span>
              <span className="text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Feed
              </span>
            </div>

            <div className="font-mono text-[10px] text-slate-500 space-y-1 h-32 overflow-y-auto pr-1">
              {terminalLogs.map((log, index) => (
                <div key={index} className="leading-relaxed hover:text-slate-800 transition-colors">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

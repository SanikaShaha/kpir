import React, { useState, useEffect, useRef } from "react";
import { 
  FileText, Award, Layers, Clock, ArrowRight, Play, Check, Send, AlertTriangle, 
  BookOpen, HelpCircle, Activity, Calculator, Table, RotateCcw, Sparkles, CheckSquare, RefreshCw, ClipboardList
} from "lucide-react";
import { PracticalExperiment } from "../types";
import { motion } from "motion/react";

interface ExperimentsViewProps {
  experiments: PracticalExperiment[];
  onSelectExperiment: (exp: PracticalExperiment) => void;
  onNavigate: (tab: string) => void;
  onSubmitExperimentCode: (id: string, code: string) => void;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const PRE_QUIZZES: Record<string, QuizQuestion[]> = {
  exp_01: [
    {
      question: "Which of the following is correct for Forward Kinematics (FK)?",
      options: [
        "Computes joint angles from end-effector coordinates",
        "Computes end-effector coordinates from joint angles",
        "Dampens joint speed automatically",
        "Calibrates motor encoder zeros"
      ],
      correctIndex: 1,
      explanation: "Forward Kinematics maps known joint space parameters (angles) to operational Cartesian space coordinates (X, Y)."
    },
    {
      question: "For a 2-DOF planar link arm with lengths L1 = 150 and L2 = 100, what is the maximum radial reach in pixels?",
      options: ["150 px", "100 px", "250 px", "50 px"],
      correctIndex: 2,
      explanation: "The maximum reach is the straight-line configuration where joint angles line up: Reach = L1 + L2 = 150 + 100 = 250 px."
    },
    {
      question: "Which trigonometric function is primarily used to resolve the perpendicular component (Y) of a link rotation?",
      options: ["Cosine", "Sine", "Tangent", "Secant"],
      correctIndex: 1,
      explanation: "In Cartesian rotations, the vertical projection is Y = L * sin(theta)."
    }
  ],
  exp_02: [
    {
      question: "What is the primary challenge in Inverse Kinematics (IK) compared to Forward Kinematics (FK)?",
      options: [
        "IK is always linear and easy to solve",
        "IK equations are simple trigonometric derivatives",
        "IK often has multiple solutions, singular configurations, or no solution at all",
        "IK only applies to 1-DOF mobile robots"
      ],
      correctIndex: 2,
      explanation: "Inverse Kinematics involves non-linear trigonometric systems which can yield multiple valid configurations (elbow-up/elbow-down) or be physically unreachable (no solution)."
    },
    {
      question: "In inverse kinematics of a 2-DOF arm, what does 'elbow-up' and 'elbow-down' represent?",
      options: [
        "Different motor gear ratios",
        "Two distinct joint combinations to reach the same physical coordinates",
        "Gravity vector alignments",
        "Calibration errors in encoders"
      ],
      correctIndex: 1,
      explanation: "These represent two geometric configurations (solutions) that place the end-effector tip at the exact same (X, Y) target."
    },
    {
      question: "Which JS Math method is preferred to find joint angle orientations to preserve correct quadrants without division errors?",
      options: ["Math.acos", "Math.atan", "Math.atan2", "Math.asin"],
      correctIndex: 2,
      explanation: "Math.atan2(y, x) computes the counter-clockwise angle between the positive x-axis and the point (x, y), handling all quadrants and division-by-zero cases correctly."
    }
  ],
  exp_03: [
    {
      question: "What do the letters 'P', 'I', and 'D' stand for in feedback control?",
      options: [
        "Position, Inertia, Distance",
        "Proportional, Integral, Derivative",
        "Pneumatic, Induction, Digital",
        "Predictive, Iterative, Dynamic"
      ],
      correctIndex: 1,
      explanation: "PID stands for Proportional, Integral, and Derivative control loops."
    },
    {
      question: "What is the primary danger of setting an extremely high Proportional Gain (Kp) in joint controllers?",
      options: [
        "The motor remains stationary",
        "The joint angle drifts slowly to infinity",
        "The system will experience heavy oscillation or unstable divergence",
        "Steady-state error increases exponentially"
      ],
      correctIndex: 2,
      explanation: "Excessive Kp creates a strong corrective force, causing the system to over-correct and oscillate violently around the target angle."
    },
    {
      question: "To eliminate steady-state error (the small offset remaining at rest), which PID term is essential?",
      options: ["Derivative (Kd)", "Integral (Ki)", "Proportional (Kp)", "Feedforward Gain"],
      correctIndex: 1,
      explanation: "The Integral (Ki) term integrates historical error over time, steadily building up torque to eliminate persistent minor offsets."
    }
  ],
  exp_04: [
    {
      question: "In autonomous navigation, what are Potential Field Methods?",
      options: [
        "A system for calculating solar cell outputs",
        "An algorithm that guides robots using attractive and repulsive forces",
        "A database that stores motor values",
        "A wireless charging framework for rovers"
      ],
      correctIndex: 1,
      explanation: "Potential fields assign attractive forces to goal points and repulsive forces to obstacles to calculate real-time navigation headings."
    },
    {
      question: "What is a main limitation of Potential Field navigation?",
      options: [
        "It uses too much memory",
        "The robot can get permanently trapped in local minima (stuck before reaching the goal)",
        "It cannot avoid stationary objects",
        "It only works in circular rooms"
      ],
      correctIndex: 1,
      explanation: "A robot can reach a spot where the attractive force and repulsive forces cancel each other out (local minima), causing it to halt before reaching the goal."
    },
    {
      question: "Which coordinate grid model is standard to represent map occupancies as simple free/blocked matrix blocks?",
      options: ["Kinetic Tree Grid", "Occupancy Grid Map", "D-H Parameter Table", "Ziegler-Nichols Table"],
      correctIndex: 1,
      explanation: "Occupancy Grid Maps discretize the workspace into a cell grid where each element represents the probability of obstacle presence."
    }
  ]
};

const POST_QUIZZES: Record<string, QuizQuestion[]> = {
  exp_01: [
    {
      question: "If Joint 1 is rotated to 90 degrees and Joint 2 is rotated to 0 degrees, what are the coordinates relative to the base?",
      options: [
        "X: 0, Y: 250",
        "X: 250, Y: 0",
        "X: 150, Y: 100",
        "X: 0, Y: 150"
      ],
      correctIndex: 0,
      explanation: "At theta1 = 90°, Link 1 points straight up along the Y-axis. At theta2 = 0° (relative), Link 2 continues in the same direction. Total coordinates are X = 0, Y = L1 + L2 = 150 + 100 = 250."
    },
    {
      question: "Why do we convert degrees to radians before applying Math.cos or Math.sin in JS?",
      options: [
        "Javascript engines only process radians natively for trigonometric calculations",
        "Radians use less computer memory",
        "Degrees are non-linear variables",
        "To match physical motor gear values"
      ],
      correctIndex: 0,
      explanation: "Standard JS Math library functions (Math.sin, Math.cos, Math.tan) require their angle parameters to be in radians."
    },
    {
      question: "What happens to the End-Effector X coordinate if theta1 = 180° and theta2 = 0°?",
      options: ["X becomes -250 px", "X becomes 250 px", "X remains 0 px", "Y becomes -250 px"],
      correctIndex: 0,
      explanation: "At theta1 = 180° and theta2 = 0°, the arm points horizontally to the left. Thus X = L1*cos(180) + L2*cos(180) = -150 - 100 = -250 px."
    }
  ],
  exp_02: [
    {
      question: "In Inverse Kinematics, what happens when a target coordinate has a distance from base greater than (L1 + L2)?",
      options: [
        "The joint motor speeds up",
        "The math yields an imaginary number, meaning the position is unreachable",
        "The elbow configuration reverses automatically",
        "The robot breaks its mechanical limiters"
      ],
      correctIndex: 1,
      explanation: "The mathematical calculations (specifically arccos of cosTheta2) fail because cosTheta2 becomes > 1, representing coordinates outside the arm's workspace boundary."
    },
    {
      question: "If we need the arm to grab an object from below, which inverse kinematics solution should we prefer?",
      options: [
        "Elbow-down configuration",
        "Elbow-up configuration",
        "Home calibration configuration",
        "Forward-swept orientation"
      ],
      correctIndex: 0,
      explanation: "Elbow-down bends the elbow downward towards the lower hemisphere, which is ideal for approaching objects from a lower angle."
    },
    {
      question: "Is Inverse Kinematics calculation more computationally expensive than Forward Kinematics?",
      options: [
        "No, they use identical CPU cycles",
        "Yes, because IK uses multi-variable non-linear systems, trigonometric root searches, and multiple checks",
        "No, IK only requires simple multiplication",
        "Yes, but only for mobile rovers"
      ],
      correctIndex: 1,
      explanation: "IK involves solving non-linear equations with multiple cases, transcendental functions, and bounds validation, making it significantly more complex."
    }
  ],
  exp_03: [
    {
      question: "During step response tuning, you notice persistent, slow oscillations. Which gain should be adjusted to stabilize the feedback loop?",
      options: [
        "Increase Derivative gain (Kd) to dampen, or slightly decrease Proportional gain (Kp)",
        "Increase Integral gain (Ki) to speed up",
        "Set Kp to zero to lock feedback",
        "Increase target angle value"
      ],
      correctIndex: 0,
      explanation: "Derivative gain acts like a damper, resisting rapid changes in joint speed and stabilizing oscillations. High Kp can also cause oscillations and should be reduced."
    },
    {
      question: "What is 'windup' or 'integral windup' in PID loops?",
      options: [
        "When the motor cable wraps around the joint hub",
        "When the integral term continues accumulating error during physical saturation, leading to massive overshoots",
        "The process of calibrating physical encoders",
        "The delay between processing step commands"
      ],
      correctIndex: 1,
      explanation: "If a motor is saturated (at max voltage) and can't move faster, the error persists. The integral term continues to wind up (accumulate), causing excessive overshoot once the target is finally met."
    },
    {
      question: "If Kp = 10, Ki = 0, Kd = 0, how is the controller categorized?",
      options: ["A pure Proportional (P) controller", "A proportional-derivative controller", "An unstable calibration driver", "An open-loop speed regulator"],
      correctIndex: 0,
      explanation: "Since Ki and Kd are zero, only the Proportional term (P) is active."
    }
  ],
  exp_04: [
    {
      question: "How can we physically resolve the 'Local Minima' problem in autonomous field navigators?",
      options: [
        "Using global path planning like A* for path selection, and using potential fields for local obstacle avoidance only",
        "Increasing the repulsive force to infinity",
        "Turning off the rover's motors",
        "Removing all obstacles from the floor"
      ],
      correctIndex: 0,
      explanation: "Combining a global path planner (A*) with local potential fields ensures the robot always has a continuous path around major trapping points."
    },
    {
      question: "What happens to the repulsive force as the distance to an obstacle approaches zero?",
      options: [
        "It remains constant",
        "It decreases to zero",
        "It increases exponentially to resist collisions",
        "It reverses and becomes attractive"
      ],
      correctIndex: 2,
      explanation: "To prevent collisions, repulsive formulas are configured to increase exponentially or with 1/d^2 as the distance (d) to an obstacle shrinks."
    },
    {
      question: "In ROS, what is a transform tree (TF)?",
      options: [
        "A database of tree species near the campus",
        "A system that tracks coordinate frame relationships over time",
        "A script that compiles C++ nodes",
        "A pathfinding algorithm"
      ],
      correctIndex: 1,
      explanation: "TF allows users to keep track of coordinate frames (like rover base, lidar frame, camera frame) in a tree structure and perform direct spatial transforms."
    }
  ]
};

interface ObservationRow {
  sNo: number;
  theta1: number;
  theta2: number;
  calcX: number;
  calcY: number;
  simX: number;
  simY: number;
  error: string;
  status: "Verified" | "Failed";
}

export default function ExperimentsView({
  experiments,
  onSelectExperiment,
  onNavigate,
  onSubmitExperimentCode,
}: ExperimentsViewProps) {
  const [selectedId, setSelectedId] = useState(experiments[0]?.id || "");
  const [activeTab, setActiveTab] = useState<
    "aim" | "theory" | "steps" | "quiz_pre" | "simulation" | "observations" | "quiz_post" | "submit"
  >("aim");

  // Code editor draft
  const [codeDraft, setCodeDraft] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // Quizzes State
  const [preAnswers, setPreAnswers] = useState<Record<string, Record<number, number>>>({});
  const [preChecked, setPreChecked] = useState<Record<string, boolean>>({});
  const [postAnswers, setPostAnswers] = useState<Record<string, Record<number, number>>>({});
  const [postChecked, setPostChecked] = useState<Record<string, boolean>>({});

  // Observation Ledger State
  const [calcTheta1, setCalcTheta1] = useState(30);
  const [calcTheta2, setCalcTheta2] = useState(45);
  const [calcManualX, setCalcManualX] = useState("");
  const [calcManualY, setCalcManualY] = useState("");
  const [observations, setObservations] = useState<Record<string, ObservationRow[]>>({});
  const [obsFeedback, setObsFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Embedded Simulator sliders
  const [simTheta1, setSimTheta1] = useState(30);
  const [simTheta2, setSimTheta2] = useState(45);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const selectedExp = experiments.find((e) => e.id === selectedId) || experiments[0];

  const L1 = 150; // Link 1 Length
  const L2 = 100; // Link 2 Length

  // Handle Changing Experiment Selection
  const handleSelectExp = (id: string) => {
    setSelectedId(id);
    const exp = experiments.find(e => e.id === id);
    if (exp) {
      setCodeDraft(exp.submissionCode || exp.codeTemplate);
    }
    setSubmissionSuccess(false);
    setActiveTab("aim");
    setObsFeedback(null);
  };

  // Sync draft on load if needed
  useEffect(() => {
    if (selectedExp) {
      setCodeDraft(selectedExp.submissionCode || selectedExp.codeTemplate);
    }
  }, [selectedId]);

  // Handle code compilation and submission
  const handleSubmitCode = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      onSubmitExperimentCode(selectedExp.id, codeDraft);
      setSubmitting(false);
      setSubmissionSuccess(true);
      setActiveTab("aim");
    }, 1200);
  };

  // Pre-quiz Answer Click Handler
  const handlePreOptionClick = (questionIdx: number, optionIdx: number) => {
    if (preChecked[selectedId]) return; // locked once checked
    setPreAnswers(prev => ({
      ...prev,
      [selectedId]: {
        ...(prev[selectedId] || {}),
        [questionIdx]: optionIdx
      }
    }));
  };

  // Post-quiz Answer Click Handler
  const handlePostOptionClick = (questionIdx: number, optionIdx: number) => {
    if (postChecked[selectedId]) return; // locked once checked
    setPostAnswers(prev => ({
      ...prev,
      [selectedId]: {
        ...(prev[selectedId] || {}),
        [questionIdx]: optionIdx
      }
    }));
  };

  // Check pre-quiz submission
  const handleCheckPreQuiz = () => {
    const currentPreQuiz = PRE_QUIZZES[selectedId] || [];
    const currentPreAns = preAnswers[selectedId] || {};
    if (Object.keys(currentPreAns).length < currentPreQuiz.length) {
      alert("Please select answers for all pre-lab questions before submitting.");
      return;
    }
    setPreChecked(prev => ({ ...prev, [selectedId]: true }));
  };

  // Check post-quiz submission
  const handleCheckPostQuiz = () => {
    const currentPostQuiz = POST_QUIZZES[selectedId] || [];
    const currentPostAns = postAnswers[selectedId] || {};
    if (Object.keys(currentPostAns).length < currentPostQuiz.length) {
      alert("Please select answers for all post-lab questions before submitting.");
      return;
    }
    setPostChecked(prev => ({ ...prev, [selectedId]: true }));
  };

  // Reset Quizzes
  const handleResetPreQuiz = () => {
    setPreChecked(prev => ({ ...prev, [selectedId]: false }));
    setPreAnswers(prev => ({ ...prev, [selectedId]: {} }));
  };

  const handleResetPostQuiz = () => {
    setPostChecked(prev => ({ ...prev, [selectedId]: false }));
    setPostAnswers(prev => ({ ...prev, [selectedId]: {} }));
  };

  // Verify Observation & Calculations Manual Input
  const handleVerifyCalculations = () => {
    if (!calcManualX || !calcManualY) {
      setObsFeedback({ type: "error", message: "Please provide your calculated X and Y values." });
      return;
    }

    const t1Rad = (calcTheta1 * Math.PI) / 180;
    const t2Rad = ((calcTheta1 + calcTheta2) * Math.PI) / 180;

    // True physical kinematics calculated on the twin processor
    const trueX = L1 * Math.cos(t1Rad) + L2 * Math.cos(t2Rad);
    const trueY = L1 * Math.sin(t1Rad) + L2 * Math.sin(t2Rad);

    const userX = parseFloat(calcManualX);
    const userY = parseFloat(calcManualY);

    const errorX = Math.abs(trueX - userX);
    const errorY = Math.abs(trueY - userY);
    const totalError = Math.sqrt(errorX * errorX + errorY * errorY);

    const isVerified = totalError < 2.0;

    const currentObs = observations[selectedId] || [];
    const newRow: ObservationRow = {
      sNo: currentObs.length + 1,
      theta1: calcTheta1,
      theta2: calcTheta2,
      calcX: parseFloat(userX.toFixed(1)),
      calcY: parseFloat(userY.toFixed(1)),
      simX: parseFloat(trueX.toFixed(1)),
      simY: parseFloat(trueY.toFixed(1)),
      error: totalError.toFixed(2) + " px",
      status: isVerified ? "Verified" : "Failed"
    };

    setObservations(prev => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] || []), newRow]
    }));

    if (isVerified) {
      setObsFeedback({
        type: "success",
        message: `VERIFICATION SUCCESSFUL! Total coordinate deviation is only ${totalError.toFixed(2)}px. Your trigonometry matches the Somaiya Virtual Robot Rig Twin!`
      });
      setCalcManualX("");
      setCalcManualY("");
    } else {
      setObsFeedback({
        type: "error",
        message: `VERIFICATION FAILED! Your calculated values (X: ${userX}, Y: ${userY}) deviate significantly from the simulation twin (X: ${trueX.toFixed(1)}, Y: ${trueY.toFixed(1)}). Error margin is ${totalError.toFixed(2)}px. Re-verify your trigonometric calculations.`
      });
    }
  };

  const handleClearObservations = () => {
    setObservations(prev => ({ ...prev, [selectedId]: [] }));
    setObsFeedback(null);
  };

  const handlePresetAngles = (t1: number, t2: number) => {
    setCalcTheta1(t1);
    setCalcTheta2(t2);
    setObsFeedback(null);
  };

  // Render the Embedded Canvas in simulation tab
  useEffect(() => {
    if (activeTab !== "simulation") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const render = () => {
      // Background (soft grey grid)
      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Coordinate grids
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

      // Base coordinate origin at center bottom
      const bx = canvas.width / 2;
      const by = canvas.height * 0.8;

      // Draw workspace envelope boundary (Soft Crimson Red circle)
      ctx.beginPath();
      ctx.arc(bx, by, L1 + L2, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(185, 28, 28, 0.08)";
      ctx.fillStyle = "rgba(185, 28, 28, 0.01)";
      ctx.fill();
      ctx.stroke();

      // Convert sliders to radians
      const r1 = (simTheta1 * Math.PI) / 180;
      const r2 = ((simTheta1 + simTheta2) * Math.PI) / 180;

      // Joints coordinates
      const j1x = bx + L1 * Math.cos(r1);
      const j1y = by - L1 * Math.sin(r1);

      const j2x = j1x + L2 * Math.cos(r2);
      const j2y = j1y - L2 * Math.sin(r2);

      // Draw link 1 (Crimson)
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.lineTo(j1x, j1y);
      ctx.strokeStyle = "#dc2626";
      ctx.lineWidth = 6;
      ctx.lineCap = "round";
      ctx.stroke();

      // Draw link 2 (Slate)
      ctx.beginPath();
      ctx.moveTo(j1x, j1y);
      ctx.lineTo(j2x, j2y);
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.stroke();

      // Draw joint base
      ctx.beginPath();
      ctx.arc(bx, by, 9, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#b91c1c";
      ctx.lineWidth = 2;
      ctx.fill();
      ctx.stroke();

      // Draw joint 1
      ctx.beginPath();
      ctx.arc(j1x, j1y, 7, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#64748b";
      ctx.lineWidth = 2;
      ctx.fill();
      ctx.stroke();

      // Draw tool tip
      ctx.beginPath();
      ctx.arc(j2x, j2y, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#b91c1c";
      ctx.fill();

      // Text status overlays
      ctx.fillStyle = "#475569";
      ctx.font = "bold 9px monospace";
      ctx.fillText(`L1: ${L1}px, L2: ${L2}px`, 12, 18);
      ctx.fillText(`Joint Angles: θ1=${simTheta1.toFixed(0)}°, θ2=${simTheta2.toFixed(0)}°`, 12, 30);
      ctx.fillText(`End Effector: X=${(j2x - bx).toFixed(1)}px, Y=${(by - j2y).toFixed(1)}px`, 12, 42);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [activeTab, simTheta1, simTheta2]);

  // Jump to separate Robot Simulator tab
  const handleRunInMainSandbox = () => {
    onSelectExperiment(selectedExp);
    onNavigate("simulator");
  };

  const currentPreQuiz = PRE_QUIZZES[selectedId] || [];
  const currentPostQuiz = POST_QUIZZES[selectedId] || [];
  const currentPreAnswers = preAnswers[selectedId] || {};
  const currentPostAnswers = postAnswers[selectedId] || {};
  const isPreChecked = preChecked[selectedId] || false;
  const isPostChecked = postChecked[selectedId] || false;
  const currentObservations = observations[selectedId] || [];

  // Calculate scores
  const scorePre = currentPreQuiz.reduce((sum, q, idx) => {
    return sum + (currentPreAnswers[idx] === q.correctIndex ? 1 : 0);
  }, 0);

  const scorePost = currentPostQuiz.reduce((sum, q, idx) => {
    return sum + (currentPostAnswers[idx] === q.correctIndex ? 1 : 0);
  }, 0);

  return (
    <div id="experiments-portal" className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-xl md:text-2xl font-bold text-slate-850 flex items-center gap-2">
          <ClipboardList className="w-5.5 h-5.5 text-red-700" />
          <span>KJSCE Robotics Virtual Lab Sessions</span>
        </h1>
        <p className="text-slate-500 text-xs font-medium mt-0.5">
          Department of Robotics and Automation Engineering, K J Somaiya College of Engineering, Vidyavihar, Mumbai
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: List of Practicals (Span 4) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center gap-2 bg-red-50 border border-red-100 p-3 rounded-xl mb-1">
            <Sparkles className="w-4 h-4 text-red-700 shrink-0" />
            <span className="text-[11px] text-red-950 font-bold uppercase tracking-wider">SOMAIYA VIRTUAL COURSEWARE v3.0</span>
          </div>
          
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">LAB SYLLABUS LIST</h2>
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {experiments.map((exp) => {
              const isSelected = exp.id === selectedId;
              return (
                <button
                  key={exp.id}
                  onClick={() => handleSelectExp(exp.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${
                    isSelected
                      ? "bg-red-50/90 border-red-700 shadow-md ring-1 ring-red-700/20"
                      : exp.status === "locked"
                      ? "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed opacity-55"
                      : "bg-white border-slate-200 hover:border-slate-300 text-slate-600"
                  }`}
                  disabled={exp.status === "locked"}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      isSelected ? "bg-red-200 text-red-800" : "bg-slate-100 text-slate-500"
                    }`}>
                      {exp.code}
                    </span>
                    <span className={`text-[10px] font-bold uppercase ${
                      exp.difficulty === "Beginner" ? "text-emerald-600" : exp.difficulty === "Intermediate" ? "text-amber-600" : "text-rose-600"
                    }`}>
                      {exp.difficulty}
                    </span>
                  </div>

                  <div>
                    <h3 className={`text-xs font-bold leading-snug ${isSelected ? "text-red-950" : "text-slate-800"}`}>
                      {exp.title}
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-1 font-semibold">{exp.estimatedTime}</p>
                  </div>

                  {/* Status Badges */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-1 text-[10px] font-bold">
                    <span className="text-slate-400">Submission Status:</span>
                    {exp.status === "graded" && (
                      <span className="text-emerald-600 flex items-center gap-1">
                        <Award className="w-3 h-3" /> Graded ({exp.score}/100)
                      </span>
                    )}
                    {exp.status === "submitted" && (
                      <span className="text-blue-600 flex items-center gap-1">
                        <Send className="w-3 h-3 animate-pulse" /> Submitted
                      </span>
                    )}
                    {exp.status === "available" && (
                      <span className="text-red-700">Available</span>
                    )}
                    {exp.status === "locked" && (
                      <span className="text-slate-400 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Locked
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed View (Span 8) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[600px]">
          <div>
            {/* Experiment Title Header */}
            <div className="border-b border-slate-200 pb-4 mb-4">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs font-bold bg-red-50 text-red-700 border border-red-100 px-2.5 py-1 rounded">
                  {selectedExp.code}
                </span>
                <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  Syllabus Duration: {selectedExp.estimatedTime}
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-800">{selectedExp.title}</h2>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed font-medium">{selectedExp.shortDescription}</p>
            </div>

            {/* Virtual Lab Session Tabs/Pages */}
            <div className="flex flex-wrap gap-1 border-b border-slate-150 mb-5 text-[11px] font-bold">
              {[
                { id: "aim", label: "1. Aim & Objectives", icon: CheckSquare },
                { id: "theory", label: "2. Theory & Equations", icon: BookOpen },
                { id: "steps", label: "3. Lab Procedure", icon: FileText },
                { id: "quiz_pre", label: "4. Pre-Lab Quiz", icon: HelpCircle },
                { id: "simulation", label: "5. Simulator Sandbox", icon: Activity },
                { id: "observations", label: "6. Calculation Sheet", icon: Calculator },
                { id: "quiz_post", label: "7. Post-Lab Quiz", icon: HelpCircle },
                { id: "submit", label: "8. Code Submission", icon: Send }
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      setObsFeedback(null);
                    }}
                    className={`pb-2 px-2.5 transition-all border-b-2 cursor-pointer flex items-center gap-1 mt-1 ${
                      isActive
                        ? "border-red-700 text-red-700 font-extrabold"
                        : "border-transparent text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    <tab.icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Contents - Container */}
            <div className="space-y-4 max-h-[440px] overflow-y-auto pr-1">
              
              {/* AIM & OBJECTIVES TAB */}
              {activeTab === "aim" && (
                <div className="space-y-4 font-medium text-xs leading-relaxed text-slate-600">
                  <div className="bg-red-50/40 border border-red-100 p-4 rounded-xl">
                    <h4 className="text-xs font-bold text-red-950 uppercase tracking-wider mb-2">Aim of the Experiment</h4>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">{selectedExp.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <CheckSquare className="w-4 h-4 text-red-700" />
                        <span>Core Learning Objectives</span>
                      </h4>
                      <ul className="space-y-2.5 list-none">
                        {selectedExp.objectives.map((obj, i) => (
                          <li key={i} className="flex items-start gap-2 text-slate-600">
                            <span className="p-0.5 rounded bg-red-50 text-red-700 mt-0.5">
                              <Check className="w-3 h-3" />
                            </span>
                            <span className="text-[11px] font-medium">{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-red-700" />
                        <span>Equipment Checklist</span>
                      </h4>
                      <div className="space-y-2 text-[11px] text-slate-500 font-semibold">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                          <span>Interactive 2-DOF Robotic Arm Sandbox</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                          <span>Somaiya Virtual Hardware Compiler Interface</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                          <span>Scientific Trigonometric Formula Matrix</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                          <span>DC Servo Actuator Motor Emulator (PID controller)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* THEORY & EQUATIONS TAB */}
              {activeTab === "theory" && (
                <div className="text-xs text-slate-600 leading-relaxed space-y-4 font-medium">
                  <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl text-slate-600 space-y-3 font-mono">
                    <span className="text-xs text-red-700 font-bold uppercase block mb-1 flex items-center gap-1">
                      <Calculator className="w-4 h-4" />
                      <span>Mathematical Kinematics Formula Derivations</span>
                    </span>
                    <div className="whitespace-pre-wrap leading-relaxed text-[11px] text-slate-700">
                      {selectedExp.theory}
                    </div>
                  </div>

                  <div className="bg-red-50/20 border border-red-100 p-4 rounded-xl space-y-2">
                    <h4 className="text-xs font-bold text-red-950 uppercase tracking-wider">Trigonometric Resolution Instructions</h4>
                    <p className="text-[11px] leading-relaxed text-slate-700">
                      Use the provided link lengths (L1 = 150 px, L2 = 100 px) and your specific slider joint angles to evaluate the Cartesian operation coordinate points manually. Compare these with the feedback simulator coordinate readouts in stage 5, and record your evaluations inside the calculation ledger sheet in stage 6.
                    </p>
                  </div>
                </div>
              )}

              {/* LAB PROCEDURE TAB */}
              {activeTab === "steps" && (
                <ol className="space-y-3 text-xs text-slate-600 font-medium">
                  {selectedExp.steps.map((step, i) => (
                    <li key={i} className="flex gap-3 bg-slate-50 p-3 border border-slate-150 rounded-xl">
                      <span className="w-5 h-5 bg-red-50 border border-red-100 text-red-700 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <p className="leading-relaxed text-slate-700">{step}</p>
                    </li>
                  ))}
                </ol>
              )}

              {/* PRE-LAB QUIZ TAB */}
              {activeTab === "quiz_pre" && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Pre-Lab Concepts Verification</h3>
                    {isPreChecked && (
                      <span className="text-xs bg-red-100 text-red-800 font-bold px-2.5 py-0.5 rounded">
                        Score: {scorePre} / {currentPreQuiz.length}
                      </span>
                    )}
                  </div>

                  {currentPreQuiz.map((q, qIdx) => {
                    const selectedOpt = currentPreAnswers[qIdx];
                    return (
                      <div key={qIdx} className="p-4 border border-slate-200 rounded-xl bg-slate-50/30 space-y-3">
                        <p className="text-xs font-bold text-slate-800">Q{qIdx + 1}: {q.question}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {q.options.map((opt, oIdx) => {
                            const isSelected = selectedOpt === oIdx;
                            const isCorrect = q.correctIndex === oIdx;
                            
                            let optStyle = "border-slate-200 hover:bg-slate-50 text-slate-600";
                            if (isPreChecked) {
                              if (isCorrect) {
                                optStyle = "bg-emerald-50 border-emerald-500 text-emerald-800 font-bold";
                              } else if (isSelected) {
                                optStyle = "bg-rose-50 border-rose-400 text-rose-800";
                              } else {
                                optStyle = "border-slate-100 text-slate-300 cursor-not-allowed";
                              }
                            } else if (isSelected) {
                              optStyle = "bg-red-50 border-red-700 text-red-800 font-bold";
                            }

                            return (
                              <button
                                key={oIdx}
                                type="button"
                                disabled={isPreChecked}
                                onClick={() => handlePreOptionClick(qIdx, oIdx)}
                                className={`p-3 text-left rounded-lg text-[11px] border transition-all cursor-pointer ${optStyle}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {isPreChecked && (
                          <div className="mt-2 text-[11px] bg-slate-100/80 text-slate-600 p-3 rounded-lg border border-slate-200">
                            <span className="font-bold text-slate-800 block mb-0.5">Explanation:</span>
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <div className="flex justify-end gap-3 pt-2">
                    {isPreChecked ? (
                      <button
                        type="button"
                        onClick={handleResetPreQuiz}
                        className="px-3.5 py-1.5 border border-slate-200 text-slate-500 hover:text-slate-800 font-bold text-xs rounded transition-all cursor-pointer bg-white"
                      >
                        Reset Quiz
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleCheckPreQuiz}
                        className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded shadow transition-all cursor-pointer"
                      >
                        Check & Submit Answers
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* EMBEDDED SIMULATOR WORKSPACE TAB */}
              {activeTab === "simulation" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div>
                      <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Embedded Physics Sandbox</h3>
                      <p className="text-[10px] text-slate-400 font-medium">Verify mathematical coordinate points live on the digital twin arm</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleRunInMainSandbox}
                      className="text-[10px] bg-red-50 text-red-700 border border-red-100 px-2 py-1 rounded font-bold hover:bg-red-100 transition-all cursor-pointer"
                    >
                      Maximize in Large Screen
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* Simulator Canvas Frame */}
                    <div className="md:col-span-8 border border-slate-200 rounded-xl overflow-hidden shadow-inner bg-slate-50 flex flex-col justify-between">
                      <canvas
                        ref={canvasRef}
                        width={400}
                        height={240}
                        className="w-full h-[240px] block"
                      />
                    </div>

                    {/* Miniature Controls panel */}
                    <div className="md:col-span-4 bg-slate-50/50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-3">
                      <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">Direct Joint Sliders</span>
                      
                      <div className="space-y-4 flex-1">
                        <div>
                          <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                            <span>Joint Angle θ1</span>
                            <span className="text-red-700">{simTheta1}°</span>
                          </div>
                          <input
                            type="range"
                            min="-180"
                            max="180"
                            value={simTheta1}
                            onChange={(e) => setSimTheta1(parseInt(e.target.value))}
                            className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                            <span>Joint Angle θ2</span>
                            <span className="text-slate-600">{simTheta2}°</span>
                          </div>
                          <input
                            type="range"
                            min="-180"
                            max="180"
                            value={simTheta2}
                            onChange={(e) => setSimTheta2(parseInt(e.target.value))}
                            className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-600"
                          />
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-150">
                        <span className="text-[8.5px] text-slate-400 leading-tight block">
                          Tip coordinates dynamically refresh. Study these values to log observations.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* OBSERVATION TABLE & LEDGER SHEET TAB */}
              {activeTab === "observations" && (
                <div className="space-y-4">
                  <div className="bg-red-50/20 border border-red-100 p-4 rounded-xl">
                    <h4 className="text-xs font-bold text-red-950 uppercase tracking-wider mb-1">Manual Calculations Verification Rig</h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                      Select joint angles, calculate the coordinates using the formulas on the theory page (L1 = 150 px, L2 = 100 px), and submit. The hardware controller twin will evaluate your math accuracy and append the row.
                    </p>
                  </div>

                  {/* Input Form Fields */}
                  <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Joint 1 Angle (θ1)</label>
                        <input
                          type="number"
                          value={calcTheta1}
                          onChange={(e) => setCalcTheta1(parseInt(e.target.value) || 0)}
                          className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs text-slate-800 font-bold focus:border-red-600 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Joint 2 Angle (θ2)</label>
                        <input
                          type="number"
                          value={calcTheta2}
                          onChange={(e) => setCalcTheta2(parseInt(e.target.value) || 0)}
                          className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs text-slate-800 font-bold focus:border-red-600 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Your Calculated X</label>
                        <input
                          type="number"
                          placeholder="e.g. 195.4"
                          value={calcManualX}
                          onChange={(e) => setCalcManualX(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs text-slate-800 font-bold focus:border-red-600 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Your Calculated Y</label>
                        <input
                          type="number"
                          placeholder="e.g. 84.2"
                          value={calcManualY}
                          onChange={(e) => setCalcManualY(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs text-slate-800 font-bold focus:border-red-600 outline-none"
                        />
                      </div>
                    </div>

                    {/* Preset Helpers */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Presets:</span>
                      <button
                        type="button"
                        onClick={() => handlePresetAngles(0, 0)}
                        className="text-[10px] bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded text-slate-600 font-bold cursor-pointer"
                      >
                        [0°, 0°]
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePresetAngles(45, 45)}
                        className="text-[10px] bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded text-slate-600 font-bold cursor-pointer"
                      >
                        [45°, 45°]
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePresetAngles(90, -45)}
                        className="text-[10px] bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded text-slate-600 font-bold cursor-pointer"
                      >
                        [90°, -45°]
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePresetAngles(120, 30)}
                        className="text-[10px] bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded text-slate-600 font-bold cursor-pointer"
                      >
                        [120°, 30°]
                      </button>
                    </div>

                    {obsFeedback && (
                      <div className={`p-3 rounded-lg text-[11px] font-semibold ${
                        obsFeedback.type === "success" 
                          ? "bg-emerald-50 border border-emerald-100 text-emerald-800" 
                          : "bg-rose-50 border border-rose-100 text-rose-800"
                      }`}>
                        {obsFeedback.message}
                      </div>
                    )}

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleVerifyCalculations}
                        className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded shadow transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>VERIFY &amp; APPEND LEDGER</span>
                      </button>
                    </div>
                  </div>

                  {/* Observations Table */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">LABORATORY OBSERVATION TABLE</h4>
                      {currentObservations.length > 0 && (
                        <button
                          type="button"
                          onClick={handleClearObservations}
                          className="text-[10px] text-red-700 hover:text-red-800 font-bold cursor-pointer flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Clear Ledger</span>
                        </button>
                      )}
                    </div>

                    {currentObservations.length === 0 ? (
                      <p className="text-[11px] text-slate-400 italic text-center py-6 border border-dashed border-slate-200 rounded-xl bg-slate-50/20">
                        No observation entries recorded yet. Complete manual entries above to populate.
                      </p>
                    ) : (
                      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm overflow-x-auto">
                        <table className="w-full text-left border-collapse text-[11px]">
                          <thead>
                            <tr className="bg-slate-50 text-slate-400 font-bold border-b border-slate-200">
                              <th className="p-2.5">S.No</th>
                              <th className="p-2.5">θ1 (deg)</th>
                              <th className="p-2.5">θ2 (deg)</th>
                              <th className="p-2.5">Manual X</th>
                              <th className="p-2.5">Manual Y</th>
                              <th className="p-2.5">Simulated X</th>
                              <th className="p-2.5">Simulated Y</th>
                              <th className="p-2.5">Deviation</th>
                              <th className="p-2.5">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                            {currentObservations.map((row) => (
                              <tr key={row.sNo} className="hover:bg-slate-50/50 transition-colors">
                                <td className="p-2.5 font-bold">{row.sNo}</td>
                                <td className="p-2.5">{row.theta1}°</td>
                                <td className="p-2.5">{row.theta2}°</td>
                                <td className="p-2.5 font-mono text-slate-700">{row.calcX}</td>
                                <td className="p-2.5 font-mono text-slate-700">{row.calcY}</td>
                                <td className="p-2.5 font-mono text-slate-400">{row.simX}</td>
                                <td className="p-2.5 font-mono text-slate-400">{row.simY}</td>
                                <td className="p-2.5 text-slate-500 font-mono">{row.error}</td>
                                <td className="p-2.5">
                                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                                    row.status === "Verified" 
                                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                                      : "bg-rose-50 text-rose-700 border border-rose-100"
                                  }`}>
                                    {row.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* POST-LAB QUIZ TAB */}
              {activeTab === "quiz_post" && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Post-Lab Analytics Evaluation</h3>
                    {isPostChecked && (
                      <span className="text-xs bg-red-100 text-red-800 font-bold px-2.5 py-0.5 rounded">
                        Score: {scorePost} / {currentPostQuiz.length}
                      </span>
                    )}
                  </div>

                  {currentPostQuiz.map((q, qIdx) => {
                    const selectedOpt = currentPostAnswers[qIdx];
                    return (
                      <div key={qIdx} className="p-4 border border-slate-200 rounded-xl bg-slate-50/30 space-y-3">
                        <p className="text-xs font-bold text-slate-800">Q{qIdx + 1}: {q.question}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {q.options.map((opt, oIdx) => {
                            const isSelected = selectedOpt === oIdx;
                            const isCorrect = q.correctIndex === oIdx;
                            
                            let optStyle = "border-slate-200 hover:bg-slate-50 text-slate-600";
                            if (isPostChecked) {
                              if (isCorrect) {
                                optStyle = "bg-emerald-50 border-emerald-500 text-emerald-800 font-bold";
                              } else if (isSelected) {
                                optStyle = "bg-rose-50 border-rose-400 text-rose-800";
                              } else {
                                optStyle = "border-slate-100 text-slate-300 cursor-not-allowed";
                              }
                            } else if (isSelected) {
                              optStyle = "bg-red-50 border-red-700 text-red-800 font-bold";
                            }

                            return (
                              <button
                                key={oIdx}
                                type="button"
                                disabled={isPostChecked}
                                onClick={() => handlePostOptionClick(qIdx, oIdx)}
                                className={`p-3 text-left rounded-lg text-[11px] border transition-all cursor-pointer ${optStyle}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {isPostChecked && (
                          <div className="mt-2 text-[11px] bg-slate-100/80 text-slate-600 p-3 rounded-lg border border-slate-200">
                            <span className="font-bold text-slate-800 block mb-0.5">Explanation:</span>
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <div className="flex justify-end gap-3 pt-2">
                    {isPostChecked ? (
                      <button
                        type="button"
                        onClick={handleResetPostQuiz}
                        className="px-3.5 py-1.5 border border-slate-200 text-slate-500 hover:text-slate-800 font-bold text-xs rounded transition-all cursor-pointer bg-white"
                      >
                        Reset Quiz
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleCheckPostQuiz}
                        className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded shadow transition-all cursor-pointer"
                      >
                        Check & Submit Answers
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* CODE SUBMISSION TAB */}
              {activeTab === "submit" && (
                <div className="space-y-4">
                  {selectedExp.status === "graded" ? (
                    <div className="space-y-4">
                      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex gap-3 items-start font-medium text-xs">
                        <Award className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-bold text-emerald-800 font-mono uppercase">LAB GRADED - SCORE: {selectedExp.score}/100</h4>
                          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                            <span className="font-bold text-slate-800">Faculty Evaluation:</span> {selectedExp.feedback}
                          </p>
                          <span className="text-[10px] text-slate-400 font-bold mt-2.5 block">Approved on {selectedExp.submissionDate}</span>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">SUBMITTED CONTROLLER CODE</label>
                        <pre className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-mono text-slate-600 overflow-x-auto">
                          {selectedExp.submissionCode}
                        </pre>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitCode} className="space-y-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">LAB CONTROLLER CODE EDITOR</label>
                          <button
                            type="button"
                            onClick={() => setCodeDraft(selectedExp.codeTemplate)}
                            className="text-[10px] text-red-700 hover:text-red-850 font-bold cursor-pointer"
                          >
                            Reset Template
                          </button>
                        </div>
                        <textarea
                          value={codeDraft}
                          onChange={(e) => setCodeDraft(e.target.value)}
                          rows={9}
                          className="w-full bg-slate-50 border border-slate-200 focus:border-red-600 rounded-lg p-3 text-[11px] font-mono text-slate-800 outline-none resize-none"
                        />
                      </div>

                      {submissionSuccess && (
                        <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded text-xs font-semibold flex items-start gap-1.5 animate-[pulse_3s_infinite]">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Code submitted successfully! Wait for Dr. Nilesh Patil to evaluate your coordinates.</span>
                        </div>
                      )}

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={submitting}
                          className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded shadow transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          {submitting ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>COMPILING CODE...</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-3.5 h-3.5" />
                              <span>SUBMIT FOR EVALUATION</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="border-t border-slate-100 pt-4 mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-red-700" />
              <span className="text-[11px] font-bold text-slate-500">
                Active Sandbox Profile: <span className="text-red-850 font-extrabold">2-DOF planar link</span>
              </span>
            </div>

            {selectedExp.status !== "locked" && (
              <button
                onClick={handleRunInMainSandbox}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-red-700 hover:bg-red-800 text-white rounded text-xs font-bold transition-colors cursor-pointer shadow-sm hover:shadow-md"
              >
                <Play className="w-3.5 h-3.5 fill-white/10" />
                <span>LOAD &amp; RUN IN ROBOT SIMULATOR</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

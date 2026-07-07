import { UserProfile, PracticalExperiment, AttendanceRecord, SystemNotification, ActivityLog, FacultyStudentStats, StudentSubmission } from "../types";

export const DEFAULT_STUDENT: UserProfile = {
  id: "std_01",
  name: "Aarav S. Mehta",
  email: "aarav.mehta@somaiya.edu",
  rollNo: "16010121045",
  role: "student",
  department: "Robotics and Automation Engineering",
  semester: "Semester VI (Third Year)",
  avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120",
  joinedDate: "August 2021",
  attendanceRate: 92.5,
  badges: [
    {
      id: "badge_01",
      title: "Kinematics Master",
      description: "Successfully programmed a 2-DOF robotic arm for 3 target positions.",
      icon: "Award",
      unlockedAt: "2026-03-12",
      color: "from-purple-500 to-indigo-500",
    },
    {
      id: "badge_02",
      title: "PID Whisperer",
      description: "Tuned a joint motor controller with overshoot of less than 2%.",
      icon: "Cpu",
      unlockedAt: "2026-04-05",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "badge_03",
      title: "First Code",
      description: "Completed the first laboratory orientation exercise.",
      icon: "CheckCircle",
      unlockedAt: "2026-01-20",
      color: "from-emerald-500 to-teal-500",
    }
  ],
  skills: [
    { name: "Forward Kinematics", level: 85 },
    { name: "Inverse Kinematics", level: 60 },
    { name: "PID Tuning", level: 78 },
    { name: "ROS 2 Navigation", level: 45 },
    { name: "C++ Microcontrollers", level: 82 }
  ]
};

export const INITIAL_EXPERIMENTS: PracticalExperiment[] = [
  {
    id: "exp_01",
    code: "R-LAB-01",
    title: "Introduction to 2-DOF Forward Kinematics",
    difficulty: "Beginner",
    estimatedTime: "45 mins",
    shortDescription: "Understand coordinates mapping and calculate tip position of a 2-link planar robotic arm.",
    description: "In this practical, you will explore the relationship between the joint angles (theta 1 and theta 2) and the final end-effector position (x, y) of a 2-DOF planar robotic manipulator. You will construct mathematical equations and verify them in the real-time simulation sandbox.",
    theory: `Forward kinematics computes the end-effector position $(X, Y)$ from given joint angles $(\\theta_1, \\theta_2)$. 
For a 2-DOF planar arm with link lengths $L_1$ and $L_2$:
- $X = L_1 \\cos(\\theta_1) + L_2 \\cos(\\theta_1 + \\theta_2)$
- $Y = L_1 \\sin(\\theta_1) + L_2 \\sin(\\theta_1 + \\theta_2)$

By rotating the slider controls or editing the control script, you will calculate and program the arm to match given coordinates.`,
    objectives: [
      "Derive forward kinematics equations for a 2-link planar arm.",
      "Understand frame transformations and trigonometric rotations.",
      "Program a controller in JavaScript/TypeScript to calculate $(X, Y)$ coordinate points."
    ],
    steps: [
      "Read the mathematical theory of link lengths and joint coordinate frames.",
      "Analyze the starting configuration in the Robot Simulator tab.",
      "Write code inside the simulator editor to compute the end-effector position $(x, y)$ using the link variables.",
      "Submit the code and check the calculated end position against target points."
    ],
    codeTemplate: `// K J Somaiya Robotics Virtual Lab - Forward Kinematics Template
// Link 1 length (L1) = 150px, Link 2 length (L2) = 100px
function forwardKinematics(theta1_deg, theta2_deg) {
  // Convert degrees to radians
  const theta1 = (theta1_deg * Math.PI) / 180;
  const theta2 = (theta2_deg * Math.PI) / 180;
  
  const L1 = 150;
  const L2 = 100;
  
  // TODO: Implement the trigonometry formulas
  // X = L1 * cos(theta1) + L2 * cos(theta1 + theta2)
  // Y = L1 * sin(theta1) + L2 * sin(theta1 + theta2)
  const x = 0; 
  const y = 0;
  
  return { x, y };
}`,
    solution: `// K J Somaiya Robotics Virtual Lab - Forward Kinematics Solution
function forwardKinematics(theta1_deg, theta2_deg) {
  const theta1 = (theta1_deg * Math.PI) / 180;
  const theta2 = (theta2_deg * Math.PI) / 180;
  
  const L1 = 150;
  const L2 = 100;
  
  const x = L1 * Math.cos(theta1) + L2 * Math.cos(theta1 + theta2);
  const y = L1 * Math.sin(theta1) + L2 * Math.sin(theta1 + theta2);
  
  return { x, y };
}`,
    status: "graded",
    score: 95,
    feedback: "Excellent math representation! Calculations are 100% accurate. Keep up the clean code format.",
    submissionCode: `function forwardKinematics(theta1_deg, theta2_deg) {
  const theta1 = (theta1_deg * Math.PI) / 180;
  const theta2 = (theta2_deg * Math.PI) / 180;
  
  const L1 = 150;
  const L2 = 100;
  
  const x = L1 * Math.cos(theta1) + L2 * Math.cos(theta1 + theta2);
  const y = L1 * Math.sin(theta1) + L2 * Math.sin(theta1 + theta2);
  
  return { x, y };
}`,
    submissionDate: "2026-03-12"
  },
  {
    id: "exp_02",
    code: "R-LAB-02",
    title: "2-DOF Inverse Kinematics Implementation",
    difficulty: "Intermediate",
    estimatedTime: "60 mins",
    shortDescription: "Calculate required joint angles to place the end-effector at specific coordinate targets.",
    description: "Unlike forward kinematics, inverse kinematics calculates the joint angles needed to achieve a specific end-effector target coordinate $(X, Y)$. This is crucial for trajectory planning and industrial pick-and-place robots.",
    theory: `For a 2-DOF planar arm with link lengths $L_1$ and $L_2$ and target coordinates $(X, Y)$:
- $\\cos(\\theta_2) = \\frac{X^2 + Y^2 - L_1^2 - L_2^2}{2 L_1 L_2}$
- $\\theta_2 = \\pm \\arccos(\\cos(\\theta_2))$  (elbow-up and elbow-down solutions)
- $\\theta_1 = \\arctan2(Y, X) - \\arctan2(L_2 \\sin(\\theta_2), L_1 + L_2 \\cos(\\theta_2))$

These formulas will let you write a script that drives the simulated robotic arm automatically to your cursor target.`,
    objectives: [
      "Derive geometrical equations for inverse kinematics.",
      "Handle multiple configurations (elbow-up and elbow-down configurations).",
      "Develop code that dynamically moves the joints to reach user target coordinates $(X, Y)$."
    ],
    steps: [
      "Study cosine rule and algebraic solutions for 2D arms.",
      "Check the interactive Inverse Kinematics visualizer in the Simulator tab.",
      "Complete the code editor script using Math.acos and Math.atan2 functions.",
      "Verify convergence by clicking on the simulator screen and ensuring the arm snaps to your cursor position."
    ],
    codeTemplate: `// K J Somaiya Robotics Virtual Lab - Inverse Kinematics Template
// Link lengths: L1 = 150px, L2 = 100px
function inverseKinematics(targetX, targetY) {
  const L1 = 150;
  const L2 = 100;
  
  // Calculate cosine of theta 2
  const cosTheta2 = (targetX*targetX + targetY*targetY - L1*L1 - L2*L2) / (2 * L1 * L2);
  
  // Check if position is reachable
  if (Math.abs(cosTheta2) > 1) {
    return null; // Position out of workspace bounds!
  }
  
  // TODO: Compute theta2 (elbow up solution) and then theta1
  // Use Math.acos and Math.atan2
  let theta2_rad = 0;
  let theta1_rad = 0;
  
  // Convert back to degrees
  const theta1 = (theta1_rad * 180) / Math.PI;
  const theta2 = (theta2_rad * 180) / Math.PI;
  
  return { theta1, theta2 };
}`,
    solution: `// K J Somaiya Robotics Virtual Lab - Inverse Kinematics Solution
function inverseKinematics(targetX, targetY) {
  const L1 = 150;
  const L2 = 100;
  
  const d2 = targetX * targetX + targetY * targetY;
  const cosTheta2 = (d2 - L1 * L1 - L2 * L2) / (2 * L1 * L2);
  
  if (Math.abs(cosTheta2) > 1) {
    return null; // unreachable
  }
  
  // Elbow up solution
  const theta2_rad = -Math.acos(cosTheta2);
  
  const k1 = L1 + L2 * Math.cos(theta2_rad);
  const k2 = L2 * Math.sin(theta2_rad);
  const theta1_rad = Math.atan2(targetY, targetX) - Math.atan2(k2, k1);
  
  const theta1 = (theta1_rad * 180) / Math.PI;
  const theta2 = (theta2_rad * 180) / Math.PI;
  
  return { theta1, theta2 };
}`,
    status: "available"
  },
  {
    id: "exp_03",
    code: "R-LAB-03",
    title: "PID Controller Joint Angle Tuning",
    difficulty: "Intermediate",
    estimatedTime: "50 mins",
    shortDescription: "Design and tune a PID feedback control loop to minimize overshoot and steady-state error on a joint motor.",
    description: "In industrial robotics, joints are driven by DC servo motors. These require precise feedback controller loops. In this lab, you will write a PID (Proportional-Integral-Derivative) algorithm to drive a joint to a step angle.",
    theory: `The PID controller output is computed as:
$u(t) = K_p e(t) + K_i \\int_0^t e(\\tau)d\\tau + K_d \\frac{de(t)}{dt}$
Where error is $e(t) = \\text{setpoint} - \\text{process\\_variable}$.

You will adjust proportional ($K_p$), integral ($K_i$), and derivative ($K_d$) parameters inside the simulator controls to achieve perfect alignment without high-frequency oscillation or steady-state offset.`,
    objectives: [
      "Explain the impact of KP, KI, and KD gains on transient systems.",
      "Code a discrete-time PID control loop.",
      "Determine ideal gains using manual tuning and Ziegler-Nichols concepts."
    ],
    steps: [
      "Examine the response curve under default $K_p = 1, K_i = 0, K_d = 0$. Notice the severe oscillation.",
      "Implement the PID discrete equation: $P = K_p \\cdot e$, $I = I + e \\cdot dt$, $D = (e - \\text{lastErr}) / dt$.",
      "Slowly increase $K_d$ to dampen the overshoot.",
      "Observe and record optimal variables to achieve stable settling under 0.8 seconds."
    ],
    codeTemplate: `// K J Somaiya Robotics Virtual Lab - PID controller loop
// This function runs dynamically every time step (dt)
let integralError = 0;
let lastError = 0;

function calculatePID(currentAngle, targetAngle, dt, Kp, Ki, Kd) {
  const error = targetAngle - currentAngle;
  
  // TODO: Compute P, I, D terms
  // Hint: Integral accumulates error * dt. Derivative is (error - lastError) / dt.
  integralError += error * dt;
  const derivative = (error - lastError) / dt;
  
  const output = Kp * error + Ki * integralError + Kd * derivative;
  
  lastError = error;
  return output; // motor output torque/voltage
}`,
    solution: `// K J Somaiya Robotics Virtual Lab - PID controller loop
let integralError = 0;
let lastError = 0;

function calculatePID(currentAngle, targetAngle, dt, Kp, Ki, Kd) {
  const error = targetAngle - currentAngle;
  
  integralError += error * dt;
  // Anti-windup (constraining integral accumulation)
  integralError = Math.max(-50, Math.min(50, integralError));
  
  const derivative = (error - lastError) / dt;
  const output = Kp * error + Ki * integralError + Kd * derivative;
  
  lastError = error;
  return output;
}`,
    status: "available"
  },
  {
    id: "exp_04",
    code: "R-LAB-04",
    title: "Autonomous Rover Pathfinding and ROS 2 Navigation",
    difficulty: "Advanced",
    estimatedTime: "75 mins",
    shortDescription: "Program an autonomous mobile robot (AMR) using obstacle avoidance grids and coordinate maps.",
    description: "In this virtual lab experiment, students explore automated navigation concepts. You will write pathfinding or avoidance vectors to safely guide a rover through a simulated lab coordinate space filled with virtual obstacles.",
    theory: `Mobile robots map their environment to form occupancy grids. Path planning is modeled using graph search (e.g. A* or Dijkstra) or simpler obstacle avoidance vector fields (Potential Field Methods).
The repelling force vector $F_{rep}$ push the robot away from obstacles:
$F_{rep} = \\frac{1}{d^2} (\\text{robot\\_pos} - \\text{obstacle\\_pos})$
The attracting force vector $F_{att}$ pulls the robot to the goal:
$F_{att} = K_{att} (\\text{goal\\_pos} - \\text{robot\\_pos})$
The total force determines the robot's heading direction.`,
    objectives: [
      "Define occupancy grids and coordinate frames.",
      "Combine attractive and repulsive forces to compute autonomous heading angles.",
      "Debug stuck configurations (local minima)."
    ],
    steps: [
      "Examine the Rover sandbox with boundary obstacles.",
      "Initialize standard attractive forces towards the green beacon.",
      "Add reactive repulsive forces that increase exponentially as the distance to red cubes shrinks under 60 pixels.",
      "Run the rover and verify that it avoids all hazards and reaches the docking station successfully."
    ],
    codeTemplate: `// K J Somaiya Robotics Virtual Lab - Rover Vector Navigator
function navigateRover(roverX, roverY, goalX, goalY, obstacles) {
  // Goal Attraction vector
  let fx = goalX - roverX;
  let fy = goalY - roverY;
  
  // Normalize attraction force
  const goalDist = Math.sqrt(fx*fx + fy*fy);
  if (goalDist > 0) {
    fx = (fx / goalDist) * 3; // base speed
    fy = (fy / goalDist) * 3;
  }
  
  // TODO: Add Obstacle Repulsion vectors
  // Loop through obstacles and apply repulsive forces
  obstacles.forEach(obs => {
    const dx = roverX - obs.x;
    const dy = roverY - obs.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    
    // If close to obstacle, apply pushing force
    if (dist < 60) {
      const repForce = (60 - dist) / 10; // increases closer to obstacle
      fx += (dx / dist) * repForce;
      fy += (dy / dist) * repForce;
    }
  });
  
  // Return heading components
  return { vx: fx, vy: fy };
}`,
    solution: `// K J Somaiya Robotics Virtual Lab - Rover Vector Navigator
function navigateRover(roverX, roverY, goalX, goalY, obstacles) {
  let fx = goalX - roverX;
  let fy = goalY - roverY;
  
  const goalDist = Math.sqrt(fx*fx + fy*fy);
  if (goalDist > 0) {
    fx = (fx / goalDist) * 4;
    fy = (fy / goalDist) * 4;
  }
  
  obstacles.forEach(obs => {
    const dx = roverX - obs.x;
    const dy = roverY - obs.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    const safeRadius = 60;
    
    if (dist < safeRadius) {
      const strength = (safeRadius - dist) * 1.5;
      fx += (dx / dist) * strength;
      fy += (dy / dist) * strength;
    }
  });
  
  return { vx: fx, vy: fy };
}`,
    status: "locked"
  }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: "att_01",
    date: "2026-03-12",
    status: "present",
    experimentTitle: "R-LAB-01: Introduction to 2-DOF Forward Kinematics",
    duration: "1h 30m",
    facilitator: "Dr. Nilesh Patil"
  },
  {
    id: "att_02",
    date: "2026-03-26",
    status: "present",
    experimentTitle: "R-LAB-02: Geometrical Coordinate Spaces & Calibration",
    duration: "1h 45m",
    facilitator: "Dr. Nilesh Patil"
  },
  {
    id: "att_03",
    date: "2026-04-09",
    status: "present",
    experimentTitle: "R-LAB-03: PID Servo Controller Feedback Tuning",
    duration: "2h 00m",
    facilitator: "Prof. S. R. Desai"
  },
  {
    id: "att_04",
    date: "2026-04-23",
    status: "present",
    experimentTitle: "R-LAB-04: Mobile Robot Odometry Mapping Orientation",
    duration: "1h 15m",
    facilitator: "Prof. S. R. Desai"
  },
  {
    id: "att_05",
    date: "2026-05-07",
    status: "late",
    experimentTitle: "R-LAB-05: Artificial Vision Camera Calibration Setup",
    duration: "1h 30m",
    facilitator: "Dr. Nilesh Patil"
  }
];

export const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: "not_01",
    title: "Practical Submitted Successfully",
    message: "Your code for R-LAB-01 'Introduction to 2-DOF Forward Kinematics' was processed and graded with a score of 95/100.",
    timestamp: "2026-03-13 14:22",
    type: "success",
    read: false
  },
  {
    id: "not_02",
    title: "New Practical Experiment Released",
    message: "Dr. Nilesh Patil released 'R-LAB-03: PID Controller Joint Angle Tuning'. Submit your solution before May 25.",
    timestamp: "2026-04-10 09:15",
    type: "info",
    read: false
  },
  {
    id: "not_03",
    title: "Robotics Hardware Offline",
    message: "Lab Joint arm motor #2 is undergoing hardware maintenance. Please use Simulator Workspace mode to execute calculations.",
    timestamp: "2026-05-06 17:40",
    type: "warning",
    read: true
  }
];

export const INITIAL_ACTIVITIES: ActivityLog[] = [
  {
    id: "act_01",
    user: "Aarav Mehta",
    action: "Run Simulation",
    target: "2-DOF Arm Forward Pathing",
    timestamp: "2 hours ago",
    type: "simulation"
  },
  {
    id: "act_02",
    user: "Aarav Mehta",
    action: "Completed",
    target: "R-LAB-01 kinematics derivation quiz",
    timestamp: "1 day ago",
    type: "experiment"
  },
  {
    id: "act_03",
    user: "Aarav Mehta",
    action: "Marked Present",
    target: "Laboratory Lecture #05",
    timestamp: "2 days ago",
    type: "attendance"
  },
  {
    id: "act_04",
    user: "Aarav Mehta",
    action: "Saved Script Draft",
    target: "Inverse Kinematics solver function",
    timestamp: "3 days ago",
    type: "simulation"
  }
];

// Faculty / Admin Mock Records
export const MOCK_STUDENTS_LIST: FacultyStudentStats[] = [
  {
    id: "std_01",
    name: "Aarav S. Mehta",
    rollNo: "16010121045",
    attendanceRate: 92.5,
    completedCount: 3,
    pendingCount: 1,
    averageScore: 95,
    status: "active"
  },
  {
    id: "std_02",
    name: "Prisha K. Shah",
    rollNo: "16010121012",
    attendanceRate: 98.2,
    completedCount: 4,
    pendingCount: 0,
    averageScore: 92.3,
    status: "active"
  },
  {
    id: "std_03",
    name: "Vivaan R. Sharma",
    rollNo: "16010121088",
    attendanceRate: 85.0,
    completedCount: 2,
    pendingCount: 2,
    averageScore: 84.5,
    status: "active"
  },
  {
    id: "std_04",
    name: "Ananya Patel",
    rollNo: "16010121004",
    attendanceRate: 72.4,
    completedCount: 1,
    pendingCount: 3,
    averageScore: 78.0,
    status: "inactive"
  },
  {
    id: "std_05",
    name: "Kabir S. Deshmukh",
    rollNo: "16010121033",
    attendanceRate: 95.0,
    completedCount: 3,
    pendingCount: 1,
    averageScore: 90.5,
    status: "active"
  }
];

export const MOCK_STUDENT_SUBMISSIONS: StudentSubmission[] = [
  {
    id: "sub_01",
    studentName: "Aarav S. Mehta",
    rollNo: "16010121045",
    experimentId: "exp_01",
    experimentTitle: "Introduction to 2-DOF Forward Kinematics",
    submittedCode: `function forwardKinematics(theta1_deg, theta2_deg) {
  const theta1 = (theta1_deg * Math.PI) / 180;
  const theta2 = (theta2_deg * Math.PI) / 180;
  const L1 = 150;
  const L2 = 100;
  const x = L1 * Math.cos(theta1) + L2 * Math.cos(theta1 + theta2);
  const y = L1 * Math.sin(theta1) + L2 * Math.sin(theta1 + theta2);
  return { x, y };
}`,
    submissionDate: "2026-03-12 11:40",
    status: "graded",
    grade: "95/100",
    feedback: "Excellent layout representation, equations are beautifully implemented!"
  },
  {
    id: "sub_02",
    studentName: "Prisha K. Shah",
    rollNo: "16010121012",
    experimentId: "exp_02",
    experimentTitle: "2-DOF Inverse Kinematics Implementation",
    submittedCode: `function inverseKinematics(targetX, targetY) {
  const L1 = 150;
  const L2 = 100;
  const d2 = targetX * targetX + targetY * targetY;
  const cosTheta2 = (d2 - L1 * L1 - L2 * L2) / (2 * L1 * L2);
  if (Math.abs(cosTheta2) > 1) return null;
  const theta2_rad = -Math.acos(cosTheta2);
  const k1 = L1 + L2 * Math.cos(theta2_rad);
  const k2 = L2 * Math.sin(theta2_rad);
  const theta1_rad = Math.atan2(targetY, targetX) - Math.atan2(k2, k1);
  return {
    theta1: (theta1_rad * 180) / Math.PI,
    theta2: (theta2_rad * 180) / Math.PI
  };
}`,
    submissionDate: "2026-03-24 14:05",
    status: "pending"
  },
  {
    id: "sub_03",
    studentName: "Vivaan R. Sharma",
    rollNo: "16010121088",
    experimentId: "exp_01",
    experimentTitle: "Introduction to 2-DOF Forward Kinematics",
    submittedCode: `function forwardKinematics(theta1, theta2) {
  // Rough math attempt
  const t1 = theta1 * 0.01745;
  const t2 = theta2 * 0.01745;
  return {
    x: 150 * Math.cos(t1) + 100 * Math.cos(t1 + t2),
    y: 150 * Math.sin(t1) + 100 * Math.sin(t1 + t2)
  };
}`,
    submissionDate: "2026-03-22 18:30",
    status: "graded",
    grade: "88/100",
    feedback: "Math is correct but avoid hardcoding the pi conversion multiplier (0.01745). Use Math.PI instead for accuracy."
  }
];

export const MOCK_LAB_EQUIPMENT = [
  { id: "eq_01", name: "Articulated Joint Robotic Arm #1", model: "Kuka KR 6 R900", status: "Online", utilization: "84%", load: "Low" },
  { id: "eq_02", name: "Joint Motor Training Station #2", model: "Somaiya Motor Rig v2", status: "Maintenance", utilization: "0%", load: "Offline" },
  { id: "eq_03", name: "Mobile Autonomous Rover Unit #3", model: "TurtleBot 4 Pro", status: "Online", utilization: "45%", load: "Medium" },
  { id: "eq_04", name: "Computer Vision Station #4", model: "Nvidia Jetson Nano Rig", status: "Online", utilization: "92%", load: "High" }
];

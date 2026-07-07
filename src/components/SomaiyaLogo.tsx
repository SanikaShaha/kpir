import React from "react";

interface SomaiyaLogoProps {
  sizeClassName?: string;
}

export default function SomaiyaLogo({ sizeClassName = "w-10 h-10" }: SomaiyaLogoProps) {
  return (
    <div className={`flex items-center justify-center shrink-0 ${sizeClassName}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-[0_2px_8px_rgba(169,32,38,0.25)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Shield Outer Shadow or Border */}
        <path
          d="M 50 5 Q 85 5 85 45 C 85 72 50 95 50 95 C 50 95 15 72 15 45 Q 15 5 50 5 Z"
          fill="#A92026"
          stroke="#F1B922"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Inner Gold Shield Accent */}
        <path
          d="M 50 9 Q 81 9 81 44 C 81 68 50 89 50 89 C 50 89 19 68 19 44 Q 19 9 50 9 Z"
          stroke="#F1B922"
          strokeWidth="1.2"
          strokeDasharray="3 1.5"
          fill="none"
        />

        {/* Coconut & Mango Leaves (Kalasha Contents) */}
        {/* Left Leaf */}
        <path
          d="M 50 48 C 42 42 32 40 25 43 C 32 47 42 48 50 48 Z"
          fill="#F1B922"
          opacity="0.9"
        />
        {/* Right Leaf */}
        <path
          d="M 50 48 C 58 42 68 40 75 43 C 68 47 58 48 50 48 Z"
          fill="#F1B922"
          opacity="0.9"
        />
        {/* Center-Left Leaf */}
        <path
          d="M 50 48 C 46 38 38 30 32 26 C 40 33 46 41 50 48 Z"
          fill="#F1B922"
        />
        {/* Center-Right Leaf */}
        <path
          d="M 50 48 C 54 38 62 30 68 26 C 60 33 54 41 50 48 Z"
          fill="#F1B922"
        />
        {/* Central Tall Leaf */}
        <path
          d="M 50 48 Q 50 25 50 18 Q 53 25 50 48"
          fill="#F1B922"
        />

        {/* The Coconut */}
        <path
          d="M 44 48 C 44 38 50 31 50 31 C 50 31 56 38 56 48 Z"
          fill="#FFFFFF"
          stroke="#F1B922"
          strokeWidth="1.5"
        />
        {/* Coconut fiber details */}
        <path d="M 50 31 L 50 42" stroke="#F1B922" strokeWidth="1" />
        <path d="M 47 35 L 50 40" stroke="#F1B922" strokeWidth="0.75" />
        <path d="M 53 35 L 50 40" stroke="#F1B922" strokeWidth="0.75" />

        {/* Kalasha Neck / Rim */}
        <rect x="40" y="47" width="20" height="4" rx="2" fill="#F1B922" />
        <rect x="38" y="50" width="24" height="2" rx="1" fill="#FFFFFF" />

        {/* Kalasha Pot (Purnaghata) */}
        <path
          d="M 39 52 C 32 58 32 68 50 72 C 68 68 68 58 61 52 Z"
          fill="#F1B922"
          stroke="#FFFFFF"
          strokeWidth="1.5"
        />
        {/* Decorative thread (Mauli/Kalawa) around Kalasha body */}
        <path
          d="M 34 59 Q 50 64 66 59"
          stroke="#A92026"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M 33 62 Q 50 67 67 62"
          stroke="#A92026"
          strokeWidth="1.5"
          fill="none"
        />

        {/* Swastika or sacred mark on Kalasha */}
        <path
          d="M 48 55 L 52 55 M 50 53 L 50 57 M 48 53 L 48 55 M 52 55 L 52 57"
          stroke="#A92026"
          strokeWidth="0.75"
          strokeLinecap="round"
          fill="none"
          opacity="0.8"
        />

        {/* Stand / Base of the Kalasha */}
        <path
          d="M 43 72 C 43 72 41 77 41 77 C 41 77 59 77 59 77 C 59 77 57 72 57 72 Z"
          fill="#F1B922"
          stroke="#FFFFFF"
          strokeWidth="1"
        />

        {/* Sanskrit Motto: "ज्ञानादेव तु कैवल्यम्" */}
        <text
          x="50"
          y="84"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="4.5"
          fontWeight="bold"
          fontFamily="sans-serif, Inter"
          letterSpacing="0.1"
        >
          ज्ञानादेव तु कैवल्यम्
        </text>
      </svg>
    </div>
  );
}

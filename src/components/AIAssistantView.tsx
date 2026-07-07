import { useState } from "react";
import { Bot, Send, Terminal, HelpCircle, ArrowRight, Trash2, ShieldAlert } from "lucide-react";
import { ChatMessage } from "../types";
import { motion } from "motion/react";

interface AIAssistantViewProps {
  chatHistory: ChatMessage[];
  onAddChatMessage: (msg: ChatMessage) => void;
  onClearChat: () => void;
}

const PRESET_PROMPTS = [
  { label: "Damp PID oscillations", text: "How do I damp oscillations in my robotic arm motor control? Explain with proportional, integral, and derivative gain impacts." },
  { label: "3-DOF coordinate frames", text: "Explain how to set up Denavit-Hartenberg (D-H) parameters for a 3-DOF articulated robotic arm." },
  { label: "Jacobian matrices", text: "What is a Jacobian matrix in robotics and how does it relate joint velocities to Cartesian end-effector velocities?" },
  { label: "ROS 2 Navigation nodes", text: "Write an outline of a ROS 2 node in Python that subscribes to /scan lidar topic and commands velocity to /cmd_vel." }
];

export default function AIAssistantView({ chatHistory, onAddChatMessage, onClearChat }: AIAssistantViewProps) {
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    // 1. Create student message
    const studentMsg: ChatMessage = {
      id: "msg_" + Date.now(),
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    onAddChatMessage(studentMsg);
    setUserInput("");
    setIsLoading(true);
    setErrorMessage("");

    // Create message history formatted for our API endpoint
    const currentHistory = chatHistory.map(m => ({
      role: m.role,
      content: m.content
    }));
    
    const messagesToSend = [...currentHistory, { role: "user", content: textToSend }];

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ messages: messagesToSend })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to communicate with the academic assistant.");
      }

      const data = await response.json();

      // 2. Create AI message response
      const aiResponse: ChatMessage = {
        id: "msg_" + (Date.now() + 1),
        role: "assistant",
        content: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      onAddChatMessage(aiResponse);
    } catch (err: any) {
      console.error("AI Error:", err);
      setErrorMessage(err.message || "Could not reach the AI server. Ensure GEMINI_API_KEY is configured in Settings > Secrets.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="ai-assistant-panel" className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-850 flex items-center gap-2">
            <Bot className="w-5 h-5 text-red-700" />
            <span>KJSCE AI Laboratory Research Companion</span>
          </h1>
          <p className="text-slate-500 text-xs font-medium mt-0.5">High-capability model tailored for kinematics, control loops, and ROS development</p>
        </div>
        
        {chatHistory.length > 0 && (
          <button
            onClick={onClearChat}
            className="text-xs text-red-700 hover:text-red-850 border border-slate-200 bg-white shadow-sm hover:bg-slate-50 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer font-bold"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-600" />
            <span>Clear Terminal Feed</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Preset Topics Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-red-700" />
              <span>Syllabus Help</span>
            </h3>
            
            <p className="text-[11px] text-slate-500 leading-relaxed mb-4 font-medium">
              Click any recommended prompt to query the research model about standard laboratory topics:
            </p>

            <div className="space-y-2">
              {PRESET_PROMPTS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => handleSend(p.text)}
                  disabled={isLoading}
                  className="w-full text-left p-2.5 bg-slate-50 hover:bg-white border border-slate-200 hover:border-red-600/50 rounded-xl text-[10.5px] font-semibold text-slate-600 hover:text-red-700 transition-all cursor-pointer block leading-normal disabled:opacity-40 disabled:cursor-not-allowed shadow-sm hover:shadow"
                >
                  <span className="flex items-center justify-between gap-1.5">
                    <span>{p.label}</span>
                    <ArrowRight className="w-3 h-3 text-red-600 shrink-0" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Conversation Engine */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between h-[520px]">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4 scrollbar-thin">
            {chatHistory.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-4">
                <div className="w-12 h-12 bg-red-50 border border-red-100 text-red-700 rounded-2xl flex items-center justify-center">
                  <Bot className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-700">Awaiting Connection...</h4>
                  <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed font-medium">
                    Say hello! You can ask kinematics coordinate questions, check ROS 2 parameters, or request advice on dampening stepper oscillations.
                  </p>
                </div>
              </div>
            ) : (
              chatHistory.map((msg) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                  >
                    {/* Icon */}
                    <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center border text-xs font-bold ${
                      isUser 
                        ? "bg-slate-50 border-slate-200 text-slate-700"
                        : "bg-red-50 border-red-100 text-red-700"
                    }`}>
                      {isUser ? "ME" : <Bot className="w-4 h-4" />}
                    </div>

                    {/* Speech card */}
                    <div className={`p-4 rounded-xl border text-xs leading-relaxed space-y-1 font-medium ${
                      isUser
                        ? "bg-red-50/50 border-red-100 text-slate-800 rounded-tr-none"
                        : "bg-slate-50 border-slate-150 text-slate-700 rounded-tl-none"
                    }`}>
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      <span className="text-[9px] text-slate-400 font-bold block text-right pt-1">{msg.timestamp}</span>
                    </div>
                  </div>
                );
              })
            )}

            {/* Scanning indicator */}
            {isLoading && (
              <div className="flex gap-3 mr-auto max-w-[85%]">
                <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center bg-red-50 border border-red-100 text-red-700">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-red-700 animate-pulse flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>COMPUTING SYSTEM MATRICES...</span>
                </div>
              </div>
            )}

            {/* Secure warning if API Key not set */}
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl text-xs font-medium flex items-start gap-2 max-w-xl mx-auto shadow-sm">
                <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold uppercase block text-rose-850">Security / Key Alert</span>
                  <p className="mt-0.5 leading-relaxed">{errorMessage}</p>
                </div>
              </div>
            )}
          </div>

          {/* User Input controls */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(userInput);
            }}
            className="flex gap-2 bg-slate-50 p-2 border border-slate-200 focus-within:border-red-600 rounded-xl transition-all"
          >
            <input
              type="text"
              required
              disabled={isLoading}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask a technical kinematics or controller question..."
              className="flex-1 bg-transparent text-xs text-slate-800 outline-none px-2 py-1.5 placeholder-slate-400 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !userInput.trim()}
              className="bg-red-700 hover:bg-red-800 text-white p-2 rounded-lg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

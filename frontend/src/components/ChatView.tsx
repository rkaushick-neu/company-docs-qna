import React, { useState, useEffect, useRef } from "react";
import type { KeyboardEvent } from "react";
import type { Employee, Message, ChatResponse } from "../types";
import MarkdownRenderer from "./MarkdownRenderer";
import { API_BASE } from "../types";


// ---------- Chat View ----------
interface ChatProps {
    employee: Employee;
    onLogout: () => void;
  }
  
  const ChatView: React.FC<ChatProps> = ({ employee, onLogout }) => {
    const [input, setInput] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [sending, setSending] = useState<boolean>(false);
    const endRef = useRef<HTMLDivElement | null>(null);
  
    const sendMessage = async () => {
      if (!input.trim()) return;
      const msg = input.trim();
      setInput("");
      setMessages((m) => [...m, { role: "user", text: msg }]);
      setSending(true);
      try {
        const res = await fetch(`${API_BASE}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: msg,
            department: employee.department,
            employeeId: employee.employeeId,
          }),
        });
        const data: ChatResponse = await res.json();
        console.log(data);
        // const data1: [ChatResponse] = [
        //   {
        //       "output": "A major benefit of deploying data-driven marketing in financial services is the ability to identify consumers who are not only interested in a product but are also financially qualified for it. By combining consumer financial and economic data with browsing habits, advertisers can move beyond targeting inaccurate \"intenders\" who may be researching products but do not meet the qualification thresholds. This ensures marketing messages are put in front of consumers who match the characteristics of actual buyers.\n\nAdditionally, these solutions help financial institutions meet regulatory and compliance requirements, such as preparing for regulatory reviews, addressing disparate impact inquiries, and adhering to Community Reinvestment Act (CRA) guidelines.\n\nSources:\n- [equifax_marketing_1.pdf](https://drive.google.com/file/d/1oJAQ13CCSVhhiSvQ0hA4ladwvEUZChQ9/view?usp=drivesdk)\nFound on page 4\n- [equifax_marketing_2.pdf](https://drive.google.com/file/d/1KSrkG1fTDzZcL5E_vC1pTwww5g0rWFSP/view?usp=drivesdk)\nFound on page 4"
        //   }
        // ];
        // const data2: ChatResponse = data1[0];
        // if (data.ok && data.data) {
          // setMessages((m) => [...m, { role: "assistant", text: data.data.answer }]);
        if (data.ok && data.data){
            setMessages((m) => [...m, { role: "assistant", text: data.data?data.data.output:""}]);
        } else {
          // throw new Error(data.detail || "Chat error");
          throw new Error("Chat Error: Issue retrieving it from the server.")
        }
      } catch (err: any) {
        setMessages((m) => [...m, { role: "assistant", text: "Error: " + err.message }]);
      } finally {
        setSending(false);
      }
    };
  
    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    };
  
    useEffect(() => {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
  
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-orange-800 to-amber-700">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/background.png')"
          }}
        ></div>
      </div>

      {/* Header with Frosted Glass */}
      <header className="relative bg-white/10 backdrop-blur-2xl border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <h2 className="font-semibold text-white">United RAG Chat</h2>
          <div className="flex items-center gap-2 text-sm text-white">
            <span>{employee.employeeName}</span>
            <span className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full border border-white/30">
              {employee.department}
            </span>
            <button
              onClick={onLogout}
              className="ml-2 px-3 py-1 border border-white/30 bg-white/10 backdrop-blur-sm text-white rounded-full hover:bg-white/20 transition-all duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Frosted Glass Container */}
      <div className="flex-1 p-8 relative z-10">
        <div>
          {/* Large Frosted Glass Box */}
          <div className="h-full w-full bg-black/30 backdrop-blur-2xl rounded-3xl border border-gray-600/30 shadow-2xl flex flex-col overflow-hidden">
            
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
              {messages.length === 0 && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-white/80">
                    <div className="text-lg font-medium mb-2">Welcome to United RAG Chat</div>
                    <div className="text-sm text-white/60">Ask me anything about {employee.department} documents...</div>
                  </div>
                </div>
              )}
              
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm shadow-lg border backdrop-blur-xl max-w-[80%] ${
                      m.role === "user"
                        ? "bg-gradient-to-r from-blue-600/40 to-purple-600/40 text-white border-blue-500/30"
                        : "bg-gray-800/60 text-white border-gray-600/30"
                    }`}
                  >
                    {m.role === "assistant" ? (
                      <MarkdownRenderer content={m.text} />
                    ) : (
                      m.text
                    )}
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>

            {/* Input Area */}
            <div className="px-6 py-4 border-t border-gray-600/30 bg-gray-900/40 backdrop-blur-xl">
              <div className="flex gap-3">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Ask about ${employee.department} documents...`}
                  className="flex-1 min-h-[48px] rounded-2xl bg-gray-800/60 backdrop-blur-sm border border-gray-600/40 text-white placeholder-gray-400 px-4 py-3 focus:ring-2 focus:ring-blue-500/50 focus:bg-gray-700/60 transition-all duration-200 resize-none"
                />
                <button
                  onClick={sendMessage}
                  disabled={sending || !input.trim()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl px-6 py-3 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-200 shadow-lg font-medium"
                >
                  {sending ? "..." : "Send"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  };

export default ChatView;
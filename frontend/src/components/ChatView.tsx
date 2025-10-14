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
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="border-b bg-white sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
            <h2 className="font-semibold text-gray-800">United RAG Chat</h2>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span>{employee.employeeName}</span>
              <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">
                {employee.department}
              </span>
              <button
                onClick={onLogout}
                className="ml-2 px-3 py-1 border rounded-full hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        </header>
  
        <main className="flex-1 overflow-y-auto px-4 py-6 max-w-3xl mx-auto w-full">
          {messages.map((m, i) => (
            <div key={i} className={`my-2 flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`px-4 py-2 rounded-2xl text-sm shadow ${
                  m.role === "user"
                    ? "bg-indigo-600 text-white max-w-[80%]"
                    : "bg-gray-100 text-gray-900 max-w-[90%]"
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
        </main>
  
        <footer className="border-t bg-white px-4 py-3 flex gap-2 max-w-3xl mx-auto w-full">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask about ${employee.department} documents...`}
            className="flex-1 min-h-[44px] rounded-2xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 resize-none"
          />
          <button
            onClick={sendMessage}
            disabled={sending || !input.trim()}
            className="bg-indigo-600 text-white rounded-2xl px-5 py-2 hover:bg-indigo-700 disabled:opacity-50"
          >
            {sending ? "..." : "Send"}
          </button>
        </footer>
      </div>
    );
  };

export default ChatView;
import React, { useState } from "react";
import type { FormEvent } from "react";
import type { Employee } from "../types";
import { API_BASE } from "../types";


// ---------- Login View ----------
interface LoginProps {
    onLogin: (employee: Employee) => void;
  }
  
  const LoginView: React.FC<LoginProps> = ({ onLogin }) => {
    const [employeeId, setEmployeeId] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
  
    const handleLogin = async (e: FormEvent) => {
      e.preventDefault();
      setError("");
      if (!employeeId.trim()) {
        setError("Please enter your Employee ID");
        return;
      }
      setLoading(true);
      try {
        console.log(`${API_BASE}`);
        const res = await fetch(`${API_BASE}/api/getEmployeeData?employeeId=${employeeId}`);
        const data = await res.json();
        if (!data.ok) throw new Error(data.detail || "Invalid ID");
        onLogin(data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Background Image - You can replace this with your landscape image */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-green-400 to-yellow-300">
          {/* Placeholder for your landscape background image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/background.png')"
            }}
          ></div>
        </div>
        
        {/* Frosted Glass Login Panel */}
        <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-[2rem] p-8 w-full max-w-sm text-center mx-4">
          {/* Subtle inner glow */}
          <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="rounded-full bg-white/10 backdrop-blur-sm p-3 mb-6 mx-auto w-24 h-24 flex items-center justify-center">
              <img src="./company_logo3.png" alt="Company Logo" className="w-16 h-16 rounded-full object-cover object-center" />
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-2">Login</h1>
            <p className="text-white/80 text-sm mb-8">Welcome back please login to your account</p>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="relative">
                <input
                  className="w-full text-center rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 px-4 py-4 outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/25 transition-all duration-200"
                  placeholder="User Name"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  disabled={loading}
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-white/70" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              <div className="relative">
                <input
                  type="password"
                  className="w-full text-center rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 px-4 py-4 outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/25 transition-all duration-200"
                  placeholder="Password"
                  disabled={loading}
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-white/70" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                </div>
              </div>
              
              <div className="flex items-center justify-center space-x-2 text-white/80 text-sm">
                <div className="w-4 h-4 rounded bg-green-500 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Remember me</span>
              </div>
              
              {error && <p className="text-red-300 text-sm">{error}</p>}
              
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-600 text-white py-4 font-semibold hover:from-green-500 hover:to-green-700 disabled:opacity-50 transition-all duration-200 shadow-lg"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
              
              <p className="text-white/60 text-sm">
                Don't have an account? <span className="text-white font-medium cursor-pointer hover:text-white/80">Signup</span>
              </p>
              
              <p className="text-white/40 text-xs mt-4">Mock IDs: 1001 & 1002</p>
            </form>
          </div>
        </div>
      </div>
    );
  };

export default LoginView;
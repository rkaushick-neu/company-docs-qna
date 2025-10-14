// ---------- Types ----------
export interface Employee {
    employeeId: string;
    employeeName: string;
    department: string;
}
  
export interface Message {
    role: "user" | "assistant";
    text: string;
}
  
export interface ChatResponse {
      ok: boolean;
      data?: {output: string};
      detail?: string;
}

// Dynamic API base that works from any device on the network
// The API server runs on the same machine as the frontend server
const getApiBase = () => {
    const hostname = window.location.hostname;
    
    // If accessing from network IP, use the same IP for API
    return `http://${hostname}:8000`;
  };
  
export const API_BASE = getApiBase();
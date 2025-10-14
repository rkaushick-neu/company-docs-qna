import React, { useState } from "react";
import LoginView from "./components/LoginView";
import ChatView from "./components/ChatView";
import type { Employee } from "./types";


// ---------- Root App ----------
const App: React.FC = () => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  return employee ? (
    <ChatView employee={employee} onLogout={() => setEmployee(null)} />
  ) : (
    <LoginView onLogin={setEmployee} />
  );
};

export default App;
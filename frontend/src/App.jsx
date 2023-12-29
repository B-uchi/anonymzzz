import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import { Analytics } from '@vercel/analytics/react';
import Dashboard from "./pages/dashboard";
import SendMessage from "./pages/sendMessage";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Analytics/>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/:username/zzz" element={<SendMessage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

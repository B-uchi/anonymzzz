import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import SendMessage from "./pages/sendMessage";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/:username/zzz" element={<SendMessage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/login/login";
import ForgotPassword from "./pages/forgotPassword/forgotPassword";
import Home from "./pages/home/home";
import Alunos from "./pages/alunos/alunos";
import Files from "./pages/files/files";
import BackingTrack from "./pages/backingTracks/backingTracks";
import Tasks from "./pages/tasks/tasks";
import Settings from "./pages/settings/settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Navigate to="/login" replace />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/home" element={<Home />} />
        <Route path="/alunos" element={<Alunos />} />
        <Route path="/files" element={<Files />} />
        <Route path="/backingtrack" element={<BackingTrack />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

Settings
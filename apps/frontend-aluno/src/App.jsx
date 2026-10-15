import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// Importe o bloqueio
import RotaProtegida from './components/rotaProtegida';

import Pomodoro from "./pages/pomodoro/pomodoro";
import Home from "./pages/home/home";
import Files from "./pages/files/files";
import Login from "./pages/login/login";
import Register from "./pages/register/register";
import ForgotPassword from "./pages/forgotPassword/forgotPassword";
import Task from "./pages/task/task";
import BackingTrack from "./pages/backingTrack/backingTrack";
import Pad from "./pages/pad/pad";
import RegisterAwait from "./pages/register_await/register_await";
import Settings from "./pages/settings/settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ROTAS PÚBLICAS (Qualquer um acessa) */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/register" element={<Register />} />
        <Route path="/register_await" element={<RegisterAwait />} />

        {/* ROTAS PROTEGIDAS (Exigem o Token) */}
        <Route element={<RotaProtegida />}>
          <Route path="/login/forgotpassword" element={<ForgotPassword />} />
          <Route path="/home" element={<Home />} />
          <Route path="/pomodoro" element={<Pomodoro />} />
          <Route path="/task" element={<Task />} />
          <Route path="/files" element={<Files />} />
          <Route path="/backing-track" element={<BackingTrack />} />
          <Route path="/pad" element={<Pad />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;



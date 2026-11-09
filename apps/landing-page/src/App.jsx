import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import NotFound from "./pages/not_found/not_found";
import Home from "./pages/home/home";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/not-found" element={<NotFound />} />
        <Route path="/" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

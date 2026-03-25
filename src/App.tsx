import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import POSPage from "./pages/POSPage";


const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/pos" replace />} />
        <Route path="/pos" element={<POSPage />} />
        <Route path="*" element={<div>404 Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from "./components/Home.jsx"
import LoginPage from "./components/Login.jsx" 

const App = () => {
    return (
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/login" />} /> 
          </Routes>
        </Router>
      );
};

export default App;


import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import HomePage from "./components/Home.jsx"
import LoginPage from "./components/Login.jsx"
import RegistrationPage from './components/Registration.jsx'

/**
 * The main App component represents the entry point of the application.
 * It configures the routing using React Router and defines the routes for different pages.
 */
const App = () => {
  return (
    <Router>
      <Routes>
        {/* Redirects the root URL to the login page */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Route for the home page */}
        <Route path="/home" element={<HomePage />} />

        {/* Route for the login page */}
        <Route path="/login" element={<LoginPage />} />

        {/* Route for the registration page */}
        <Route path="/registration" element={<RegistrationPage />} />

        {/* Fallback route to redirect to the login page for unknown URLs */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App

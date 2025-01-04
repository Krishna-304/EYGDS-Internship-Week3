import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import './App.css'; // Ensure your CSS file is included

function App() {
  // State to manage dark/light mode
  const [darkMode, setDarkMode] = useState(true);

  // Effect hook to change theme when darkMode changes
  useEffect(() => {
    if (darkMode) {
      document.body.classList.remove('light-mode');
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
    }
  }, [darkMode]); // Runs every time darkMode state changes

  return (
    <Router>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} /> {/* Pass darkMode state and setDarkMode */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;

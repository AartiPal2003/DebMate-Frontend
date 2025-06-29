import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import AddLoan from "./pages/AddLoan";
import LoansList from "./pages/LoansList";
import Navbar from "./components/Navbar";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import "./App.css";
import { jwtDecode } from "jwt-decode";


function App() {
  const [user, setUser] = useState(null);

  // Optional: auto-login if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // You can decode token or just assume login for now
      setUser({ token }); // For now, treat as logged in
    }
  }, []);

  //decoding user name
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded JWT:", decoded);
        setUser(decoded);
      } catch (error) {
        console.error(" Invalid token:", error);
        localStorage.removeItem("token");
      }
    }
  }, []);


  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <div className="App">
      <Router>
        <Navbar user={user} setUser={setUser} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/add-loan"
            element={isAuthenticated ? <AddLoan /> : <Navigate to="/login" />}
          />
          <Route
            path="/all-loans"
            element={isAuthenticated ? <LoansList /> : <Navigate to="/login" />}
          />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

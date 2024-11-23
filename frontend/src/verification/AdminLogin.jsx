import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Confetti from "react-confetti";
import "react-toastify/dist/ReactToastify.css";
import "./AdminLogin.scss";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isConfettiVisible, setIsConfettiVisible] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASICURL}/api/admin/login`, {
        email,
        password,
      });
      console.log(response);
      
      toast.success("Login successful!", { position: "top-right" });

      // Show confetti
      setIsConfettiVisible(true);

      // Store the token in localStorage
      localStorage.setItem("token", response.data.token);

      // Navigate after a short delay
      setTimeout(() => {
        setIsConfettiVisible(false); // Stop confetti
        navigate("/");
      }, 5000);
    } catch (err) {
      const errorMessage = err.response ? err.response.data.msg : "Login failed";
      toast.error(errorMessage, { position: "top-right" });
    }
  };

  return (
    <div className="login-container">
      <ToastContainer />
      {isConfettiVisible && <Confetti
        numberOfPieces={300}
        gravity={0.25}
        tweenDuration={3000}
      />}
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Admin Login</h2>
        <div className="form-group">
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
        </div>
        <button type="submit" className="submit-btn">
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;

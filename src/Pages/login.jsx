import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import '../styles/login.css';
import { setLogin } from "../redux/state";
import Navbar from "../components/Navbar";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://10.1.82.57:3001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const loggedIn = await response.json();
        dispatch(setLogin({ user: loggedIn.user, token: loggedIn.token }));
        navigate("/"); // navigate to homepage after login
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message);
      }
    } catch (err) {
      console.log("Login failed", err.message);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="login">
        <div className="login_content">
          <h1>Log In</h1>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <form className="login_content_form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <IconButton
                className="password-eye"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </div>
            <button type="submit">LOG IN</button>
          </form>
          <p className="signup-link">
            Don't have an account? <a href="/register">Sign Up Here</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;

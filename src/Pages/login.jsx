import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import '../styles/login.css';
import { setLogin } from "../redux/state";
import Navbar from "../components/Navbar";
import { loginOrRegister } from "../components/login/login.js"; // Import the function
import Loading from "../components/loader"; // Import the Loader component
import Notification from '../components/notification/notification.jsx';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("http://192.168.1.66:3001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const loggedIn = await response.json();
        console.log("Login response:", loggedIn);
        dispatch(
          setLogin({
            user: loggedIn.user,
            token: loggedIn.token,
          })
        );
  
        navigate("/");
        toast.success("Login successful!");
        console.log("Calling loginOrRegister function");
        
        // Automatically login to Firebase
        const firebaseUid = await loginOrRegister(
          loggedIn.user.email, 
          "izygear",
          loggedIn.user.profileImagePath, 
          loggedIn.user.firstName + " " + loggedIn.user.lastName
        );
  
        // Call the API to store or retrieve the firebaseUid
        const response2 = await fetch("http://192.168.1.66:3001/auth/firebase", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ firebaseUid, userId: loggedIn.user.userId }),
        });
  
        if (response2.ok) {
          const data = await response2.json();
          console.log("firebase from backend: ", data);
          
          // Store the firebaseUid in localStorage
          localStorage.setItem('firebaseUid', data.firebaseUid || firebaseUid);
          
          // Update Redux state with the firebaseUid
          dispatch(setLogin({ 
            ...loggedIn, 
            user: { 
              ...loggedIn.user, 
              firebaseUid: data.firebaseUid || firebaseUid 
            } 
          }));
  
          console.log("Firebase UID stored successfully");
        } else {
          console.log("Failed to store/retrieve Firebase UID");
        }
      } else {
        toast.error("Invalid credentials");
      }
    } catch (err) {
      toast.error("Error occurred. Try again later.");
      console.log("Login failed", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Notification/>
      <Navbar />
      <div className="login">
        {isLoading ? (
          <Loading /> // Render Loader component when loading
        ) : (
          <div className="login_content">
            <h1>Log In</h1>
            {errorMessage && (
              <div className="error-message">
                <p>{errorMessage}</p>
                <button
                  className="close-button"
                  onClick={() => setErrorMessage("")}
                >
                  ✖
                </button>
              </div>
            )}
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
        )}
      </div>
    </>
  );
};

export default LoginPage;
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
//import { auth, db } from "../components/lib/firebase.js";
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
    setIsLoading(true); // Start loading
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
        console.log("Login response:", loggedIn);
        dispatch(
          setLogin({
            user: loggedIn.user,
            token: loggedIn.token,
            firstName: loggedIn.user.firstName,
            lastName: loggedIn.user.lastName,
            email: loggedIn.user.email,
            profileImagePath: loggedIn.user.profileImagePath,
            gearList: loggedIn.user.gearList,
            wishList: loggedIn.user.wishList,
            ownerGearList: loggedIn.user.ownerGearList,
            reservationList: loggedIn.user.reservationList,
          })
        );

        navigate("/"); // navigate to homepage after login
        console.log("Calling loginOrRegister function");
        // Automatically login to Firebase
        const firebaseUid = await loginOrRegister(
          loggedIn.user.email, 
          "izygear",//password, //have userId be the password
          loggedIn.user.profileImagePath, 
          loggedIn.user.firstName + " " + loggedIn.user.lastName);

        dispatch(setLogin({ ...loggedIn, firebaseUid })); // Save the Firebase UID in Redux
        
        // Call the API to store the firebaseUid inside of the database
        const response2 = await fetch("http://10.1.82.57:3001/auth/firebase", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ firebaseUid, userId: loggedIn.user.userId }),
        });

        if (response2.ok) {
          console.log("Firebase UID stored successfully");
        } else {
          console.log("Failed to store Firebase UID");
        }
       
      } else {
        const errorData = await response.json();
        setErrorMessage("Email or Password incorrect!");
      }
    } catch (err) {
      console.log("Login failed", err.message);
      setErrorMessage("Error occurred. Try again later.");
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <>
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

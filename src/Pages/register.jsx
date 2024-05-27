import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import '../styles/register.css';
import Navbar from "../components/Navbar";
const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    profileImage: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      [name]: name === "profileImage" ? files[0] : value,
    });
  };
  const [passwordMatch, setPasswordMatch] = useState(true);

  useEffect(() => {
    setPasswordMatch(
      formData.password === formData.confirmPassword ||
        formData.confirmPassword === ""
    );
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const register_form = new FormData();
      for (var key in formData) {
        register_form.append(key, formData[key]);
      }
  
      const response = await fetch("http://10.1.82.57:3001/auth/register", {
        method: "POST",
        body: register_form,
      });
  
      if (response.ok) {
        navigate("/login");
      }
    } catch (err) {
      console.log("Registration failed", err.message);
    }
  };

  return (
    <>
    <Navbar />
    <div className="register">
    <div className="register_content">
      <h1>Create an Account</h1>
      <form className="register_content_form" onSubmit={handleSubmit}>
      <div className="name-inputs">
            <input
              placeholder="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              
            />
            <input
              placeholder="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        <input
          placeholder="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <div className="password-input">
            <input
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              type={showPassword ? 'text' : 'password'}
              required
            />
            <IconButton
              className="password-eye"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </div>
          <div className="password-input">
            <input
              placeholder="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              type={showConfirmPassword ? 'text' : 'password'}
              required
            />
            <IconButton
              className="password-eye"
              onClick={toggleConfirmPasswordVisibility}
            >
              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </div>
        {!passwordMatch && (
          <p className="error-message">Passwords do not match!</p>
        )}
        <input
          id="image"
          type="file"
          name="profileImage"
          accept="image/*"
          onChange={handleChange}
          style={{ display: 'none' }}
          
        />
        <label htmlFor="image" className="image-label">
        <FileUploadOutlinedIcon style={{ color: 'black', width: '40px', height: '40px', marginRight: '15px' }} />
          <p>Upload Your Profile Photo</p>
        </label>
        {formData.profileImage && (
          <img
            src={URL.createObjectURL(formData.profileImage)}
            alt="profile"
            className="profile-preview"
          />
        )}
        <button type="submit" disabled={!passwordMatch}>
          REGISTER
        </button>
      </form>
      <p className="login-link">
        Already have an account? <a href="/login">Log In Here</a>
      </p>
    </div>
  </div>
  </>
  );
};

export default Register;
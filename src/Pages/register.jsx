import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom"
import '../styles/register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    profileImage: null,
  });

  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);

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
        if (key === "profileImage" && formData[key]) {
          register_form.append(key, formData[key]);
        } else if (key !== "profileImage") {
          register_form.append(key, formData[key]);
        }
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
    <div className="register">
    <div className="register_content">
      <h1>Create an Account</h1>
      <form className="register_content_form" onSubmit={handleSubmit}>
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
        <input
          placeholder="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <div className="password-input">
            <img
              src="/assets/eye.jpg"
              alt="Toggle Password"
              className="password-eye"
              onClick={togglePasswordVisibility}
            />
            <input
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              type={showPassword ? 'password' : 'text'} // Change the condition
              required
            />
          </div>
          <div className="password-input">
            <img
              src="/assets/eye.jpg"
              alt="Toggle Password"
              className="password-eye"
              onClick={toggleConfirmPasswordVisibility}
            />
            <input
              placeholder="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              type={showConfirmPassword ? 'password' : 'text'} // Change the condition
              required
            />
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
          <img src="/assets/addImage.png" alt="add profile" />
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
  );
};

export default Register;
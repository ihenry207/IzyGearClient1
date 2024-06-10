import React from 'react';
import { IconButton } from "@mui/material";
import { Search, Person, Menu } from "@mui/icons-material";
import '../styles/Navbar.css';
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setLogout } from "../redux/state";
import { auth, db } from "../lib/firebase";
//import Login from './login/login';

const Navbar = () => {
  const [dropdownMenu, setDropdownMenu] = useState(false);
  const user = useSelector((state) => state.user);
  const profileImage = useSelector((state)=>state.profileImagePath)
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //console.log("Here is the pf images url: ", user?.profileImagePath);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="navbar">
      <a href="/">
        <img src="/profile/logoi3.png" alt="logo" />
      </a>
      <div className="navbar_right">
        {user ? (
          <Link to="/create-listing" className="host">List your Gear</Link>
        ) : (
          <Link to="/login" className="host">List your Gear</Link>
        )}
        <button className="navbar_right_account" onClick={() => setDropdownMenu(!dropdownMenu)}>
          <Menu sx={{ color: "#969393" }} />
          {user ? (
            profileImage ? (
              <img
                src={profileImage}
                alt="profile photo"
                style={{ objectFit: "cover", borderRadius: "50%" }}
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownMenu(false);
                }}
              />
            ) : (
              <Person sx={{ color: "#969393" }} />
            )
          ) : (
            <Person sx={{ color: "#969393" }} />
          )}
        </button>
        {dropdownMenu && !user && (
          <div ref={dropdownRef} className="navbar_right_accountmenu">
            <Link to="/login">Log In</Link>
            <Link to="/register">Sign Up</Link>
          </div>
        )}
        {dropdownMenu && user && (
          <div ref={dropdownRef} className="navbar_right_accountmenu">
            <Link to={`/${user.userId}/gears`}>Gear List</Link> {/*this is the gears you booked */}
            <Link to={`/${user.userId}/wishList`}>Wish List</Link>
            <Link to={`/${user.userId}/listings`}>Listed Gears</Link>{/*this is the gears you own and listed for rent */}
            <Link to={`/${user.userId}/chats`}>Chat</Link>
            <Link to="/create-listing">List Your Gears</Link>
            <Link to="/login" onClick={() => {
              dispatch(setLogout());
              auth.signOut();//signout out of firebase
            }}>Log Out</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
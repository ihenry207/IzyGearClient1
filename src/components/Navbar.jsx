import React from 'react';
import { IconButton } from "@mui/material";
import { Search, Person, Menu } from "@mui/icons-material";
import '../styles/Navbar.css';
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setLogout } from "../redux/state";
import { auth, db } from "../lib/firebase";
import PersonIcon from '@mui/icons-material/Person';//for profile
import LogoutIcon from '@mui/icons-material/Logout';//for logout
import QuestionAnswerRoundedIcon from '@mui/icons-material/QuestionAnswerRounded';//for Messages
import FavoriteIcon from '@mui/icons-material/Favorite';//for wishList
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';//Bookings
import QueueIcon from '@mui/icons-material/Queue';//for List Your Gear
import InfoIcon from '@mui/icons-material/Info';//for About IzyGear
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';//contact support
import ListAltIcon from '@mui/icons-material/ListAlt';//for How-it-works
import {  Close } from '@mui/icons-material';

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
            <Link to={`/${user.userId}/gears`}>Bookings</Link> {/*this is the gears you booked */}
            <Link to={`/${user.userId}/wishList`}>WishLists</Link>
            <Link to={`/${user.userId}/chats`}>Inbox</Link>
            <Link to={`/${user.userId}/profile`}>Profile</Link>
            <Link to={`/${user.userId}/listings`}>Your Gears</Link>{/*this is the gears you own and listed for rent */}
            <Link to="/create-listing">List Your Gear</Link>
            <Link to="/how-it-works">How IzyGear Works</Link>
            <Link to="/contact-us">Contact Support</Link>
            <Link to="/about-us">About IzyGear</Link>
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
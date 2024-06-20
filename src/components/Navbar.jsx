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
import AddBoxIcon from '@mui/icons-material/AddBox';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AlarmIcon from '@mui/icons-material/Alarm';
const Navbar = () => {
  const [dropdownMenu, setDropdownMenu] = useState(false);
  const user = useSelector((state) => state.user);
  const profileImage = useSelector((state) => state.profileImagePath);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);


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
            <Link to="/create-listing" className="host-button">List your Gear</Link>
          ) : (
            <Link to="/login" className="host-button">List your Gear</Link>
          )}
        <button className="navbar_right_account" onClick={(e) => {
                  e.stopPropagation();
                  setDropdownMenu(!dropdownMenu);
                }}
        >
          <Menu sx={{ color: "#969393" }}  />
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
              <Person sx={{ color: "#969393" }}  />
            )
          ) : (
            <Person sx={{ color: "#969393" }} onClick={(e) => {
              e.stopPropagation();
              setDropdownMenu(false);
            }}/>
          )}
        </button>
        {dropdownMenu && !user && (
          <div ref={dropdownRef} className="navbar_right_accountmenu">
            <Link to="/login">
              <div className="menu-item">
                <LoginIcon sx={{ marginRight: '5px' }} />
                <span>Log In</span>
              </div>
            </Link>

            <Link to="/register">
              <div className="menu-item">
                <PersonAddIcon sx={{ marginRight: '5px' }} />
                <span>Sign Up</span>
              </div>
            </Link>

            
          </div>
        )}
        {dropdownMenu && user && (
          <div ref={dropdownRef} className="navbar_right_accountmenu" >
            {/*I will add Booking just on top of this */}
            <Link to={`/${user.userId}/reservations`}>
              <div className="menu-item">
                <AlarmIcon sx={{ marginRight: '5px' }} />
                <span>Reservations</span>
              </div>
            </Link>
            <Link to={`/${user.userId}/wishList`}>
              <div className="menu-item">
                <FavoriteIcon sx={{ marginRight: '5px' }} />
                <span>WishLists</span>
              </div>
            </Link>
            <Link to={`/${user.userId}/chats`}>
              <div className="menu-item">
                <QuestionAnswerRoundedIcon sx={{ marginRight: '5px' }} />
                <span>Inbox</span>
              </div>
            </Link>
            <div className="dropdown-divider"></div> {/* Line between Inbox and Profile */}
            <Link to={`/${user.userId}/profile`}>
              <div className="menu-item">
                <PersonIcon sx={{ marginRight: '5px' }} />
                <span>Profile</span>
              </div>
            </Link>
            <Link to={`/${user.userId}/listings`}>
              <div className="menu-item">
                <TipsAndUpdatesIcon sx={{ marginRight: '5px' }} />
                <span>Your Gears</span>
              </div>
            </Link>
            <Link to="/create-listing">
              <div className="menu-item">
                <AddBoxIcon sx={{ marginRight: '5px' }} />
                <span>List Your Gear</span>
              </div>
            </Link>
            <div className="dropdown-divider"></div> {/* Line between List Your Gear and How IzyGear Works */}
            <Link to="/how-it-works">
              <div className="menu-item">
                <ListAltIcon sx={{ marginRight: '5px' }} />
                <span>How IzyGear Works</span>
              </div>
            </Link>
            <Link to="/contact-us">
              <div className="menu-item">
                <HeadsetMicIcon sx={{ marginRight: '5px' }} />
                <span>Contact Support</span>
              </div>
            </Link>
            <Link to="/about-us">
              <div className="menu-item">
                <InfoIcon sx={{ marginRight: '5px' }} />
                <span>About IzyGear</span>
              </div>
            </Link>
            <div className="dropdown-divider"></div> {/* Line between About IzyGear and Log Out */}
            <Link to="/login" onClick={() => {
              dispatch(setLogout());
              auth.signOut();
            }}>
              <div className="menu-item">
                <LogoutIcon sx={{ marginRight: '5px' }} />
                <span>Log Out</span>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
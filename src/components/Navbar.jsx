import React from 'react';
import { IconButton } from "@mui/material";
import { Search, Person, Menu } from "@mui/icons-material";
import '../styles/Navbar.css';
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setLogout } from "../redux/state";

const Navbar = () => {
  const [dropdownMenu, setDropdownMenu] = useState(false);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

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
      <div className="navbar_search">
        <input type="text" 
        placeholder="Search ..." 
        value={search} 
        onChange={(e) => setSearch(e.target.value)} />
        <IconButton disabled={search === ""}>
          <Search sx={{ color: "#1E88E5" }} 
          onClick={() => { navigate(`/gears/search/${search}`); }} />
        </IconButton>
      </div>

      <div className="navbar_right">
        {user ? (
          <Link to="/create-listing" className="host">List your Gear</Link>
        ) : (
          <Link to="/login" className="host">List your Gear</Link>
        )}
        <button className="navbar_right_account" 
        onClick={() => setDropdownMenu(!dropdownMenu)}>
          <Menu sx={{ color: "#969393" }} />
          {!user ? (
            <Person sx={{ color: "#969393" }} />
          ) : (
            <img src={`http://10.1.82.57:3001/${user.profileImagePath.replace("public", "")}`} 
            alt="profile photo" 
            style={{ objectFit: "cover", borderRadius: "50%" }} />
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
            <Link to={`/${user._id}/gears`}>Gear List</Link>
            <Link to={`/${user._id}/wishList`}>Wish List</Link>
            <Link to={`/${user._id}/listings`}>Listed Gears</Link>
            <Link to={`/${user._id}/reservations`}>Reservation List</Link>
            <Link to="/create-listing">List Your Gears</Link>
            <Link to="/login" onClick={() => { dispatch(setLogout()); }}>Log Out</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;


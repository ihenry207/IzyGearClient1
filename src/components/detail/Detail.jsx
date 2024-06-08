import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import "./detail.css";
import DownloadIcon from '@mui/icons-material/Download';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess'; 

const ChatDetails = () => {
  return (
    <div className='detail'>
      <div className='user'>
        <img src='/avatar.png' alt="User Avatar" />
        <h2>Jane Doe</h2>
        <p>Lorem ipsum dolor sit amet.</p>
      </div>
      <div className='info'>
        <div className='option'>
          <div className='title'>
            <span>Chat Settings</span>
            <ExpandLessIcon />
          </div>
        </div>
        <div className='option'>
          <div className='title'>
            <span>Chat Settings</span>
            <ExpandLessIcon />
          </div>
        </div>
        <div className='option'>
          <div className='title'>
            <span>Privacy & Help</span>
            <ExpandLessIcon />
          </div>
        </div>
        <div className='option'>
          <div className='title'>
            <span>Shared Photos</span>
            <ExpandMoreIcon />
          </div>
          <div className='photos'>
            <div className="photoItem">
              <div className='photoDetail'>
                <img
                    src="https://images.pexels.com/photos/7381200/pexels-photo-7381200.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
                    alt=""
                />
                <span>photo_2024_2.png</span>
              </div>
              <DownloadIcon className='icon'/>
            </div>
          </div>
        </div>

        <div className="option">
          <div className="title">
            <span>Shared Files</span>
            <ExpandMoreIcon />
          </div>
        </div>
        <button>Block User</button>
      </div>
    </div>
  )
}

export default ChatDetails

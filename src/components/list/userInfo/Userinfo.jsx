import React from 'react'
import "./userInfo.css"
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import VideocamIcon from '@mui/icons-material/Videocam';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import { useSelector, useDispatch } from "react-redux";
const Userinfo = () => {
    const user = useSelector((state) => state.user);
  return (
    <div className='userInfo'>
      <div className="user">
        <img src='/avatar.png' alt ="User Avatar"/>
        <h2>John Doe</h2> 
      </div>
      <div className="icons">
        <MoreHorizOutlinedIcon  />
        <VideocamIcon />
        <BorderColorOutlinedIcon  />
      </div>
    </div>
  )
}

export default Userinfo

import React from 'react'
import "./userInfo.css"
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import VideocamIcon from '@mui/icons-material/Videocam';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import { useSelector, useDispatch } from "react-redux";
import { useUserStore } from "../../../lib/userStore";
const Userinfo = () => {
    const user = useSelector((state) => state.user);
    const { currentUser} = useUserStore();
  return (
    <div className='userInfo'>
      <div className="user">
        <img src={currentUser.avatar || 'https://izygear.s3.us-east-2.amazonaws.com/profile-images/avatar.png'} alt="" />
        {/* <img src='/avatar.png' alt ="User Avatar"/> */}
        {/* <h2>{currentUser.username}</h2>  */}
        <h2>Messages</h2>
      </div>
      {/* <div className="icons">
        <MoreHorizOutlinedIcon  />
        <VideocamIcon />
        <BorderColorOutlinedIcon  />
      </div> */}
    </div>
  )
}

export default Userinfo

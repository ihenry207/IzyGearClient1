import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import "./detail.css";
import DownloadIcon from '@mui/icons-material/Download';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess'; 
import { useUserStore } from "../../lib/userStore";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useChatStore } from "../../lib/chatStore";
import { auth, db } from "../../lib/firebase";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const ChatDetails = () => {
  const { currentUser} = useUserStore();
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock, resetChat, setShowChat, setShowDetail } =
    useChatStore();


  const handleBlock = async () => {
    if (!user) return;

    const userDocRef = doc(db, "users", currentUser.id);

    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock();
    } catch (err) {
      console.log(err);
    }
  };

  const handleBackClick = () => {
    setShowChat(true);
    setShowDetail(false);
  };

  return (
    <div className='detail'>
      <div className='user'>
      <ArrowBackIosNewIcon onClick={handleBackClick}/>
      <img src={user?.avatar || 'https://izygear.s3.us-east-2.amazonaws.com/profile-images/avatar.png'} alt="" />
        <h2>{user?.username}</h2>
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
        <button onClick={handleBlock}>{isCurrentUserBlocked
            ? "You are Blocked!"
            : isReceiverBlocked
            ? "User blocked"
            : "Block User"}
          </button>
      </div>
    </div>
  )
}

export default ChatDetails

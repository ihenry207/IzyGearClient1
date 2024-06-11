import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import "./list.css";
import Userinfo from './userInfo/Userinfo';
import ChatList from './chatList/ChatList.jsx';
import { useChatStore } from "../../lib/chatStore";
const List = () => {
  const { setShowList, setShowChat } = useChatStore();

  const handleChatClick = () => {
    setShowList(false);
    setShowChat(true);
  };

  return (
    <div className='list'> 
        <Userinfo/>
        <ChatList onChatClick={handleChatClick} /> 
    </div>
  )
}

export default List

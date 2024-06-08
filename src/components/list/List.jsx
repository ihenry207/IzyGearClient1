import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import "./list.css";
import Userinfo from './userInfo/Userinfo';
import ChatList from './chatList/ChatList';

const List = () => {
  return (
    <div className='list'> 
        <Userinfo/>
        <ChatList />  
    </div>
  )
}

export default List

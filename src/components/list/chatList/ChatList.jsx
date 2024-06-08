import React from 'react';
import "./chatlist.css";
import { useEffect, useState } from "react";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';//search
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import AddUser from './addUser/addUser'; 
const ChatList = () => {
  const [addMode, setAddMode] = useState(false);
  return (
    <div className="chatList">
      <div className='search'>
        <div className='searchBar'>
          <SearchOutlinedIcon/>
          <input type='text' placeholder='Search'/>
        </div>
          {addMode ? (
          <RemoveOutlinedIcon 
            className='add' 
            onClick={() => setAddMode((prev) => !prev)} 
          />
        ): (
          <AddOutlinedIcon 
            className='add' 
            onClick={() => setAddMode((prev) => !prev)} 
          />
        ) }
      </div>
      <div className='item'>
        <img src='/avatar.png' alt ="User Avatar"/>
        <div className='texts'>
          <span> Jane Doe</span>
          <p>Hello</p>
        </div> 
      </div>
      <div className='item'>
        <img src='/avatar.png' alt ="User Avatar"/>
        <div className='texts'>
          <span> Jane Doe</span>
          <p>Hello</p>
        </div> 
      </div>
      <div className='item'>
        <img src='/avatar.png' alt ="User Avatar"/>
        <div className='texts'>
          <span> Jane Doe</span>
          <p>Hello</p>
        </div> 
      </div>
      <div className='item'>
        <img src='/avatar.png' alt ="User Avatar"/>
        <div className='texts'>
          <span> Jane Doe</span>
          <p>Hello</p>
        </div> 
      </div>
      <div className='item'>
        <img src='/avatar.png' alt ="User Avatar"/>
        <div className='texts'>
          <span> Jane Doe</span>
          <p>Hello</p>
        </div> 
      </div>
      {addMode && <AddUser />}
    </div>
  );
};

export default ChatList;
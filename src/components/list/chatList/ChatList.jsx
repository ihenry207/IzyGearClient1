import React from 'react';
import "./chatlist.css";
import { useEffect, useState } from "react";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';//search
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import AddUser from './addUser/addUser'; 
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useUserStore } from "../../../lib/userStore";
import { useChatStore } from "../../../lib/chatStore";

const ChatList = ({ onChatClick }) => {
  const [addMode, setAddMode] = useState(false);
  const { currentUser} = useUserStore();
  const [chats, setChats] = useState([]);
  const [input, setInput] = useState("");
  const { chatId, changeChat } = useChatStore();

  //this is where we fetch the chat list
  useEffect(() => {
    const unSub = onSnapshot(doc(db, "userchats", currentUser.id), async (snapshot) => {
      const data = snapshot.data();
      if (data && data.chats) {
        const items = data.chats;
        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "users", item.receiverId);
          const userDocSnap = await getDoc(userDocRef);
  
          const user = userDocSnap.data();
  
          return { ...item, user };
        });
        const chatData = await Promise.all(promises);
        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      }
    });
  
    return () => {
      unSub();
    };
  }, [currentUser.id]);

  const handleSelect = async (chat) => {
    const userChats = chats.map((item) => {
      const { user, ...rest } = item;
      return rest;
    });

    const chatIndex = userChats.findIndex(
      (item) => item.chatId === chat.chatId
    );

    userChats[chatIndex].isSeen = true;

    const userChatsRef = doc(db, "userchats", currentUser.id);

    try {
      await updateDoc(userChatsRef, {
        chats: userChats,
      });
      changeChat(chat.chatId, chat.user);
      onChatClick(); // Call the onChatClick function passed via props
    } catch (err) {
      console.log(err);
    }
  };

  const filteredChats = chats.filter((c) =>
    c.user.username.toLowerCase().includes(input.toLowerCase())
  );

  console.log(chats)
  return (
    <div className="chatList">
      <div className='search'>
        <div className='searchBar'>
          <SearchOutlinedIcon/>
          <input type='text' placeholder='Search'
          onChange={(e) => setInput(e.target.value)}/>
        </div>
          {/* {addMode ? (
          <RemoveOutlinedIcon 
            className='add' 
            onClick={() => setAddMode((prev) => !prev)} 
          />
        ): (
          <AddOutlinedIcon 
            className='add' 
            onClick={() => setAddMode((prev) => !prev)} 
          />
        ) } */}
      </div>
      {filteredChats.map((chat) => (
        <div
          className='item'
          key={chat.chatId}
          onClick={() => handleSelect(chat)}
          // style={{
          //   backgroundColor: chat?.isSeen ? "transparent" : "#5183fe",
          // }}
        >
          <img
            src={
              chat.user.blocked.includes(currentUser.id)
                ? 'https://izygear.s3.us-east-2.amazonaws.com/profile-images/avatar.png'
                : chat.user.avatar || 'https://izygear.s3.us-east-2.amazonaws.com/profile-images/avatar.png'
            }
            alt=""
          />
          <div className='texts'>
            <span className={chat?.isSeen ? '' : 'unread-name'}>
              {chat.user.blocked.includes(currentUser.id)
                ? "User"
                : chat.user.username}
            </span>
            <p className={chat?.isSeen ? '' : 'unread-message'}>{chat.lastMessage}</p>
          </div>
        </div>
      ))}
      
      {addMode && <AddUser />}
    </div>
  );
};

export default ChatList;
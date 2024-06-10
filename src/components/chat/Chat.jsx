import React, { useEffect, useState, useRef } from 'react';
import "./chat.css";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import upload from "../../lib/upload";
import { useUserStore } from "../../lib/userStore";
import EmojiPicker from "emoji-picker-react";
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import VideocamIcon from '@mui/icons-material/Videocam';
import InfoIcon from '@mui/icons-material/Info';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import ImageIcon from '@mui/icons-material/Image';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { format } from 'date-fns';

const Chat = () => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [chat, setChat] = useState();
  const [img, setImg] = useState({
    file: null,
    url: "",
  });
  const { currentUser } = useUserStore();
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } =
    useChatStore();

  const endRef = useRef(null)
  useEffect(()=>{
    endRef.current?.scrollIntoView({behavior: "smooth"})
  })

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });

    return () => {
      unSub();
    };
  }, [chatId]);


  const handleEmoji = (emojiObject) => {
    setText((prev) => prev + emojiObject.emoji);
    setOpen(false);
  };
  //when we get an image we just send it straight up
  const handleImg = async (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
  
      try {
        const imgUrl = await upload(e.target.files[0]);
  
        await updateDoc(doc(db, "chats", chatId), {
          messages: arrayUnion({
            senderId: currentUser.id,
            text: "",
            createdAt: new Date(),
            img: imgUrl,
          }),
        });
  
        const userIDs = [currentUser.id, user.id];
  
        userIDs.forEach(async (id) => {
          const userChatsRef = doc(db, "userchats", id);
          const userChatsSnapshot = await getDoc(userChatsRef);
  
          if (userChatsSnapshot.exists()) {
            const userChatsData = userChatsSnapshot.data();
  
            const chatIndex = userChatsData.chats.findIndex(
              (c) => c.chatId === chatId
            );
  
            userChatsData.chats[chatIndex].lastMessage = "";
            userChatsData.chats[chatIndex].isSeen =
              id === currentUser.id ? true : false;
            userChatsData.chats[chatIndex].updatedAt = Date.now();
  
            await updateDoc(userChatsRef, {
              chats: userChatsData.chats,
            });
          }
        });
      } catch (err) {
        console.log(err);
      } finally {
        setImg({
          file: null,
          url: "",
        });
      }
    }
  };

  const handleSend = async () => {
    if (text === "") return;
    let imgUrl = null;
    try {
      if (img.file) {
        imgUrl = await upload(img.file);
      }
  
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
          ...(imgUrl && { img: imgUrl }),
        }),
      });
    
      const userIDs = [currentUser.id, user.id];
  
      userIDs.forEach(async (id) => {
        const userChatsRef = doc(db, "userchats", id);
        const userChatsSnapshot = await getDoc(userChatsRef);
  
        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();
  
          const chatIndex = userChatsData.chats.findIndex(
            (c) => c.chatId === chatId
          );
  
          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen =
            id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();
  
          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          });
        }
      });
    } catch (err) {
      console.log(err);
    } finally {
      setImg({
        file: null,
        url: "",
      });
  
      setText("");
    }
  };

  return (
    <div className='chat'>
      <div className='top'>
        <div className='user'>
          <img src={user?.avatar || 'https://izygear.s3.us-east-2.amazonaws.com/profile-images/avatar.png'} alt="" />
          <div className='texts'>
            <span>{user?.username}</span>
            {/* <p>Lorem ipsum dolor sit amet.</p> */}
          </div>
        </div>
        <div className='icons'>
          <InfoIcon />
        </div>
      </div>

      <div className='center'>
        {chat?.messages?.map((message) => (
          <div
            className={message.senderId === currentUser?.id ? "message own" : "message"}
            key={message?.createdAt}
          >
            <div className='texts'>
              {message.img && (
                <>
                  <img src={message.img} alt="" />
                  <span>{format(message.createdAt.toDate(), 'MMM d, yyyy h:mm a')}</span>
                </>
              )}
              {message.text && (
                <>
                  <p>{message.text}</p>
                  <span>{format(message.createdAt.toDate(), 'MMM d, yyyy h:mm a')}</span>
                </>
              )}
            </div>
          </div>
        ))}
        {img.url && (
          <div className="message own">
            <div className="texts">
              <img src={img.url} alt="" />
            </div>
          </div>
        )}
        <div ref={endRef}></div>
      </div>

      <div className='bottom'>
      <div className='icons'>
        <label htmlFor="file" className={`${isCurrentUserBlocked || isReceiverBlocked ? 'disabled' : ''}`}>
          <ImageIcon />
        </label>
        <input
          type="file"
          id="file"
          style={{ display: "none" }}
          onChange={handleImg}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        />
        {/* <CameraAltIcon className={`${isCurrentUserBlocked || isReceiverBlocked ? 'disabled' : ''}`} />
         */}
      </div>
      <div className="inputContainer">
        <input 
          type='text' 
          placeholder={
            isCurrentUserBlocked || isReceiverBlocked
              ? "You cannot send a message"
              : "Type a message..."
          }
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSend();
            }
          }}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        />
        
        <button 
        className={`sendButton ${text.length < 1 ? 'disabled' : ''}`} 
        onClick={handleSend} 
        disabled={text.length < 1 || isCurrentUserBlocked || isReceiverBlocked}>
          <ArrowUpwardIcon/>
        </button>
      </div>
      </div>
    </div>
  );
};

export default Chat;

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
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';//to go back to chatList

const Chat = () => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [chat, setChat] = useState();
  const [img, setImg] = useState({
    file: null,
    url: "",
  });
  const { currentUser } = useUserStore();
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, setShowList, setShowDetail, setShowChat } =
    useChatStore();
  const endRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  useEffect(()=>{
    endRef.current?.scrollIntoView({behavior: "smooth"})
  })

  //get data from chats database
  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });

    return () => {
      unSub();
    };
  }, [chatId]);

  const handleListClick = () => {
    setShowList(true);
    setShowChat(false);
    setShowDetail(false);
  };

  const handleInfoClick = () => {
    setShowList(false);
    setShowChat(false);
    setShowDetail(true);
  };


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
        // Show the progress bar and disable the UI
        setIsUploading(true);

        const imgUrl = await upload(e.target.files[0], (progress) => {
          setUploadProgress(progress);
        });
  
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
        // Hide the progress bar and enable the UI
        setIsUploading(false);
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
        {/* this div also when clicked on gives out the <Details/> */}
        <div className='user' >
          {/* this back icon helps you go back to chaList page. */}
          <ArrowBackIosNewIcon onClick={handleListClick}/>
          <img onClick={handleInfoClick}
           src={user?.avatar || 'https://izygear.s3.us-east-2.amazonaws.com/profile-images/avatar.png'} alt="" />
          <div className='texts' onClick={handleInfoClick}>
            <span>{user?.username}</span>
          </div>
        </div>
        <div className='icons'>
          {/* this infoIcon helps you bring up <Details/> */}
          <InfoIcon onClick={handleInfoClick}/>
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
            accept="image/*"
          />
        </div>
        <div className="inputContainer">
          <input 
            type='text' 
            placeholder={
              isCurrentUserBlocked || isReceiverBlocked
                ? "You cannot send a message"
                : "Write a message..."
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

        {isUploading && (
          <div className="overlay">
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${uploadProgress}%` }}></div>
            </div>
            <div className="uploading-text">Sending Image...</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;

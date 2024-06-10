import React from 'react'
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import Loader from "../components/loader";
import Footer from "../components/footer";
import Detail from "../components/detail/Detail"
import Chat from "../components/chat/Chat.jsx";
import List from "../components/list/List.jsx";
import "../styles/chat.css";
import { useUserStore } from "../lib/userStore";
import { useChatStore } from "../lib/chatStore";

const ChatPage = () => {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const firebaseUid = useSelector((state) => state.user.firebaseUid);
  const { chatId } = useChatStore();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    });
    
    return () => {
      unsubscribe();
    };
    
  }, [fetchUserInfo]);
  console.log("Firebase user: ",currentUser);

  if (isLoading) return <Loader />;

  return (
    <>
      <Navbar />
      <div className="container">
        <List />
        {chatId && <Chat />}
        {chatId && <Detail />}
        {/* <Chat />
        <Detail /> */}
      </div>
    </>
  );
}

export default ChatPage

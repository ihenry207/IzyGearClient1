import React from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import Loading from "../components/loader";
import Footer from "../components/footer";
import Detail from "../components/detail/Detail";
import Chat from "../components/chat/Chat.jsx";
import List from "../components/list/List.jsx";
import "../styles/chat.css";
import { useUserStore } from "../lib/userStore";
import { useChatStore } from "../lib/chatStore";
import { setLogin } from "../redux/state";
import { loginOrRegister } from "../components/login/login.js";

const ChatPage = () => {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const firebaseUid = useSelector((state) => state.user.firebaseUid);
  const { chatId, showList, showChat, showDetail } = useChatStore();
  const dispatch = useDispatch();

  // Move the useSelector call outside the useEffect hook
  const userData = useSelector((state) => state.user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is logged in, fetch user info
        fetchUserInfo(user.uid);
      } else {
        console.log("trying to login in again")
        // User is not logged in, try to log in using Redux data
        const { email, firstName, lastName, profileImagePath } = userData;
        if (email) {
          try {
            const firebaseUid = await loginOrRegister(
              email,
              "izygear", // password
              profileImagePath,
              `${firstName} ${lastName}`
            );
            dispatch(setLogin({ ...userData, firebaseUid })); // Merge existing user data with firebaseUid
            fetchUserInfo(firebaseUid);
          } catch (error) {
            console.error("Error logging in:", error);
          }
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [fetchUserInfo, dispatch, userData]);

  //we need to check if the firebaseuid is null we login automatically

  console.log("Firebase user: ", currentUser);

  if (isLoading) return <Loading />;

  return (
    <>
      <Navbar />
      <div className="container">
        {showList && <List />}
        {showChat && <Chat />}
        {showDetail && <Detail />}
      </div>
    </>
  );
};

export default ChatPage;
import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
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
import Notification from '../components/notification/notification.jsx';

const ChatPage = () => {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const { chatId, showList, showChat, showDetail } = useChatStore();
  const dispatch = useDispatch();
  const [authChecked, setAuthChecked] = useState(false);

  const userData = useSelector((state) => state.user);
  const firebaseUid = useSelector((state) => state.user?.firebaseUid);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await fetchUserInfo(user.uid);
        setAuthChecked(true);
      } else {
        console.log("trying to login in again")
        const { email, firstName, lastName, profileImagePath } = userData;
        if (email) {
          try {
            const newFirebaseUid = await loginOrRegister(
              email,
              "izygear", // password
              profileImagePath,
              `${firstName} ${lastName}`
            );
            if (newFirebaseUid) {
              dispatch(setLogin({ ...userData, firebaseUid: newFirebaseUid }));
              await fetchUserInfo(newFirebaseUid);
            }
          } catch (error) {
            console.error("Error logging in:", error);
          }
        }
        setAuthChecked(true);
      }
    });

    return () => unsubscribe();
  }, [fetchUserInfo, dispatch, userData]);

  console.log("Firebase user: ", currentUser);

  if (isLoading || !authChecked) return <Loading />;

  if (!firebaseUid) {
    return <div>Please log in to access chats.</div>;
  }

  return (
    <>
      <Navbar />
      <div className="container">
        {showList && <List />}
        {showChat && <Chat />}
        {showDetail && <Detail />}
        <Notification/>
      </div>
    </>
  );
};

export default ChatPage;
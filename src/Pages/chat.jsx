import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import Loader from "../components/loader";
import Footer from "../components/footer";
import Detail from "../components/detail/Detail"
import Chat from "../components/chat/Chat.jsx";
import List from "../components/list/List.jsx";
import "../styles/chat.css";
const chat = () => {
  return (
    <>
      <Navbar />
      <div className="container">

        <List />
        <Chat />
        <Detail />
      </div>
    </>
  );
}

export default chat

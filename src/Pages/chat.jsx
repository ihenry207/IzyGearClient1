import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import Loader from "../components/loader";
import Footer from "../components/footer";
import Detail from "../components/detail/Detail"
import Chat from "../components/chat/Chat";
import List from "../components/list/List.jsx";
import "../styles/chat.css";
const chat = () => {
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="section">
          <List />
        </div>
        <div className="section">
          <Chat />
        </div>
        <div className="section">
          <Detail />
        </div>
      </div>
    </>
  );
}

export default chat

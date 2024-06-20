import React from 'react'
import './addUser.css'
import { db } from "../../../../lib/firebase";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useState } from "react";
import { useUserStore } from "../../../../lib/userStore";
const AddUser = () => {
  const [user, setUser] = useState(null);
  const { currentUser } = useUserStore();

  const handleSearch = async (e) =>{
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");
    try{
      const userRef = collection(db, "users");

      const q = query(userRef, where("username", "==", username));

      const querySnapShot = await getDocs(q);

      if (!querySnapShot.empty) {
        setUser(querySnapShot.docs[0].data());
      }
    }catch(err){
      console.log(err);
    }
  }

  const handleSearch2 = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userId = formData.get("userId"); // Changed from "username" to "userId"
  
    try {
      const userRef = doc(db, "users", userId); // Changed to use doc() instead of collection()
  
      const userDoc = await getDoc(userRef); // Changed to use getDoc() instead of getDocs()
  
      if (userDoc.exists()) {
        setUser(userDoc.data());
      } else {
        console.log("No user found with this ID");
        setUser(null);
      }
    } catch (err) {
      console.log(err);
      setUser(null);
    }
  }
  


  //this will later be changed and add users after Booking was successful
  const handleAdd = async () =>{
    const chatRef = collection(db, "chats");
    const userChatsRef = collection(db, "userchats");
    try{
      const newChatRef = doc(chatRef);//chatId, we can use it to update out

      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      })

      await updateDoc(doc(userChatsRef, user.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser.id,
          updatedAt: Date.now(),
        }),
      });
      await updateDoc(doc(userChatsRef, currentUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: user.id,
          updatedAt: Date.now(),
        }),
      });
    }catch(err){
      console.log(err);
    }
  }
  return (
    <div className='addUser'>
      <form onSubmit={handleSearch2}>
      <input type='text' placeholder='User ID' name='userId' />
        {/* <input type='text' placeholder='username' name='username' /> */}
        <button>Search</button>
      </form>
      {
        user && (
          <div className="user">
          <div className="detail">
            <img src={user.avatar || "https://izygear.s3.us-east-2.amazonaws.com/profile-images/avatar.png" } alt="" />
            <span>{user.username}</span>
          </div>
          <button onClick={handleAdd}>Add User</button>
      </div>
        )}
      
    </div>
  )
}

export default AddUser

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import "./detail.css";
import DownloadIcon from '@mui/icons-material/Download';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess'; 
import { useUserStore } from "../../lib/userStore";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useChatStore } from "../../lib/chatStore";
import { auth, db, storage } from "../../lib/firebase";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { useNavigate } from 'react-router-dom';  

const ChatDetails = () => {
  const { currentUser} = useUserStore();
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock, resetChat, setShowChat, setShowDetail } =
    useChatStore();
  const [sharedPhotos, setSharedPhotos] = useState([]);
  const [showSharedPhotos, setShowSharedPhotos] = useState(false);
  const [showReservedGears, setShowReservedGears] = useState(false);
  const [GearPhoto, setGearPhoto] = useState(''); //photo url from the  backend
  const [Geartitle, setGearTitle] = useState('');//Title of Gear from the backend
  const [reservedGears, setReservedGears] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    getReservedGears();
  }, [chatId]);

  useEffect(() => {
    const fetchSharedPhotos = async () => {
      if (!chatId) return;

      const listRef = ref(storage, chatId);
      try {
        const res = await listAll(listRef);
        const photoPromises = res.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          return {
            name: itemRef.name,
            url: url
          };
        });
        const photos = await Promise.all(photoPromises);
        setSharedPhotos(photos);
      } catch (error) {
        console.error("Error fetching shared photos:", error);
      }
    };

    fetchSharedPhotos();
  }, [chatId]);

  const handleBlock = async () => {
    if (!user) return;

    const userDocRef = doc(db, "users", currentUser.id);

    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock();
    } catch (err) {
      console.log(err);
    }
  };

  const handleBackClick = () => {
    setShowChat(true);
    setShowDetail(false);
  };

  const handleDownload = (url, fileName) => {
    try {
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      // Show success notification
      alert(`Download initiated for: ${fileName}`);
    } catch (error) {
      console.error("Error initiating download:", error);
      alert(`Download failed to initiate for: ${fileName}`);
    }
  };

  //so for this I think we are going to use chat id
  //we will use this chatid to look for a reservation with the same 
  //either chatId
  //then we will the the listingId and category and search which listing that is 
  //then get one of its photos and title of the listing to show here
  // call this function in the usestate when first open this chatDetails
  const getReservedGears = async () => {
    try {
      const response = await fetch(
        `http://192.175.1.221:3001/reservations/${chatId}/gears`,
        {
          method: "GET",
        }
      );
  
      if (response.status === 404) {
        console.log("No reservations found at this time");
      } else {
        const data = await response.json();
        setReservedGears(data);
      }
    } catch (err) {
      console.log(err)
    }
  } 

  const toggleSharedPhotos = () => {
    setShowSharedPhotos(!showSharedPhotos);
  };
  const toggleReservedGears = () =>{
    setShowReservedGears(!showReservedGears);
  }


  return (
    <div className='detail'>
        <div className='user-header'>
          <ArrowBackIosNewIcon className='back-button' onClick={handleBackClick} />
        </div>
        <div className='user'>
          <img src={user?.avatar || 'https://izygear.s3.us-east-2.amazonaws.com/profile-images/avatar.png'} alt="" />
          <h2>{user?.username}</h2>
      </div>
      <div className='info'>
       
      <div className='option'>
          <div className='title' onClick={toggleReservedGears} style={{ cursor: 'pointer' }}>
            <span>Reserved Gears</span>
            {showReservedGears ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </div>
          {showReservedGears && reservedGears.length > 0 && (
            <div className='photos'>
              {reservedGears.map((gear, index) => (
                <div 
                  className="photoItem" 
                  key={index}
                  onClick={() => {
                    navigate(`/gears/listingdetail`, { state: { category: gear.category, listingId: gear.listingId } });
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className='photoDetail'>
                    <img src={gear.photo} alt={gear.title} />
                    <span>{gear.title}</span>
                    <span>{gear.category}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className='option'>
          <div className='title' onClick={toggleSharedPhotos}>
            <span>Shared Photos</span>
            {showSharedPhotos ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </div>
          {showSharedPhotos && (
            <div className='photos'>
              {sharedPhotos.map((photo, index) => (
                <div className="photoItem" key={index}>
                  <div className='photoDetail'>
                    <img src={photo.url} alt={photo.name} />
                    <span>{photo.name}</span>
                  </div>
                  <DownloadIcon 
                    className='icon' 
                    onClick={() => handleDownload(photo.url, photo.name)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

       
        <button onClick={handleBlock}>{isCurrentUserBlocked
            ? "You are Blocked!"
            : isReceiverBlocked
            ? "User blocked"
            : "Block User"}
          </button>
      </div>
    </div>
  )
}

export default ChatDetails
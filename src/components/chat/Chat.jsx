import React, { useEffect, useState, useRef } from 'react';
import "./chat.css";
import EmojiPicker from "emoji-picker-react";
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import VideocamIcon from '@mui/icons-material/Videocam';
import InfoIcon from '@mui/icons-material/Info';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import ImageIcon from '@mui/icons-material/Image';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const Chat = () => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const endRef = useRef(null)
  useEffect(()=>{
    endRef.current?.scrollIntoView({behavior: "smooth"})
  })
  const handleEmoji = (emojiObject) => {
    setText((prev) => prev + emojiObject.emoji);
    setOpen(false);
  };

  return (
    <div className='chat'>
      <div className='top'>
        <div className='user'>
          <img src='/avatar.png' alt="User Avatar" />
          <div className='texts'>
            <span>Jane Doe</span>
            <p>Lorem ipsum dolor sit amet.</p>
          </div>
        </div>
        <div className='icons'>
          <LocalPhoneIcon />
          <VideocamIcon />
          <InfoIcon />
        </div>
      </div>
      <div className='center'>
        <div className='message'>
          <img src='/avatar.png' alt=''/>
          <div className='texts'>
            <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
             Maecenas sollicitudin laoreet vehicula. Mauris eget risus massa. 
             Fusce hendrerit, tellus et sodales cursus, augue neque dapibus urna, 
             at laoreet nibh sapien tempus lorem. Fusce at tristique nisl. 
             Maecenas rhoncus sed metus ac cursus. Integer vitae enim placerat, 
             eleifend risus nec, suscipit nunc. Quisque euismod molestie pellentesque. 
             Vivamus in lectus aliquet ante dapibus varius vel sit amet neque. 
             Phasellus a tempus mi, non mattis augue. Quisque non blandit dolor, at fermentum odio. 
             Fusce tempor aliquet posuere. Aliquam eleifend volutpat urna vel convallis.
            </p>
            <span>1 min ago</span>
          </div>
        </div>
        <div className='message own'>
          <div className='texts'>
          <img
            src="https://images.pexels.com/photos/7381200/pexels-photo-7381200.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
              alt=""
          />
            <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
             Maecenas sollicitudin laoreet vehicula. Mauris eget risus massa. 
             Fusce hendrerit, tellus et sodales cursus, augue neque dapibus urna, 
             at laoreet nibh sapien tempus lorem. Fusce at tristique nisl. 
             Maecenas rhoncus sed metus ac cursus. Integer vitae enim placerat, 
             eleifend risus nec, suscipit nunc. Quisque euismod molestie pellentesque. 
             Vivamus in lectus aliquet ante dapibus varius vel sit amet neque. 
             Phasellus a tempus mi, non mattis augue. Quisque non blandit dolor, at fermentum odio. 
             Fusce tempor aliquet posuere. Aliquam eleifend volutpat urna vel convallis.
            </p>
            <span>1 min ago</span>
          </div>
        </div>
        <div className='message'>
          <img src='/avatar.png' alt=''/>
          <div className='texts'>
            <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
             Maecenas sollicitudin laoreet vehicula. Mauris eget risus massa. 
             Fusce hendrerit, tellus et sodales cursus, augue neque dapibus urna, 
             at laoreet nibh sapien tempus lorem. Fusce at tristique nisl. 
             Maecenas rhoncus sed metus ac cursus. Integer vitae enim placerat, 
             eleifend risus nec, suscipit nunc. Quisque euismod molestie pellentesque. 
             Vivamus in lectus aliquet ante dapibus varius vel sit amet neque. 
             Phasellus a tempus mi, non mattis augue. Quisque non blandit dolor, at fermentum odio. 
             Fusce tempor aliquet posuere. Aliquam eleifend volutpat urna vel convallis.
            </p>
            <span>1 min ago</span>
          </div>
        </div>
        <div className='message'>
          <img src='/avatar.png' alt=''/>
          <div className='texts'>
            <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
             Maecenas sollicitudin laoreet vehicula. Mauris eget risus massa. 
             Fusce hendrerit, tellus et sodales cursus, augue neque dapibus urna, 
             at laoreet nibh sapien tempus lorem. Fusce at tristique nisl. 
             Maecenas rhoncus sed metus ac cursus. Integer vitae enim placerat, 
             eleifend risus nec, suscipit nunc. Quisque euismod molestie pellentesque. 
             Vivamus in lectus aliquet ante dapibus varius vel sit amet neque. 
             Phasellus a tempus mi, non mattis augue. Quisque non blandit dolor, at fermentum odio. 
             Fusce tempor aliquet posuere. Aliquam eleifend volutpat urna vel convallis.
            </p>
            <span>1 min ago</span>
          </div>
        </div>
        <div className='message own'>
          <div className='texts'>
            <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
             Maecenas sollicitudin laoreet vehicula. Mauris eget risus massa. 
             Fusce hendrerit, tellus et sodales cursus, augue neque dapibus urna, 
             at laoreet nibh sapien tempus lorem. Fusce at tristique nisl. 
             Maecenas rhoncus sed metus ac cursus. Integer vitae enim placerat, 
             eleifend risus nec, suscipit nunc. Quisque euismod molestie pellentesque. 
             Vivamus in lectus aliquet ante dapibus varius vel sit amet neque. 
             Phasellus a tempus mi, non mattis augue. Quisque non blandit dolor, at fermentum odio. 
             Fusce tempor aliquet posuere. Aliquam eleifend volutpat urna vel convallis.
            </p>
            <span>1 min ago</span>
          </div>
        </div>
        <div className='message'>
          <img src='/avatar.png' alt=''/>
          <div className='texts'>
            <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
             Maecenas sollicitudin laoreet vehicula. Mauris eget risus massa. 
             Fusce hendrerit, tellus et sodales cursus, augue neque dapibus urna, 
             at laoreet nibh sapien tempus lorem. Fusce at tristique nisl. 
             Maecenas rhoncus sed metus ac cursus. Integer vitae enim placerat, 
             eleifend risus nec, suscipit nunc. Quisque euismod molestie pellentesque. 
             Vivamus in lectus aliquet ante dapibus varius vel sit amet neque. 
             Phasellus a tempus mi, non mattis augue. Quisque non blandit dolor, at fermentum odio. 
             Fusce tempor aliquet posuere. Aliquam eleifend volutpat urna vel convallis.
            </p>
            <span>1 min ago</span>
          </div>
        </div>
        <div ref={endRef}></div>
      </div>
      <div className='bottom'>
        <div className='icons'>
          <ImageIcon />
          <CameraAltIcon />
          <KeyboardVoiceIcon />
        </div>
        <input 
          type='text' 
          placeholder='Type a message' 
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className='emoji'>
          <EmojiEmotionsIcon onClick={() => setOpen((prev) => !prev)} />
          {open && (
            <div className='picker'>
              <EmojiPicker onEmojiClick={handleEmoji} />
            </div>
          )}
        </div>
        <button className='sendButton'>
          <ArrowUpwardIcon/>
        </button>
      </div>
    </div>
  );
};

export default Chat;

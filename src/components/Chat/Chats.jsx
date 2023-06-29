import React from 'react';
import './Chats.css';
import ChatPreview from './ChatPreview';

function Chats({ cls }) {
  if (cls === "None")
  cls = ""
  return (
    <>
      <div className={`chats ${cls}`}>
        <div className="chat-heading">Chats</div>
        <ChatPreview name="Name" img_source={"./logo192.png"}></ChatPreview>
      </div>
    </>
  );
}

export default Chats;

import React from 'react';
import './ChatPreview.css';

function ChatPreview({ name, setActiveReceipient, setActiveMenu }) {
  const handleClick = () => {
    setActiveReceipient(name);
    setActiveMenu('contacts'); 
    setTimeout(() => {
      setActiveMenu('chats')
    }, 1); 
  };

  return (
    <>
      <div onClick={() => {handleClick(name)}} className="user-contact-container">
        <div className="name-image-request">
          <div className="user-contact-image-container">
            <img
              className="user-search-image"
              src={`http://localhost:4000/api/profile-pictures/${encodeURIComponent(name)}`}
              alt={name}
            />
          </div>
          <div className="user-contact-username">{name}</div>
        </div>
      </div>
    </>
  );
}

export default ChatPreview;

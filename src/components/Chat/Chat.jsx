import React, { useState } from 'react';
import './Chat.css';
import SearchUser from '../SearchUser';
function Chat({ user }) {
  const [showChat, setShowChat] = useState(true);

  const handleAddUserClick = () => {
    setShowChat(false);
  };

  const handleGoBackClick = () => {
    setShowChat(true);
  };

  return (
    <>
      {!showChat ? (
        <SearchUser handleGoBackClick={handleGoBackClick} user={user} />
      ) : (
        <div className="user-chat-main-container">
          <div className="chat-topbar">
            <input type="text" placeholder="Search message" />
            <button className="button small" onClick={handleAddUserClick}>
              Add User <i className="fa-solid fa-user-plus"></i>
            </button>
          </div>
          <div className="chat-exchange-window">chat goes here</div>
        </div>
      )}
    </>
  );
}


export default Chat;

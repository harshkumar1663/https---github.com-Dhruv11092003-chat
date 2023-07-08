import React, { useState } from 'react';
import './Chat.css';
import SearchUser from '../SearchUser';
import Button from '../Button';
import Message from '../Message';

function Chat({ user }) {
  const [showChat, setShowChat] = useState(true);
  const [messages, setMessages] = useState([]); // State for storing messages

  const handleAddUserClick = () => {
    setShowChat(false);
  };

  const handleGoBackClick = () => {
    setShowChat(true);
  };

  const handleMessageSend = (message) => {
    // Add the message to the messages array
    setMessages([...messages, message]);
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
          <div className="chat-exchange-window">
            <Message label={"Hey yo"} cls={"message sender-msg"}></Message>
            {messages.map((message, index) => (
              // <div key={index}>{message}</div>
              <Message key={index} label={message}></Message>
            ))}
          </div>
          <div className="sticky-bar">
            <input type="text" className={"input"} placeholder="Type your message..." />
            <Button btnclass={"button send"} label={"Send"}></Button>
            </div>
            {/* <button className="button send-button" onClick={handleMessageSend}>
                Send
              </button> */}
          </div>
      )}
    </>
  );
}

export default Chat;

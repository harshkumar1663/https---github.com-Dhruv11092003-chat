import React, { useState, useEffect } from 'react';
import './Chat.css';
import SearchUser from '../SearchUser';
import Button from '../Button';
import Message from '../Message';
import axios from 'axios';

function Chat({ user, recipient }) {
  const [showChat, setShowChat] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');

  const api = axios.create({
    baseURL: 'http://localhost:4000'
  });

  const handleAddUserClick = () => {
    setShowChat(false);
  };

  const handleGoBackClick = () => {
    setShowChat(true);
  };

  const handleMessageSend = (messageContent) => {
    const message = {
      sender: user,
      content: messageContent
    };

    api
      .post('/api/send-message', { sender: user, recipient: recipient, content: messageContent })
      .then((response) => {
        const newMessage = response.data;
        setMessages([...messages, newMessage]);
        setMessageInput(''); 
      })
      .catch((error) => {
        console.error('Failed to send message', error);
      });
  };

  const handleInputChange = (event) => {
    setMessageInput(event.target.value);
  };

  const handleInputKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); 
      handleMessageSend(messageInput);
    }
  };

  useEffect(() => {
    api
      .get(`/api/chats/${recipient}`)
      .then((response) => {
        const chatData = response.data.chats;

        if (Array.isArray(chatData) && chatData.length > 0) {
          const chat = chatData[0];
          setContacts([chat.contact]);
          setMessages(chat.messages);
        }
        console.log(messages, user)
      })
      .catch((error) => {
        console.error('Failed to retrieve chats', error);
      });
  }, [recipient]);

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
            {messages.map((message, index) => (
              <Message
                key={index}
                label={message.content}
                cls={message.sender === recipient ? 'message sender-msg' : 'message receiver-msg'}
              ></Message>

            ))}
          </div>
          <div className="sticky-bar">
            <input
              type="text"
              className="input"
              placeholder="Type your message..."
              value={messageInput}
              onChange={handleInputChange}
              onKeyPress={handleInputKeyPress}
            />
            <Button
              btnclass="button send"
              label="Send"
              toggleComponent={() => handleMessageSend(messageInput)}
            ></Button>
          </div>
        </div>
      )}
    </>
  );
}

export default Chat;

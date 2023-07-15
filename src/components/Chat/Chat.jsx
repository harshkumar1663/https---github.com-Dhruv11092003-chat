import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';
import SearchUser from '../SearchUser';
import Button from '../Button';
import Message from '../Message';
import axios from 'axios';
import { io } from 'socket.io-client';

function Chat({ user, recipient }) {
  const [showChat, setShowChat] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const chatWindowRef = useRef(null);

  const api = axios.create({
    baseURL: 'http://localhost:4000'
  });

  const socket = io('http://localhost:4000');

  useEffect(() => {
    api.get(`/api/chats/${recipient}`)
      .then((response) => {
        const chatData = response.data.chats;
        if (Array.isArray(chatData) && chatData.length > 0) {
          const chat = chatData[0];
          setContacts([chat.contact]);
          setMessages(chat.messages);
        }
      })
      .catch((error) => {
        console.error('Failed to retrieve chats', error);
      });
  
   
  }, [0]);
  
  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
  
    return () => {
      socket.off('message');
    };
  }, []);

  const handleAddUserClick = () => {
    setShowChat(false);
  };

  const handleGoBackClick = () => {
    setShowChat(true);
  };

  const handleMessageSend = (messageContent) => {
    const message = {
      sender: user,
      recipient: recipient,
      content: messageContent
    };

    socket.emit('message', message);
    setMessageInput('');
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
    // to always scroll to the bottom of the window
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

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
          <div className="chat-exchange-window" ref={chatWindowRef}>
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

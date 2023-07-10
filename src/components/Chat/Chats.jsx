import React, { useEffect, useState } from 'react';
import './Chats.css';
import ChatPreview from './ChatPreview';
import axios from 'axios';

function Chats({ cls, user , setActiveReceipient }) {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const api = axios.create({
      baseURL: 'http://localhost:4000'
    });

    const fetchContacts = async () => {
      try {
        const response = await api.get(`/api/chat-data/${user}`);
        console.log(user)
        console.log(response.data.chatData)
        setContacts(response.data.chatData);
      } catch (error) {
        console.error('Failed to fetch chat data', error);
      }
    };

    fetchContacts();
  }, []);



  const filteredContacts = contacts.filter((contact) => { return (contact.contact !== user) && (contact.messages.length > 0); 
  });

  if (cls === 'None') cls = '';

  return (
    <>
      <div className={`chats ${cls}`}>
        <div className="chat-heading">Chats</div>
        {filteredContacts.map((contact) => (
          <ChatPreview
            key={contact.contact}
            name={contact.contact}
            img_source={contact.profilePicture}
            messages={contact.messages}
            setActiveReceipient = {setActiveReceipient}
          />
        ))}
      </div>
    </>
  );
}

export default Chats;

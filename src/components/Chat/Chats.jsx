import React, { useEffect, useState } from 'react';
import './Chats.css';
import ChatPreview from './ChatPreview';
import axios from 'axios';

function Chats({ user, setActiveMenu, setActiveReceipient }) {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const api = axios.create({
      baseURL: 'http://localhost:4000'
    });

    const fetchContacts = async () => {
      try {
        const response = await api.get(`/api/chat-data/${user}`);
        setContacts(response.data.chatData);
      } catch (error) {
        console.error('Failed to fetch chat data', error);
      }
    };

    fetchContacts();
  }, [user]);

  const filteredContacts = contacts.filter(
    (contact) => contact.contact !== user 
  );

  return (
    <>
      <div className="chats">
        <div className="chat-heading">Chats</div>
        {filteredContacts.map((contact) => (
          <ChatPreview
            key={contact.contact}
            name={contact.contact}
            setActiveReceipient={setActiveReceipient}
            setActiveMenu={setActiveMenu}
          />
        ))}
      </div>
    </>
  );
}

export default Chats;

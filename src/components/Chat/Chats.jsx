import React, { useEffect, useState } from 'react';
import './Chats.css';
import ChatPreview from './ChatPreview';
import axios from 'axios';

function Chats({ cls, user }) {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get(`/api/contacts/${user}`);
        setContacts(response.data.contacts);
      } catch (error) {
        console.error('Failed to fetch contacts', error);
      }
    };

    fetchContacts();
  }, [user]);

  const filteredContacts = contacts.filter((contact) => {
    return contact.messages.length > 0; // Filter contacts with at least one chat message
  });

  if (cls === 'None') cls = '';

  return (
    <>
      <div className={`chats ${cls}`}>
        <div className="chat-heading">Chats</div>
        {filteredContacts.map((contact) => (
          <ChatPreview
            key={contact.username}
            name={contact.username}
            img_source={contact.profilePicture}
          />
        ))}
      </div>
    </>
  );
}

export default Chats;

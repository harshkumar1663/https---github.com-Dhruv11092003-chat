import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Contacts({ user }) {
  const api = axios.create({
    baseURL: 'http://localhost:4000'
  });

  const [contacts, setContacts] = useState([]);
  const username = user;

  useEffect(() => {
    getContacts();
  }, []);

  const getContacts = () => {
    api
      .get(`/api/contacts/${username}`)
      .then((response) => {
        console.log(response.data);
        setContacts(response.data.contacts); // Update state with response.data.contacts
      })
      .catch((error) => {
        console.error('Failed to get contacts', error);
      });
  };

  return (
    <>
<div className="request-window-wrapper">
        <div className="request-window-heading">
          <h3>Your Contacts</h3>
        </div>
        <div className="chat-exchange-window">
          {contacts.map((contact) => (
            <div key={contact.username} className='user-request-container'>
              <div className="name-image-request">
                <div className="user-search-image-container">
                  <img
                    className='user-search-image'
                    src={`http://localhost:4000/api/profile-pictures/${encodeURIComponent(contact.profilePicture)}`}
                    alt={contact.username}
                  />
                </div>
                <div className="user-request-username">
                  {contact.username}
                </div>
              </div>
              {/* <div className="requests-button-container">
                <Button label={<i class="fa-solid fa-check"></i>} toggleComponent={() => acceptFriendRequest(request.sender)} btnclass={"button request-accept"}></Button>
                <Button label={<i class="fa-solid fa-x"></i>} toggleComponent={() => rejectFriendRequest(request.sender)} btnclass={"button request-accept"}></Button>
              </div> */}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Contacts;
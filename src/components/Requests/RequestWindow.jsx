import React from 'react'
import './RequestWindow.css'
import { useState, useEffect } from 'react'
import Button from '../Button';
import axios from 'axios';

function RequestWindow({ user }) {
  const api = axios.create({
    baseURL: 'http://localhost:4000'
  });

  const username = user;
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    getFriendRequests();
  }, []);

  const getFriendRequests = () => {
    api
      .get(`/api/friend-requests/${username}`)
      .then((response) => {
        setFriendRequests(response.data.friendRequests)
        console.log(response.data.friendRequests)
      })
      .catch((error) => { console.error("Failed to fetch friend requests ", error) })
  }
  const acceptFriendRequest = (sender) => {
    api
      .post('/api/accept-friend-request' , {sender , receiver : username })
      .then((response)=>{
        console.log(response.data)
        alert("Accepted! User added to your contacts.")
        getFriendRequests()
      })
      .catch((error)=>{
        console.error(error)
      })
  }

  const rejectFriendRequest = (sender) => {
    api
      .post('/api/reject-friend-request', { sender, receiver: username })
      .then((response) => {
        console.log(response.data.message);
        // Refresh friend requests
        getFriendRequests();
      })
      .catch((error) => {
        console.error("Failed to reject friend request", error.response.data.message);
      });
  };

  return (
    <>
      <div className="request-window-wrapper">
        <div className="request-window-heading">
          <h3>Friend Requests</h3>
        </div>
        <div className="chat-exchange-window">
          {friendRequests.map((request) => (
            <div key={request.sender} className='user-request-container'>
              <div className="name-image-request">
                <div className="user-search-image-container">
                  <img
                    className='user-search-image'
                    src={`http://localhost:4000/api/profile-pictures/${encodeURIComponent(request.profilePicture)}`}
                    alt={request.sender}
                  />
                </div>
                <div className="user-request-username">
                  {request.sender}
                </div>
              </div>
              <div className="requests-button-container">
                <Button label={<i class="fa-solid fa-check"></i>} toggleComponent={() => acceptFriendRequest(request.sender)} btnclass={"button request-accept"}></Button>
                <Button label={<i class="fa-solid fa-x"></i>} toggleComponent={() => rejectFriendRequest(request.sender)} btnclass={"button request-accept"}></Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default RequestWindow

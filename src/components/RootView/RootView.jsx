import React, { useState, useEffect } from 'react';
import './RootView.css';
import axios from 'axios';
import RootViewPreview from './RootViewPreview';
import Button from '../Button';

function RootView() {
  const [users, setUsers] = useState([]);
  const api = axios.create({
    baseURL: 'http://localhost:4000'
  });
  useEffect(() => {
    api.get('/api/users')
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error('Failed to fetch users', error);
      });
  }, []);

  const handleToggleBlockedStatus = (userId) => {
    const userToUpdate = users.find((user) => user._id === userId);
    if (!userToUpdate) {
      return;
    }
    userToUpdate.isBlocked = !userToUpdate.isBlocked;
    api.put(`/api/users/${userId}`, { blocked: userToUpdate.isBlocked })
      .then(() => {
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user._id === userId ? userToUpdate : user))
        );
      })
      .catch((error) => {
        console.error('Failed to update user status', error);
      });
  };

  return (
    <>
      <div className="main-window">
        <div className="root-window">
          <div className="root-heading">
            <h3>Users</h3>
          </div>
          <div className="user-list">
            {users.map((user) => (
              <RootViewPreview id={user._id} username={user.username} isBlocked={user.isBlocked} profilePic={user.profilePicture} handleToggleBlockedStatus={handleToggleBlockedStatus} />
            ))}
          <div className='root-exit'>
            <a href="/">
              <Button label={"Exit"} btnclass={'button request small'}></Button>
            </a>
          </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RootView;

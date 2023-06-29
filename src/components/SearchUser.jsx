import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import './SearchUser.css';
import Button from './Button';

function SearchUser({ handleGoBackClick, user }) {
  const api = axios.create({
    baseURL: 'http://localhost:4000'
  });

  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');

  const handleSearchChange = (e) => {
    const { value } = e.target;
    setSearchText(value);
    if (value.trim() === '') {
      setSearchResults([]);
      return;
    }
    api
      .get(`/api/search-users-data/${value}`)
      .then((response) => {
        const filteredResults = response.data.filter(
          (result) => result.username !== user
        );
        setSearchResults(filteredResults);
      })
      .catch((error) => {
        console.error('Failed to fetch search results', error);
      });
  };

  const handleAddUser = (username) => {
    api
      .post('/api/send-friend-request', { user, username })
      .then((response) => {
        // setAlertMessage(response.data.message);
        alert(response.data.message)
      })
      .catch((error) => {
        // setAlertMessage(error.response.data.message);
        alert(error.response.data.message)
      });
  };

  return (
    <>
      <div className="user-chat-main-container">
        <div className="chat-topbar">
          <input
            type="text"
            placeholder="Search User"
            value={searchText}
            onChange={handleSearchChange}
          />
          <button className="button small" onClick={handleGoBackClick}>
            Back <i className="fa-solid fa-arrow-left"></i>
          </button>
        </div>
        <div className="chat-exchange-window">
          {searchResults.map((users) => (
            <div key={users._id} className='user-search-container'>
              <div className="name-image">
                <div className="user-search-image-container">
                  <img
                    className='user-search-image'
                    src={`http://localhost:4000/api/profile-pictures/${encodeURIComponent(users.profilePicture)}`}
                    alt={users.username}
                  />
                </div>
                <div className="user-search-username">
                  {users.username}
                </div>
              </div>
              <Button
                label="Send Request"
                toggleComponent={() => handleAddUser(users.username)}
                btnclass={"button request"}
              ></Button>
            </div>
          ))}
        </div>
      </div>
      {alertMessage && (
        <div className="alert">{alertMessage}</div>
      )}
    </>
  );
}

export default SearchUser;

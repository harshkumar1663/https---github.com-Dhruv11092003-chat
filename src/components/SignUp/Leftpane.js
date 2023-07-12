import React, { useState } from 'react';
import './Leftpane.css';
import Input from '../Input';
import Button from '../Button';
import axios from 'axios';
import Alert from '../Alert/Alert'

const api = axios.create({
  baseURL: 'http://localhost:4000',
});

function Leftpane({ toggleComponent }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedProfilePicture, setSelectedProfilePicture] = useState(null);
  const [error, setError] = useState('');
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showPopup, setShowPopup] = useState(false);


  const checkUsernameAvailability = (username) => {
    api
      .get(`/api/check-username/${username}`)
      .then((response) => {
        setIsUsernameAvailable(response.data.available);
      })
      .catch((error) => {
        console.error(error);
        setIsUsernameAvailable(true);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // username = unique
    if (!isUsernameAvailable) {
      setError('Username is already taken');
      return;
    }

    // password strength
    const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
    if (!passwordRegex.test(password)) {
      setError(
        'Password must contain at least 1 number, 1 special character, 1 lowercase character, 1 uppercase character, and be 8-20 characters long'
      );
      return;
    }

    // DP selected ?
    if (!selectedProfilePicture) {
      setError('Please select a profile picture');
      return;
    }

    const userDetails = {
      username,
      password,
      profilePicture: selectedProfilePicture,
    };

    console.log(userDetails);
    if (username !== "") {
      api
        .post('/api/signup', userDetails, {
          headers: { 'Content-Type': 'application/json' },
        })
      .then((response) => {
        if (response.status === 201) {
          setShowPopup(true)
          setTimeout(() => {
            console.log(username, "Login successful");
            // alert('Sign up successful redirecting to HomePage');
            window.location.reload()
            setShowPopup(false);
          }, 2000);
        }
        else if (response.status === 401) {
          alert("Invalid Username or Password")
        } else {
          alert('Sign up failed');
        }
      })
      .catch((error) => {
        console.error(error);
      });

      setUsername('');
      setPassword('');
      setSelectedProfilePicture(null);
      setError('');
    }
    else {
      setError("Please write a username")
    }
  }


  const handleUsername = (event) => {
    const newUsername = event.target.value;
    setUsername(newUsername);
    if (newUsername !== '')
      checkUsernameAvailability(newUsername);
  };


  const handleProfilePictureSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedExtensions = ['jpg', 'jpeg', 'png'];
      const fileExtension = file.name.split('.').pop().toLowerCase();

      if (!allowedExtensions.includes(fileExtension)) {
        setError('Invalid file type. Only JPG, JPEG, and PNG files are allowed.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  return (
    <>
    {showPopup && <Alert message="Sign Up Successfull, redirecting to home page..." />}
      <div className="left-pane-signup">
        <div className="signin-cont">
          <h2 className="signin">Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <Input
              label="Username"
              onChange={handleUsername}
              placeholder="Enter your username"
              value={username}
            />
            {!isUsernameAvailable && (
              <div className="error ml-40">Username is already taken</div>
            )}
            <Input label="Password" placeholder="Enter your password" value={password}
              type={showPassword ? 'text' : 'password'}
              onChange={(e) => setPassword(e.target.value)}
              icon={showPassword ? (
                <i className="fa-solid fa-eye-slash"></i>
              ) : (
                <i className="fa-solid fa-eye"></i>
              )}
              onIconClick={() => setShowPassword(!showPassword)}
            />
            <div className="ml-40">
              <label htmlFor="profilePicture" className='select-dp'>Click here to select Profile Picture</label>
              <input
                className=""
                type="file"
                id="profilePicture"
                accept=".jpg, .jpeg, .png"
                onChange={handleProfilePictureSelect}
              />
            </div>
            {selectedProfilePicture && (
              <div className="profile-picture ml-40">
                <img src={selectedProfilePicture} alt="picture" />
              </div>
            )}
            <Button
              label="Sign Up"
              type="submit"
              btnclass="btn-purple ml-40 button"
              toggleComponent={handleSubmit}
            />
            {error && <div className="error ml-40">{error}</div>}
          </form>
        </div>
      </div>
    </>
  );
}

export default Leftpane;

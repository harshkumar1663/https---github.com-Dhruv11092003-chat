import React, { useState } from 'react';
import './Rightpane.css';
import Input from '../Input';
import Button from '../Button';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000',
});

function Rightpane({ toggleComponent, handleLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); 


  const handleSignIn = (e) => {
    e.preventDefault();

    const userDetails = {
      username,
      password,
    };

    api
      .post('/api/signin', userDetails, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then((response) => {
        if (response.status === 200) {
          let name = username
          // alert('Sign in successful');
          handleLogin(name); // Call handleLogin on successful sign-in
        } else if (response.status === 401) {
          alert('Invalid Username or Password');
        } else {
          alert('Sign in failed');
        }
      })
      .catch((error) => {
        console.error('Failed to sign in', error);
        alert('Sign in failed');
      });

    setUsername('');
    setPassword('');
    setError('');
  };

  return (
    <>
      <div className="right-pane">
        <div className="signin-cont">
          <h2 className="signin">Sign In</h2>
          <form onSubmit={handleLogin}>
            <Input label="Username" placeholder="Enter your username" value={username}onChange={(e) => setUsername(e.target.value)}/>
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
            <Button label="Log In" toggleComponent={handleSignIn} type="submit" btnclass="btn-purple ml-40 button" />
            {error && <div className="error ml-40">{error}</div>}
          </form>
        </div>
      </div>
    </>
  );
}

export default Rightpane;

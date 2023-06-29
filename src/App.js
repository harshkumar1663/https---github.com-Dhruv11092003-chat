import React, { useState } from 'react';
import './App.css';
import Signin from './components/Signin/Signin';
import Signup from './components/SignUp/Signup';
import { CSSTransition } from 'react-transition-group';
import ChatWindow from './components/Chat/ChatWindow';
import userReducer, { setUser, clearUser } from './components/userReducer';
import { useDispatch , useSelector } from 'react-redux';

function App() {
  const user = useSelector((state) => state);
  const dispatch = useDispatch();

  const [showSignIn, setShowSignIn] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Add isLoggedIn state to specify whether user logged in or not

  const toggleComponent = () => {
    setShowSignIn(!showSignIn); // flag whether to show signin/signup or not 
    dispatch(clearUser()); 
  };

  const handleLogin = (username) => {
    console.log(username , "Login successful");
    dispatch(setUser(username)); // storing logged in username
    setIsLoggedIn(true);
  };

  if (isLoggedIn) {
    // Render chat window when the user is logged in
    return <ChatWindow user={user}/>;
  }

  return (
    <>
      <div className="main-pane-cont">
        <CSSTransition in={showSignIn} classNames="fade" timeout={200} unmountOnExit mountOnEnter >
          <Signin toggleComponent={toggleComponent} handleLogin={handleLogin} />
        </CSSTransition>
        <CSSTransition in={!showSignIn} classNames="fade" timeout={200} unmountOnExit mountOnEnter >
          <Signup toggleComponent={toggleComponent} handleLogin={handleLogin} />
        </CSSTransition>
      </div>
    </>
  );
}

export default App;

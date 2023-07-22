import React, { useState } from 'react';
import './App.css';
import Signin from './components/Signin/Signin';
import Signup from './components/SignUp/Signup';
import { CSSTransition } from 'react-transition-group';
import ChatWindow from './components/Chat/ChatWindow';
import userReducer, { setUser, clearUser } from './components/userReducer';
import { useDispatch, useSelector } from 'react-redux';
import Alert from './components/Alert/Alert';
import RootView from './components/RootView/RootView';

function App() {
  const user = useSelector((state) => state);
  const dispatch = useDispatch();
  const [showPopup, setShowPopup] = useState(false);
  const [showSignIn, setShowSignIn] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Add isLoggedIn state to specify whether user logged in or not


  const toggleComponent = () => {
    setShowSignIn(!showSignIn); // flag whether to show signin/signup or not 
    dispatch(clearUser());
  };

  const handleLogin = (username) => {
    setShowPopup(true);
    setTimeout(() => {
      console.log(username, "Login successful");
      dispatch(setUser(username)); // storing logged in username
      setIsLoggedIn(true);
      setShowPopup(false);
    }, 2000);
  };

  if (isLoggedIn) {
    // Render chat window when the user is logged in
    if (user === "root")
    return <RootView/>
    else
    return <ChatWindow user={user} />;
  }

  return (
    <>
      <div className="main-pane-cont">
        <CSSTransition in={showSignIn} classNames="fade" timeout={200} unmountOnExit mountOnEnter >
          <>
            <Signin toggleComponent={toggleComponent} handleLogin={handleLogin} />
            {showPopup && <Alert message="Sign In Successfull !!" />}
          </>
        </CSSTransition>
        <CSSTransition in={!showSignIn} classNames="fade" timeout={200} unmountOnExit mountOnEnter >
          <>
          <Signup toggleComponent={toggleComponent}  />
          {showPopup && <Alert message="Sign Up Successfull, redirecting to home page..." />}
          </>
        </CSSTransition>
      </div>
    </>
  );
}

export default App;

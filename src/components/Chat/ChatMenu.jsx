import React, { useEffect, useRef } from 'react';
import './ChatMenu.css';

function ChatMenu({ setActiveMenu }) {
  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };

  const logout = () => {
    // Perform any necessary logout actions
    window.location.href = '/'; // Redirect to the home page after logout
    alert("You are logged out due to inactivity")
  };

  const timerRef = useRef(null); // Reference to the timer

  const startLogoutTimer = () => {
    timerRef.current = setTimeout(logout,5*60000); // 5 minute in milliseconds
  };

  const resetLogoutTimer = () => {
    clearTimeout(timerRef.current); // Clear the previous timer
    startLogoutTimer(); // Start a new timer
  };

  useEffect(() => {
    // Add event listeners for user activity
    document.addEventListener('mousemove', resetLogoutTimer);
    document.addEventListener('keydown', resetLogoutTimer);
    document.addEventListener('mousedown', resetLogoutTimer);
    document.addEventListener('touchstart', resetLogoutTimer);
    document.addEventListener('touchend', resetLogoutTimer);

    startLogoutTimer(); // Start the initial timer

    return () => {
      // Clean up event listeners on component unmount
      clearTimeout(timerRef.current);
      document.removeEventListener('mousemove', resetLogoutTimer);
      document.removeEventListener('keydown', resetLogoutTimer);
      document.removeEventListener('mousedown', resetLogoutTimer);
      document.removeEventListener('touchstart', resetLogoutTimer);
      document.removeEventListener('touchend', resetLogoutTimer);
    };
  }, []);

  return (
    <>
      <div className="menu-container">
        <div className="profile chat-menu-item">
          <p>Profile</p>
        </div>
        <div className="chat chat-menu-item">
          <p onClick={() => handleMenuClick('chats')}>Chats</p>
        </div>
        <div className="contacts chat-menu-item">
          <p>Contacts</p>
        </div>
        <div className="friend-requests chat-menu-item">
          <p onClick={() => handleMenuClick('friend-requests')}>
            Friend Requests
          </p>
        </div>
        <div className="settings chat-menu-item">
          <p>Settings</p>
        </div>
        <div className="logout chat-menu-item">
          <a href="/" onClick={logout}>
            Logout
          </a>
        </div>
      </div>
    </>
  );
}

export default ChatMenu;
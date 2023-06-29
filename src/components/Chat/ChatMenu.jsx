import React from 'react'
import './ChatMenu.css'
function ChatMenu({ setActiveMenu }) {
    const handleMenuClick = (menu) => {
      setActiveMenu(menu);
    };
  
    return (
      <>
        <div className="menu-container">
          <div className="profile chat-menu-item">
            <p>Profile</p>
          </div>
          <div className="chat chat-menu-item">
            <p onClick={() => handleMenuClick("chats")} >Chats</p>
          </div>
          <div className="contacts chat-menu-item">
            <p onClick={()=>{handleMenuClick("contacts")}}>Contacts</p>
          </div>
          <div className="friend-requests chat-menu-item">
            <p onClick={() => handleMenuClick("friend-requests")}>
              Friend Requests
            </p>
          </div>
          <div className="settings chat-menu-item">
            <p>Settings</p>
          </div>
          <div className="logout chat-menu-item">
            <a href='/'>Logout</a>
          </div>
        </div>
      </>
    );
  }
  
export default ChatMenu

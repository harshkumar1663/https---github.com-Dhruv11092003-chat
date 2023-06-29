import React, { useState } from 'react'
import './ChatWindow.css'
import ChatMenu from './ChatMenu'
import Chats from './Chats'
import Chat from './Chat'
import RequestWindow from '../Requests/RequestWindow'
import Contacts from '../Contacts/Contacts'

function ChatWindow({ user }) {
    const [activeMenu, setActiveMenu] = useState("contacts");

    return (
        <>
          <div className="hidden">
            <div className="warning">DEVICE NOT SUPPORTED</div>
          </div>
          <div className="main-window">
            <div className="chat-window">
              <ChatMenu setActiveMenu={setActiveMenu} />
              {activeMenu === "chats" && <Chats />}
              {activeMenu === "chats" && <Chat user={user} />}
              {activeMenu === "friend-requests" && <RequestWindow user={user} />}
              {activeMenu === "contacts" && <Contacts user={user}/>}
            </div>
          </div>
        </>
      );
    }


export default ChatWindow
